import api from './api';

export const submitContactCorrespondence = async (data: { name: string; email: string; message: string }) => {
    const response = await api.post('/contact', data);
    return response.data;
};
