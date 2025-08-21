import {api} from "./api";

export const presetsApi = {
  getPresets: async () => {
    const res = await api.get("/presets");

    return res.data; 
  },
};