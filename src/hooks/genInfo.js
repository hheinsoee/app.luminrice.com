import React, { useEffect, useState } from 'react';
import { getTokenFromLocalStorage } from './../auth/auth';
import axios from 'axios';
import { API_URL } from './../utils/constants';

export function useGenInfo(props) {
    const [genLoad, setGenLoad] = useState(false)
    const [genErr, setGenErr] = useState(false)
    const [genInfo, setGenInfo] = useState({});

    const token = getTokenFromLocalStorage();
    useEffect(() => {
        async function fetchData(){
            var option = {
                method: 'get',
                url: `${API_URL}/genInfo`,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                validateStatus: false //to get error status
            };

            setGenLoad(true);
            await axios.request(option)
                .then(function (response) {
                    setGenInfo(response.data)
                })
                .catch(function (error) {
                    console.log(error)
                    setGenErr(error)
                })
                .finally(() => {
                    setGenLoad(false)
                });
        }
        fetchData();
    }, []);
    return [genLoad, genErr, genInfo ];
}