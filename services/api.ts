import { axiosInstance } from "@/lib/axios";
import type {
  Ticket,
  CreateTicketPayload,
  UpdateTicketPayload,
} from "@/types/ticket";
import type { LoginPayload, SignupPayload, AuthResponse } from "@/types/auth";

// ==================== Auth API ====================
export const authApi = {
  /**
   * Login with email and password
   */
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/login",
      payload,
    );
    return response.data;
  },

  /**
   * Register a new user
   */
  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/signup",
      payload,
    );
    return response.data;
  },

  /**
   * Logout (optional - client-side token removal)
   */
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  },
};

// ==================== Tickets API ====================
export const ticketsApi = {
  /**
   * Get all tickets
   */
  getAll: async (): Promise<Ticket[]> => {
    const response = await axiosInstance.get<Ticket[]>("/api/tickets");
    return response.data;
  },

  /**
   * Get a single ticket by ID
   */
  getById: async (id: string): Promise<Ticket> => {
    const response = await axiosInstance.get<Ticket>(`/api/tickets/${id}`);
    return response.data;
  },

  /**
   * Create a new ticket
   */
  create: async (payload: CreateTicketPayload): Promise<Ticket> => {
    const response = await axiosInstance.post<Ticket>("/api/tickets", payload);
    return response.data;
  },

  /**
   * Update an existing ticket
   */
  update: async (id: string, payload: UpdateTicketPayload): Promise<Ticket> => {
    const response = await axiosInstance.put<Ticket>(
      `/api/tickets/${id}`,
      payload,
    );
    return response.data;
  },

  /**
   * Delete a ticket
   */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/tickets/${id}`);
  },
};
