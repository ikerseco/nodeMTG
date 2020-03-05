const mongoose = require('mongoose');
//Creamos el Schema

const CardsSechema = new mongoose.Schema({
   Info: Object ,
   name: String
});

module.exports = mongoose.model('Cards', CardsSechema)