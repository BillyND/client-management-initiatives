import apiClient from "../lib/apiClient";
import { Initiative } from "./types";

export const initiativeService = {
  async getAll() {
    return apiClient.get<Initiative[]>("/initiatives");
  },

  async getById(id: string) {
    return apiClient.get<Initiative>(`/initiatives/${id}`);
  },

  async create(
    data: Omit<Initiative, "id" | "userId" | "createdAt" | "updatedAt">
  ) {
    return apiClient.post<Initiative>("/initiatives", data);
  },

  async update(id: string, data: Partial<Initiative>) {
    return apiClient.put<Initiative>(`/initiatives/${id}`, data);
  },

  async delete(id: string) {
    return apiClient.delete(`/initiatives/${id}`);
  },
};
