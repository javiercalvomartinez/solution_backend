const historial = require('../models/historialModel');
const axios = require('axios')


//creation of the get call of the history
const getHisto = async (req,res)=>{
    try {
        const alpha_key = process.env.alpha_key;
        console.log(req.params.data)
        //find the last record of the currencie in the DDBB
        const prueba = await historial.findOne().sort({"date":-1});
        //http request of the exchange data with alphavantage API, with the parameter currencie explained before
        const respuesta_curr = (await axios.get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&to_currency=EUR&from_currency=${req.params.data}&apikey=${alpha_key}`)).data;

        //creation of the response of the get
        const text =`{
            "bid":${respuesta_curr['Realtime Currency Exchange Rate']['8. Bid Price']},
            "ask":${respuesta_curr['Realtime Currency Exchange Rate']['9. Ask Price']},
            "spead":${respuesta_curr['Realtime Currency Exchange Rate']['9. Ask Price']-respuesta_curr['Realtime Currency Exchange Rate']['8. Bid Price']},
            "bid-diff":${respuesta_curr['Realtime Currency Exchange Rate']['8. Bid Price']-prueba["listCaracteristicas"]["bid"]},
            "ask-diff":${respuesta_curr['Realtime Currency Exchange Rate']['9. Ask Price']-prueba["listCaracteristicas"]["ask"]},
            "spread-diff":${respuesta_curr['Realtime Currency Exchange Rate']['9. Ask Price']-respuesta_curr['Realtime Currency Exchange Rate']['8. Bid Price']+prueba["listCaracteristicas"]["ask"]-prueba["listCaracteristicas"]["bid"]}
        }`
        //parse to JSON and send of the response
        const textjs = JSON.parse(text)
        res.send(textjs);
    } catch (error) {
        res.status(400).json({
            status:false,
        })
    }
}
module.exports = { getHisto }