const mongoose  = require('mongoose')

const currencieSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    }
    },{collection:'currencies'}
);

const currencies = mongoose.model('currencies',currencieSchema)

module.exports = currencies;