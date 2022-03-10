import { useState, useCallback } from "react";

export const useHttp = () => {

    const [process, setprocess] = useState('waiting');

    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {


        setprocess('loading')
        try {
            const response = await fetch(url, {method, body, headers});

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            const data = await response.json();



            return data;
        } catch(e) {

            setprocess('error')
            throw e;
        }
    }, []);

    const clearError = useCallback(() => {

        setprocess('loading')
    }, []);

    return {request, clearError, process, setprocess}
}