const nodemailer = require("nodemailer");
const rp = require('request-promise');
const express = require('express');
const Web3 = require('web3');
require("dotenv").config();

const app = express();
const HOST = "0.0.0.0";
const PORT = 17337;

const COINGECKO_BASE_API_HOST = "https://api.coingecko.com/api/v3/"
const COINMARKETCAP_BASE_API_HOST = "https://pro-api.coinmarketcap.com/v1"

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER))

app.use(express.json())
app.use(express.urlencoded())
app.use(express.static('public'))

app.route("/").get(function (req, res) {
    res.sendFile(process.cwd() + "/public/index.html")
});

app.get('/api/coins', (request, response) => {

    const requestOptions = {
        method: 'GET',
        uri: `${COINMARKETCAP_BASE_API_HOST}/cryptocurrency/listings/latest`,
        qs: {
            'limit': '100',
            'convert': 'USD'
        },
        headers: {
            'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
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

app.get('/api/checkEthBalance', (request, response) => {
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

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.FORM_EMAIL,
      pass: process.env.FORM_EMAIL_PASS
    }
  });

app.post('/api/sendEmail', (request, response) => {

    const data = request.body.form
    const mail = {
        from: data.firstname + " " + data.lastname,
        to: process.env.FORM_EMAIL,
        subject: data.subject,
        text: `${data.firstname + " " + data.lastname} <${data.email}> \n\n${data.message}`,
      };

      transporter.verify(function (error, success) {
        if (error) {
            console.log(error)
            return
        }

        transporter.sendMail(mail, (err, data) => {
            if (err) {
                console.log(err)
                response.status(500).send("Something went wrong.")
            } else {
                response.status(200).send("Email successfully sent to recipient!")
            }
        });
      });
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

app.listen(PORT, HOST, () => console.log(`Express server currently running on port ${HOST}:${PORT}`));


// MARK: - Utility
function getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
  
    return day + '-' + month + '-' + year;
}
