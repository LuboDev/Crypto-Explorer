const express = require('express');
const rp = require('request-promise');

const fs = require('fs') // to delete

const app = express();
const HOST = "0.0.0.0";
const PORT = 17337;
const BASE_API_HOST = "https://pro-api.coinmarketcap.com/v1"
const API_KEY = "a5f23cda-26a8-4955-8ef3-a42b141e0ef2";

app.get('/cryptocurrency', (request, response) => {

    const requestOptions = {
        method: 'GET',
        uri: `${BASE_API_HOST}/cryptocurrency/listings/latest`,
        qs: {
            'limit': '70',
            'convert': 'USD'
        },
        headers: {
            'X-CMC_PRO_API_KEY': API_KEY
        }
    };

    response.setHeader('Access-Control-Allow-Origin', "*");

    rp(requestOptions).then(res => {
        console.log(`Success -> ${request.url}`);
        response.jsonp(JSON.parse(res));
    }).catch((err) => {
        response.status(err.statusCode).send(err.error)
        console.log('API call error:', err.message, err.status);
    });
});

app.listen(PORT, HOST, () => console.log(`Express server currently running on port ${HOST}:${PORT}`));