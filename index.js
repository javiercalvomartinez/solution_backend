const express = require('express');
const app = express();
const _connect = require('./db/_connect');
const {postCurrencie,getCurrencies,delCurrencies} = require('./controllers/currencieControllers');
const {getHisto} = require('./controllers/historialControllers');

const currencieModel = require('./models/currencieModel');
const historyModel = require('./models/historialModel');
const alpha_key = process.env.alpha_key;
const axios = require('axios')
const cron = require('node-cron');
require('dotenv').config();

// Connction to bbdd
_connect();

app.use(express.json())
// API endpoints to adding, removing and listing the followed currencies to the list of currencies to check
//The parameters of all must be in the body of the request
app.get('/currencies',getCurrencies)
app.post('/currencies', postCurrencie)
app.delete('/currencies', delCurrencies)


// Class in progress to be exported for a cleaner look
class Main{
    static async getRates(){
        //Retrieval of the currencies to loop
        const currencies = await currencieModel.find({},{name:1,_id:0});
        for (var key in currencies){

            //http request of the exchange data with alphavantage API, with the parameter currencie explained before
            const respuesta_curr = (await axios.get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&to_currency=EUR&from_currency=${currencies[key].name}&apikey=${alpha_key}`)).data;
            var bid = respuesta_curr['Realtime Currency Exchange Rate']['8. Bid Price'];
            var ask = respuesta_curr['Realtime Currency Exchange Rate']['9. Ask Price'];
            var exchan = respuesta_curr['Realtime Currency Exchange Rate']['5. Exchange Rate'];
            var date = respuesta_curr['Realtime Currency Exchange Rate']['6. Last Refreshed'];
            var from_curr = respuesta_curr['Realtime Currency Exchange Rate']['1. From_Currency Code'];

            //creation of historyModel, mongo schema to store data from the request
            const historial = new historyModel();
            historial.listCaracteristicas.name = currencies[key].name;
            historial.listCaracteristicas.ask = ask;
            historial.listCaracteristicas.bid = bid;
            historial.listCaracteristicas.exchan = exchan;
            historial.date = Date();
            try {
                //If there are no errors create and save the model to de DDBB
                const histo = await historyModel.create(historial);
                var result = await histo.save();
                console.log('guardado')
            } catch (error) {
                console.log('maaaaaaal')
            }
        }        
    }
    
}

// API enpoint for retrieving the exchange price history of the followed currencies. 
//It has one parameter to specify the currencie to check.
// It returns a JSON file with the parameters bid, ask, spread, bid-diff, ask-diff, and spread-diff. 
//Parameters -diff are compared with the last register of the currencie in the DDBB  
app.get('/histo/:data',getHisto)


const port = process.env.PORT;
app.listen(port,(req,res)=>{
    console.log('server is running')
    console.log(`api rest running in port ${port}`)
})

// Schedule periodic historic data retrieval, every hour at 00 minutes
cron.schedule("0 * * * *", ()=>{
    Main.getRates();
})
