//Temporal file to the export of the class Main

const axios = require('axios')
const currencieModel = require('./models/currencieModel');
const historyModel = require('./models/historialModel');
const alpha_key = process.env.alpha_key;

class Main {   
    static async getRates(){
        console.log('antes metodo')
        const currencies = await currencieModel.find({},{name:1,_id:0});
        console.log(JSON.stringify(currencies))
        for (var key in currencies){
            console.log(key + "-->" + currencies[key].name);
            const respuesta_curr = (await axios.get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&to_currency=EUR&from_currency=${currencies[key].name}&apikey=${alpha_key}`)).data;
            //console.log(JSON.stringify(respuesta_curr));
            //console.log(respuesta_curr['Realtime Currency Exchange Rate']['1. From_Currency Code'])
            var bid = respuesta_curr['Realtime Currency Exchange Rate']['8. Bid Price'];
            var ask = respuesta_curr['Realtime Currency Exchange Rate']['9. Ask Price'];
            var exchan = respuesta_curr['Realtime Currency Exchange Rate']['5. Exchange Rate'];
            const historial = new historyModel();
            historial.listCaracteristicas.name = currencies[key].name;
            historial.listCaracteristicas.ask = ask;
            historial.listCaracteristicas.bid = bid;
            historial.listCaracteristicas.exchan = exchan;
            historial.date = Date();
            try {
                const histo = await historyModel.create(historial);
                var result = await histo.save();
                console.log('guardado')
            } catch (error) {
                console.log('maaaaaaal')
            }

        }

        
    }
}

module.exports = Main;