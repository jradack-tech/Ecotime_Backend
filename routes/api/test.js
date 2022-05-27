const express = require('express');
const axios = require('axios');
const router = express.Router();
const createHmac = require("create-hmac");

function signature(queryString, apiSecret) {
  return createHmac("sha256", apiSecret).update(queryString).digest("hex");
}

router.post('/getBalance', async (req, res) => {
	const servertime = (await axios.get("https://api.binance.com/api/v3/time")).data.serverTime;
	const currentPrice = (await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT")).data.price;

	console.log("[servertime] = ", servertime);
	console.log("[currentPrice] = ", currentPrice);

	const params1 = "symbol=BTCUSDT&recvWindow=50000&timestamp=" + servertime;
  const newSignature1 = "signature=" + signature(params1, req.body.secretKey);

  axios(
  	"https://testnet.binancefuture.com/fapi/v2/account?" +
    params1 +
    "&" +
    newSignature1,
    {
      method: "get",
      headers: { 
        "Content-Type": "application/json",
        "X-MBX-APIKEY": req.body.apiKey,
      },
    }
  )
  	.then(response => {
  		res.json(response.data.availableBalance);
  	})
  	.catch(err => console.log(err.response.data));
});

router.post('/positions', async (req, res) => {
	const servertime = (await axios.get("https://api.binance.com/api/v3/time")).data.serverTime;
	const currentPrice = (await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT")).data.price;

	console.log("[servertime] = ", servertime);
	console.log("[currentPrice] = ", currentPrice);

	const params1 = "symbol=BTCUSDT&recvWindow=50000&timestamp=" + servertime;
  const newSignature1 = "signature=" + signature(params1, req.body.secretKey);

  axios(
  	"https://testnet.binancefuture.com/fapi/v2/positionRisk?" +
    params1 +
    "&" +
    newSignature1,
    {
      method: "get",
      headers: { 
        "Content-Type": "application/json",
        "X-MBX-APIKEY": req.body.apiKey,
      },
    }
  )
  	.then(response => {
  		res.json(response.data);
  	})
  	.catch(err => console.log(err.response.data));
});


router.post('/order', async (req, res) => {
	const servertime = (await axios.get("https://api.binance.com/api/v3/time")).data.serverTime;
	const currentPrice = (await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT")).data.price;

	console.log("[servertime] = ", servertime);
	console.log("[currentPrice] = ", currentPrice);

	const params2 = `symbol=BTCUSDT&quantity=${req.body.quantity}&side=${req.body.side}&type=MARKET&positionSide=BOTH&recvWindow=50000&timestamp=${servertime}`;
  const newSignature2 = "signature=" + signature(params2, req.body.secretKey);

  axios(
  	"https://testnet.binancefuture.com/fapi/v1/order?" +
    params2 +
    "&" +
    newSignature2,
    {
      method: "post",
      headers: { 
        "Content-Type": "application/json",
        "X-MBX-APIKEY": req.body.apiKey,
      },
    }
  )
  	.then(response => {
  		res.json(response.data);
  	})
  	.catch(err => console.log(err.response.data));
});

router.post('/closePosition', async (req, res) => {
	const servertime = (await axios.get("https://api.binance.com/api/v3/time")).data.serverTime;
	const currentPrice = (await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT")).data.price;

	console.log("[servertime] = ", servertime);
	console.log("[currentPrice] = ", currentPrice);

	const params2 = `symbol=BTCUSDT&quantity=${req.body.quantity}&side=${req.body.side}&type=MARKET&positionSide=BOTH&recvWindow=50000&timestamp=${servertime}`;
  const newSignature2 = "signature=" + signature(params2, req.body.secretKey);

  axios(
  	"https://testnet.binancefuture.com/fapi/v1/order?" +
    params2 +
    "&" +
    newSignature2,
    {
      method: "post",
      headers: { 
        "Content-Type": "application/json",
        "X-MBX-APIKEY": req.body.apiKey,
      },
    }
  )
  	.then(response => {
  		res.json(response.data);
  	})
  	.catch(err => console.log(err.response.data));
});

router.post('/cancelAllOrders', async (req, res) => {
	const servertime = (await axios.get("https://api.binance.com/api/v3/time")).data.serverTime;
	const currentPrice = (await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT")).data.price;

	console.log("[servertime] = ", servertime);
	console.log("[currentPrice] = ", currentPrice);

	const params2 = `symbol=BTCUSDT&recvWindow=50000&timestamp=${servertime}`;
  const newSignature2 = "signature=" + signature(params2, req.body.secretKey);

  axios(
  	"https://testnet.binancefuture.com/fapi/v1/allOpenOrders?" +
    params2 +
    "&" +
    newSignature2,
    {
      method: "delete",
      headers: { 
        "Content-Type": "application/json",
        "X-MBX-APIKEY": req.body.apiKey,
      },
    }
  )
  	.then(res => {
  		console.log(res.data);
  	})
  	.catch(err => console.log(err.response.data));
});


module.exports = router;