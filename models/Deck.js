const mongoose = require('mongoose');

const mazos = new mongoose.Schema({
    name : String,
	numeroCartas : Number,
	color : String,
	cards : Array

 });

 module.exports = mongoose.model('mazos', mazos)
 