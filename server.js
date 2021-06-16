const rp = require('request-promise');
const express = require('express');
const Web3 = require('web3');

const fs = require('fs'); // to delete
const { json } = require('express');

const app = express();
const HOST = "0.0.0.0";
const PORT = 17337;
const BASE_API_HOST = "https://pro-api.coinmarketcap.com/v1"
const API_KEY = "a5f23cda-26a8-4955-8ef3-a42b141e0ef2";

const COINGECKO_BASE_API_HOST = "https://api.coingecko.com/api/v3/"

app.use(express.static('public'))
app.route("/").get(function (req, res) {
    res.sendFile(process.cwd() + "/public/index.html")
});

app.get('/cryptocurrency', (request, response) => {

    const requestOptions = {
        method: 'GET',
        uri: `${BASE_API_HOST}/cryptocurrency/listings/latest`,
        qs: {
            'limit': '100',
            'convert': 'USD'
        },
        headers: {
            'X-CMC_PRO_API_KEY': API_KEY
        }
    };
   
    request.setTimeout(10000, () => {
        response.sendStatus(408)
    });

    response.setHeader('Access-Control-Allow-Origin', "*");

    rp(requestOptions).then(res => {
        console.log(`Success -> ${request.url}`);
        response.jsonp(JSON.parse(res));
    }).catch((err) => {
        response.status(err.statusCode).send(err.error)
        console.log('API call error:', err.message, err.status);
    });
});

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/5f4123411c4044bdbd0dfb01a7d6ad08'))


app.get('/balance', (request, response) => {
    let address = request.query['address']
    
    if (address == "") {
        response.status(400).send("The address filed is empty!")
        return
    } 

    try {
        web3.eth.getBalance(address, function(err, result) {
            getEthereumCurrentPrice.then(price => {

                let balance = {
                    'amount': web3.utils.fromWei(result, "ether"),
                    'ticker': "ETH",
                    'price': price
                }

                response.status(200).send(balance)
            });
        });
    } catch(err) {
        response.status(400).send(`Provided address ${address} is invalid`)
    }
});

app.route("*").get(function (req, res) {
    res.sendFile(process.cwd() + "/public/404.html")
});

const getEthereumCurrentPrice = new Promise((resolve, reject) => {
    const requestOptions = {
        method: 'GET',
        uri: `${COINGECKO_BASE_API_HOST}/coins/ethereum`,
        qs: {
            'history': getFormattedDate(new Date()),
            'localization': false
        }
    };

    rp(requestOptions).then(res => {
        let eth = JSON.parse(res)
        resolve(eth.market_data.current_price.usd)
    }).catch((err) => {
        reject(err);
    });
});

// getEthereumCurrentPrice.then(price => {
//     console.log(price)
// }).catch((err) => {
//     console.log(err)
// });


function getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
  
    return day + '-' + month + '-' + year;
}

app.listen(PORT, HOST, () => console.log(`Express server currently running on port ${HOST}:${PORT}`));