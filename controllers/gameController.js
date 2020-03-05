//crear una partida
const game = require('../models/game')

exports.createGame = (user, Socketid) => {
    user.id = Socketid
    json_partida = {
        player1: user,
        player2: null,
        estado: true
     }
    let newGame = new game(json_partida)
    newGame.save(function (err, data) {
        if (err) return res.status(500).send({message:'Error al crear el mazo',err});
        if(!data) return res.status(404).send({message: `dato`});
      
     });
};

//unirse partida
exports.joinGame = (user, Socketid,idpartida,callback) => {
    user.id = Socketid
    //busca la partida abierta por id,metes el segundo jugador y cierra la partida
    game.findByIdAndUpdate(idpartida, { $set: {player2: user, estado: false }}, (err, data) => {
        if (err) return res.status(500).send({ message: 'Error al crear el mazo', err });
        if (!data) return res.status(404).send({ message: `dato` });
        //buscas la partida a la que te has unido y la descargas 
       game.findById(idpartida,function(err,data){
        if (err) return res.status(500).send({ message: 'Error al crear el mazo', err });
        if (!data) return res.status(404).send({ message: `dato` });
        callback(data)
       })
    });
}

//busca todas las partidas y te devuelve las que estan abiertas
exports.findGame = (callback) => {
    game.find({}, function (err, data){
        var filtroPartidas = data.filter(data => data.estado == true)
        console.log(filtroPartidas)
        callback(filtroPartidas)

        /*if(filtroPartidas.length != 0){
            console.log(filtroPartidas[0]._id)
            var idpartida = filtroPartidas[0]._id
            game.findByIdAndUpdate(idpartida, { $set: {player2: user, estado: false }}, (err, data) => {
                if (err) return res.status(500).send({ message: 'Error al crear el mazo', err });
                if (!data) return res.status(404).send({ message: `dato` });
            })
        }else{
            json_partida = {
                player1: user,
                player2: null,
                estado: true
             }
            let newGame = new game(json_partida)
            newGame.save(function (err, data) {
                if (err) return res.status(500).send({message:'Error al crear el mazo',err});
                if(!data) return res.status(404).send({message: `dato`});
              
             });
        }*/
    })
};
//descarga la partida donde estan los dos usuarios
exports.OneGame = (idGame,callback) =>{
    game.findOne({ _id: idGame }, (err, data) => {
        if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` });
        if (!data) return res.status(404).send({ message: `No existe game` });
        callback(data)
    });
}
//eliminar una partida

exports.DeleteGame = (idGame) =>{
    game.findByIdAndRemove({ _id: idGame }, (err, data) => {
       console.log(err)
       console.log(data)
    });
}

