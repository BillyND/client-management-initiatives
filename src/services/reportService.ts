import apiClient from "../lib/apiClient";
import { Report } from "./types";

export const reportService = {
  async getAll(filters?: { type?: Report["type"]; period?: string }) {
    return apiClient.get<Report[]>("/reports", { params: filters });
  },

  async getByInitiative(initiativeId: string) {
    return apiClient.get<Report[]>(`/initiatives/${initiativeId}/reports`);
  },

  async generate(initiativeId: string, type: Report["type"], period: string) {
    return apiClient.post<Report>("/reports", { initiativeId, type, period });
  },
};
