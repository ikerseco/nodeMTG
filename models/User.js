const mongoose = require('mongoose');
//Creamos el Schema

const Users = new mongoose.Schema({
   name:{ type:String, require: true },
   status: Number,
   img: String,
   password:String,
   email: String,
   mazos: Array,
   idUsuario: String
});

module.exports = mongoose.model('Users', Users)