import { useState, useEffect, useCallback } from 'react';
import api from '../util/api';

const useFetch = (initialUrl, initialParams = {}) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (url, params, method = 'GET', payload = null, shouldSetLoading = true) => {
        if (shouldSetLoading) setIsLoading(true);
        try {
            let response;
            switch (method) {
                case 'GET':
                    response = await api.get(url, { params });
                    break;
                case 'POST':
                    response = await api.post(url, payload);
                    break;
                case 'PUT':
                    response = await api.put(url, payload);
                    break;
                case 'DELETE':
                    response = await api.delete(url, { params });
                    break;
                default:
                    throw new Error('Invalid HTTP method');
            }
            setData(response.data.data);
        } catch (error) {
            setError(error);
        } finally {
            if (shouldSetLoading) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(initialUrl, initialParams, 'GET', null, true);
    }, [fetchData]);

    const refetch = async (newUrl, newParams, newMethod, newPayload, shouldSetLoading = true) => {
        if (shouldSetLoading) setIsLoading(true);
        await fetchData(newUrl || initialUrl, newParams || initialParams, newMethod || 'GET', newPayload || null, shouldSetLoading);
        if (shouldSetLoading) setIsLoading(false);
    };

    return { data, setData, isLoading, error, refetch, fetchData };
};

export default useFetch;
