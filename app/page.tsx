"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AxiosError } from "axios";
import { ticketsApi } from "@/services/api";
import { useWebSocket } from "@/hooks/useWebSocket";
import { StorageKeys } from "@/lib/constants";
import type { Ticket, WebSocketMessage } from "@/types/ticket";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, LogOut } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // WebSocket connection for live updates
  const { isConnected } = useWebSocket({
    onMessage: (message: WebSocketMessage) => {
      console.log("WebSocket message received:", message);

      switch (message.type) {
        case "TICKET_CREATED":
          // Add new ticket to the list
          setTickets((prev) => [message.data as Ticket, ...prev]);
          break;

        case "TICKET_UPDATED":
          // Update existing ticket
          setTickets((prev) =>
            prev.map((ticket) =>
              ticket.id === (message.data as Ticket).id
                ? (message.data as Ticket)
                : ticket,
            ),
          );
          break;

        case "TICKET_DELETED":
          // Remove ticket from the list
          setTickets((prev) =>
            prev.filter(
              (ticket) => ticket.id !== (message.data as { id: string }).id,
            ),
          );
          break;
      }
    },
  });

  // Fetch initial tickets on mount
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem(StorageKeys.AUTH_TOKEN);
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const data = await ticketsApi.getAll();
        setTickets(data);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || "Failed to load tickets");
        } else {
          setError("Failed to load tickets");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem(StorageKeys.AUTH_TOKEN);
    router.push("/auth/login");
  };

  const getStatusColor = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "in-progress":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "resolved":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "closed":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "low":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading tickets...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tickets Dashboard</h1>
            <p className="text-muted-foreground">
              Live view of all tickets •{" "}
              {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/tickets">
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Manage Tickets
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Tickets Grid */}
        {tickets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Eye className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No tickets found</p>
              <p className="text-sm text-muted-foreground">
                Create your first ticket to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="transition-shadow hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-1">
                      {ticket.subject}
                    </CardTitle>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {ticket.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Created:</span>
                    <span>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {ticket.assignedTo && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Assigned to:
                      </span>
                      <span>{ticket.assignedTo}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
