const mongoose = require('mongoose');

const Games = new mongoose.Schema({
   player1: Object,
   player2: Object,
   estado: Boolean
});
 
 module.exports = mongoose.model('games', Games)