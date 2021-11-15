const mongoose  = require('mongoose')

//Schema to record the historial. Made of 5 parameters, divided in date and an array 
//Date of the adqusition
//Array with the parameters ask, bid, exchan (exchange prize), name (currencie)
const historialSchema = mongoose.Schema({
    date:{
        type:Date,
        required:true,
    },
    listCaracteristicas:{
        ask:{
            type:Number,
            required:true,
                },
        bid:{
            type:Number,
            required:true,
        },
        exchan:{
            type:Number,
            required:true,
        },
        name:{
            type:String,
            required:true
        }
    }   
    }
);

const currencies = mongoose.model('history',historialSchema)
module.exports = currencies;