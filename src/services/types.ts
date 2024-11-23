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
  _id: string;
  email: string;
  name: string;
  accessToken?: string;
  refreshToken?: string;
  role: string;
}

export interface Initiative {
  name: string;
  unit: string;
  position: string;
  email: string;
  initiativeName: string;
  problem: string;
  goal: string;
  method: string;
  expectedResult: string;
  attachment?: string;
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
