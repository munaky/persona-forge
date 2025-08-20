import {api} from "./api";

export const presetsApi = {
  getPresets: async () => {
    const res = await api.get("/presets");

    console.log('presetApig.getPresets response', res.data);
    return res.data; 
  },
};