import apiClient from "../utils/apiClient";
import { Initiative } from "./types";

interface PaginationParams {
  page: number;
  limit: number;
}

interface InitiativeResponse {
  items: Initiative[];
  total: number;
  page: number;
  limit: number;
}

export const initiativeService = {
  async create(data: Initiative) {
    return apiClient.post<Initiative>("/initiatives", data);
  },

  async update(id: string, data: Partial<Initiative>) {
    return apiClient.put<Initiative>(`/initiatives/${id}`, data);
  },

  getMyInitiatives: async (
    params: PaginationParams = { page: 1, limit: 10 }
  ): Promise<InitiativeResponse> => {
    try {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
      });

      const { data } = await apiClient.get<InitiativeResponse>(
        `/initiatives?${queryParams.toString()}`
      );

      return {
        items: data.items || [],
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 10,
      };
    } catch (error) {
      console.error("Error fetching initiatives:", error);
      return {
        items: [],
        total: 0,
        page: params.page,
        limit: params.limit,
      };
    }
  },
};
