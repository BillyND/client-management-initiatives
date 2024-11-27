import apiClient from "../utils/apiClient";

export const roleService = {
  // Role CRUD
  async getRoles() {
    return await apiClient.get("/roles");
  },

  async getRole(id: string) {
    return await apiClient.get(`/roles/${id}`);
  },

  async createRole(data: any) {
    return await apiClient.post("/roles", data);
  },

  async updateRole(id: string, data: any) {
    return await apiClient.put(`/roles/${id}`, data);
  },

  async deleteRole(id: string) {
    return await apiClient.delete(`/roles/${id}`);
  },

  // Permissions
  async getAllPermissions() {
    return await apiClient.get("/permissions");
  },

  async getRolePermissions(roleId: string) {
    return await apiClient.get(`/roles/${roleId}/permissions`);
  },

  async updateRolePermissions(roleId: string, permissions: string[]) {
    return await apiClient.put(`/roles/${roleId}/permissions`, { permissions });
  },
};
