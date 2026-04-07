// frontend/src/app/lib/api.ts
import axiosInstance from './axiosInstance';
import { IStoriesResponse } from '../../type/story';

export const fetchStories = async (page = 1, limit = 3) => {
  try {
    const response = await axiosInstance.get('/api/stories', {
      params: { page, limit },
    });
    // повертаємо inner data, щоб компоненту було зручніше
    // response.data = { status, message, data: { stories: [...], ... } }
    return response.data.data;
  } catch (err: any) {
    console.error('Error fetching stories:', err?.response?.status, err?.response?.data || err.message);
    throw new Error(err?.response?.data?.message || 'Fetch stories failed');
  }
};
export const toggleSaveStory = async (storyId: string) => {
  try {
    const response = await axiosInstance.patch(`/api/stories/${storyId}/save`);
    return response.data;
  } catch (err: any) {
    console.error('Error toggling save story:', err?.response?.status, err?.response?.data || err.message);
    throw err;
  }
};