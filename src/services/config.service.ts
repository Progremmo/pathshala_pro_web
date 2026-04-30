import api from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';

export const configService = {
  getConfigs: async (schoolId: number): Promise<ApiResponse<Record<string, string>>> => {
    const response = await api.get(`/schools/${schoolId}/configs`);
    return response.data;
  },

  updateConfigs: async (schoolId: number, configs: Record<string, string>): Promise<ApiResponse<void>> => {
    const response = await api.post(`/schools/${schoolId}/configs`, configs);
    return response.data;
  },

  updateConfig: async (schoolId: number, key: string, value: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/schools/${schoolId}/configs/${key}`, value, {
      headers: { 'Content-Type': 'text/plain' }
    });
    return response.data;
  }
};
