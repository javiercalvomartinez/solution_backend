const { urlencoded } = require("express");
const Mongoose  = require("mongoose");

function _connect(){

    const URI = `mongodb://${process.env.MONGOHOST}/${process.env.MONGO_DB}`;
    Mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(
            () => {
                console.log("conection to db readyyyy")
            },

            (err) => {
                console.log(" connection error ---",err)
            },
        )
}

module.exports = _connect;