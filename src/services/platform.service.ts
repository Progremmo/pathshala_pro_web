import api from '@/lib/axios';

export interface SystemSetting {
  id: number;
  configKey: string;
  configValue: string;
  configGroup: string;
  description: string;
}

export const platformService = {
  getAllSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  getSettingsMap: async () => {
    const response = await api.get('/admin/settings/map');
    return response.data;
  },

  updateSettings: async (settings: Record<string, string>) => {
    const response = await api.post('/admin/settings/batch', settings);
    return response.data;
  },

  updateSingleSetting: async (key: string, value: string, group?: string) => {
    const params = new URLSearchParams({ value });
    if (group) params.append('group', group);
    const response = await api.put(`/admin/settings/${key}?${params.toString()}`);
    return response.data;
  }
};
