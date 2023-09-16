import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'ngrok-skip-browser-warning': true,
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    },
});

api.interceptors.request.use(async (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalConfig = error.config;
        const status = error.response.status;
        const customStatus = error.response.data.status;
        if (status === 401 && customStatus === 1100) {
            window.location.href = '/login';
        } else if (status === 401 && customStatus === 1103) {
            console.log('refresh');
            try {
                const refreshTokenResponse = await axios.post(
                    process.env.REACT_APP_API_URL + '/auth/refresh',
                    {},
                    {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('refreshToken'),
                        },
                    }
                );
                console.log('refresh complete');
                const { accessToken, refreshToken } = refreshTokenResponse.data.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                originalConfig.headers['Authorization'] = 'Bearer ' + accessToken;
                return api(originalConfig);
            } catch (error) {
                if (error.response.status === 400 && error.response.data.status === 1104) {
                    console.log('refresh error');
                    localStorage.clear();
                    window.location.href = '/login';
                }
            }
        } else if (status === 403) {
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;
