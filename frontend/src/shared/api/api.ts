import { router } from '@/app/provides';
import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;



 const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true
})


axiosInstance.interceptors.request.use((config) => {
    const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 403) {
            try {
                router.push('/auth')
                // await refreshAccessToken();
                // return axiosInstance.request(error.config);
            } catch (refreshError) {
                console.log("Ошибка обновления токена:", refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// const refreshAccessToken = async () => {
//     const response = await axiosInstance.post("api/users/refresh-token");
// };
export default axiosInstance;