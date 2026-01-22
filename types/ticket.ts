export type TicketStatus = "open" | "in-progress" | "resolved" | "closed";

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export interface CreateTicketPayload {
  subject: string;
  description: string;
  status?: TicketStatus;
  priority?: "low" | "medium" | "high" | "urgent";
}

export interface UpdateTicketPayload {
  subject?: string;
  description?: string;
  status?: TicketStatus;
  priority?: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
}

// WebSocket message types
export type WebSocketMessageType =
  | "TICKET_CREATED"
  | "TICKET_UPDATED"
  | "TICKET_DELETED";

export interface WebSocketMessage {
  type: WebSocketMessageType;
  data: Ticket | { id: string };
}
