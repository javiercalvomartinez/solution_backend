const currencieModel =  require('../models/currencieModel')


//GET, POST and DELETE of the currencies

//post of the currencie to the DDBB
const postCurrencie = async(req,res) => {
    try {
        //console.log('a ver si llega por aqui')
        //If there are no errors create and save the model to de DDBB, having the currencie in the body of the request
        const currencies = await currencieModel.create(req.body);
        res.status(200).json({
            status: true,
            currencies
        })
        var result = await currencies.save();
    } catch (error) {
        res.status(400).json({
            status:false,
        })
    }
}
//get of the list of the currencies in the DDBB
const getCurrencies = async (req,res)=>{
    try {
        //list currencies in the DDBB
        const currencies = await currencieModel.find({},{name:1,_id:0});
        //response as a JSON
        res.send(currencies);
    } catch (error) {
        res.status(400).json({
            status:false,
        })
    }
}
//delete of currencie in the DDBB in the body of the request, as a JSON file with the parameter name
const delCurrencies = async (req,res)=>{
    try {
        const name = req.body.name;
        //find and delete of the currencie in the body of the request
        const busqueda = await currencieModel.find({name: name}).deleteOne();
        res.send('elemento ha sido eliminado')

    } catch (error) {
        res.status(400).json({
            status:false,
        })
    }
}
module.exports = { postCurrencie,getCurrencies,delCurrencies }