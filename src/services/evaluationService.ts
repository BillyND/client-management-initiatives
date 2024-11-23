import apiClient from "../lib/apiClient";
import { Evaluation } from "./types";

export const evaluationService = {
  async getAllByInitiative(initiativeId: string) {
    return apiClient.get<Evaluation[]>(
      `/initiatives/${initiativeId}/evaluations`
    );
  },

  async create(
    initiativeId: string,
    data: Omit<Evaluation, "id" | "initiativeId" | "evaluatorId" | "createdAt">
  ) {
    return apiClient.post<Evaluation>(
      `/initiatives/${initiativeId}/evaluations`,
      data
    );
  },

  async update(id: string, data: Partial<Evaluation>) {
    return apiClient.put<Evaluation>(`/evaluations/${id}`, data);
  },
};
