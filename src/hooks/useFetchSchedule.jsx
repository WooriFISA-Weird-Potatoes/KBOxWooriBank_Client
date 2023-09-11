import { useState, useEffect } from 'react';
import api from '../util/api';

export const useFetchSchedule = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        api.get(url)
            .then((response) => {
                if (response.data.success) {
                    setData(response.data.data);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.log('Error:', error);
                setError(error);
                setLoading(false);
            });
    }, [url]);

    return { data, loading, error };
};
