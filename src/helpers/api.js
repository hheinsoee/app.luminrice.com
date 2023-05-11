import { useEffect, useState } from 'react'
import axios from 'axios'
import { getTokenFromLocalStorage } from '../auth/auth';


const addDataIntoCache = (cacheName, url, response) => {
    const cacheData = {
        timeCached: Date.now(),
        data: response
    };
    const data = new Response(JSON.stringify(cacheData));
    if ('caches' in window) {
        caches.open(cacheName).then((cache) => {
            cache.put(url, data);
        });
    }
};


export default async function cacheOrFatch(cacheName, option, cb, age = 1440) {//age must be minute - undefine is 1440 min /24 hour - 0 is no cache
    var theq = new URLSearchParams(option.data).toString()
    var theUrl = `${option.url}${option.data ? '?' + theq : ""}`;

    if (typeof caches === 'undefined') {
        fatch(option);
    } else {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(theUrl);

        // If cache exists
        if (cachedResponse && cachedResponse.ok) {
            return cachedResponse.json().then((item) => {
                const currentTime = Date.now();
                if (currentTime - item.timeCached > age * 60000) {
                    cache.delete(theUrl);
                    fatch(option);
                    // console.log(`Deleting cache for URL: ${url}`);
                } else {
                    cb(null, item.data)
                    // console.log(`Cache for URL: ${url} is not older than 24 hours.`);
                }
            })
        } else {
            fatch(option)
        }
    }


    function fatch(option) {
        myAxio(option, (err, data) => {
            if (err) {
                cb(err);
            } else {
                cb(null, data);
                addDataIntoCache(cacheName, theUrl, data)
            }
        })
    }
}

export async function myAxio(option, cb) {
    const token = getTokenFromLocalStorage();
    var o = {
        ...option,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    };
    // console.log(o)
    await axios.request(o).then(function (response) {
        cb(null, response.data);
    }).catch(function (error) {
        console.log(error)
        cb(error)
    });
}
