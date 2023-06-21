import React, { useEffect, useState } from 'react';
import { getTokenFromLocalStorage } from '../auth/auth';
import axios from 'axios';

export function useGet(props) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [data, setData] = useState(null);

    const token = getTokenFromLocalStorage();
    useEffect(() => {
        setLoading(true);
        async function fetchData(){
            var option = {
                method: 'get',
                url: `${props.url}`,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                validateStatus: false //to get error status
            };
            await axios.request(option)
                .then(function (response) {
                    setData(response.data)
                })
                .catch(function (error) {
                    console.log(error)
                    setError(error)
                })
                .finally(() => {
                    setLoading(false)
                });
        }
        fetchData();
    }, [props.url]);
    return [loading, error, data ];
}