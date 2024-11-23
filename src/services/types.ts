export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface Initiative {
  id: string;
  title: string;
  description: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Evaluation {
  id: string;
  initiativeId: string;
  evaluatorId: string;
  score: number;
  comments: string;
  createdAt: string;
}

export interface Report {
  id: string;
  initiativeId: string;
  type: "monthly" | "quarterly" | "yearly";
  metrics: {
    impact: number;
    cost: number;
    efficiency: number;
  };
  period: string;
  createdAt: string;
}
