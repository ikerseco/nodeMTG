const express = require('express')
const mongoose =  require ('mongoose')
const bodyParser= require ('body-parser')
const roouter = require('./roouters/router.js')
const mongodbRoute = 'mongodb://ikers:Fgs234jT@ds251284.mlab.com:51284/mtg_pro'
const http = require('http');
const socketIO = require('socket.io');
const createGame = require('./controllers/gameController')
const game = require('./controllers/gameClases')

const port = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {pingTimeout: 30000});


var finis = {
  player1: false,
  player2: false
} 

//abrir una conexion socket
var Gameid = null
//start game class
var player1id = null
var player2id = null
var gameCl = new game.createGame()
io.on('connection', (socket) => {
    console.log(`New user connected on socket: ${socket.id}`);
    //escucha socket para crear la partida 
    socket.on('create',function(player){
        //utiliza el controlador findGame
        createGame.findGame(function (data){
          //si hay partidas abiertas entra
          if(data.length != 0){
            //unirse partida´k
            console.log("unirse")
            //utiliza el controlador joinGame
            createGame.joinGame(player, socket.id, data[0]._id,function(data){ 
              //enbiar el id de la partida a cada jugador a la escucha party 
              Gameid = data._id
              gameCl.setGame(data.player1,data.player2,io,function(pla){
                if(pla.valor == true){
                  console.log("IDPLAYER:")
                  console.log(pla.player1id)
                  console.log(pla.player2id)
                  player1id = pla.player1id
                  player2id = pla.player2id
                  io.to(pla.player1id).emit("party",data._id)
                  io.to(pla.player2id).emit("party",data._id)
                }
              })
            })
          }else{
            console.log("crear")
            //crear partida
            createGame.createGame(player, socket.id) 
          }
        }) 
    })
    //gameStart
    //escucha para recibir el id de la partida
    console.log("IOOOOOOOOOO")
   socket.on('gameStart',function(idGame){
    console.log("gameStart")
    //esta funcion utiliza el controlador OneGame
   // createGame.OneGame(idGame,function(gameJson){
    //  var gameCl = new game.createGame(gameJson.player1,gameJson.player2,io)
      //esta funcion reparte las 7 cartas a los dos jugadores 
      gameCl.repartirCartas()
      //escucha para hacer mulligan(cliente-gamePlay.js)
      socket.on('mulligan',function(playerId){
        console.log("mulligan:") 
        gameCl.Mulligan(socket.id)
      })
      //escucha para finalizar mulligan(cliente-gamePlay.js)
      socket.on('mulligan_finis',function(data){
        console.log("mulligan_finis:")
        //cuando el jugador1 quiere jugar
        if(player1id == socket.id){
            finis.player1 = true
        }
        //cuando el jugador2 quiere jugar
        if(player2id == socket.id){
            finis.player2 = true
        }
        //cuando los dos jugadores han aceptado
        if(finis.player1 == true && finis.player2 == true){
          //ejecuta funcion acabar mulligan
          gameCl.Mulligan_Finish()
          //ejecuta la funcion de empezar partida
          gameCl.start()
          finis.player1 = false
          finis.player2 = false
        }
      })
      //escucha del identificador de la carta (cliente-gamePlay.js)
      socket.on('CardInGame',function(data){
        console.log("CardInGame")
        //console.log(data)
        gameCl.undefineCard(socket.id,data,function(a){
          if(a == false){
           gameCl.CardInGame(socket.id,data)
          }else{
            console.log("no tine esa carta")
            io.to(socket.id).emit("manoPRo",a)
          }
        })
      })
      socket.on('FasesMtg',function(data){
        console.log(data)
        gameCl.fases(data, socket.id)

      })

      socket.on('passTurn',function(data){
        console.log("passTurn")
        console.log(socket.id)
        gameCl.passTurn(socket.id)
      })
      socket.on('Attack',function(data){
        console.log("idSoket")
        console.log(socket.id)
        gameCl.Attack(data,socket.id)
      })
      socket.on('Defense',function(data){
        console.log(data)
        gameCl.Defense(data,socket.id)
      })
        // else the socket will automatically try to reconnect
    //})
   })
   socket.on('disconnect', (reason) => {
   // socket.emit('disconnect')
    console.log("DES")
    createGame.DeleteGame(Gameid)
    // else the socket will automatically try to reconnect
  });
});




      
app.use (bodyParser.urlencoded({ extended: false}));
app.use (bodyParser.json());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})

app.use(roouter)
/*MONGODB*/
const options = {
  socketTimeoutMS: 0,
  keepAlive: true,
  reconnectTries: 30,
  useNewUrlParser: true 
};

mongoose.connect(mongodbRoute, options, (err) => {
    if (err) {
        return console.log(`Error al conectar a la base de datos: ${err}`)
    }
    server.listen(port, () => {
		console.log(`Servidor up en ${port}`);
	});
    console.log(`Conexión con Mongo correcta.`)
})


