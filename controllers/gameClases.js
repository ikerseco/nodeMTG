//clase juego
class game{
    constructor(){
        this.mulligan = {
            cardsPla1 : 6,
            cardsPla2 : 6
        }
        this.manaCast = true
        this.player1 = null;
        this.player2 = null;
        this.io = null;
        
        this.battle = {
          totalAttack : 0,
          AttackCard : [],
          valid : true
        }
    }

    //funcion para meter informacion al constructor
    setGame(player1,player2, io,callback){
      this.player1 = player1
      this.player2 = player2
      this.io = io
      if(this.player1 != null && this.player2 != null && this.io != null){
        var json = {
          valor : true,
          player1id: this.player1.id,
          player2id: this.player2.id
        }
        callback(json)
      }
    }
    //Esta clase se ejecuta cuando finaliza el mulligan y empieza la partida
    start(){
        console.log("iniciar")
        var turno = []
        //estas dos funciones push() meten los dos jugadores en el array turno
        turno.push(this.player1)
        turno.push(this.player2)
        //esta funcion elije aleatoriamente el primer jugador
        var primero = turno[Math.floor((Math.random() * turno.length))]
        //esta funcion cojera el jugador que no sea primero(segundo)
        var segundo = turno.filter(data => data.id != primero.id)
        //emites a la escucha turno quien empieza y la funcion castCard (cliente-gamePlay)
        this.io.to(primero.id).emit("turno",{start:true,function:"castCard",NumFa:0})
        this.io.to(segundo[0].id).emit("turno",{start:false})   
    }
    //funcion para repartir las 7 cartas
    repartirCartas(){
        console.log("distributeParty")
        console.log("plaier1:"+this.player1.id)
        console.log("plaier2:"+this.player2.id)
        //guarda las cartas del mazo de player1 y le da un identificador a cada carta
        //var contC = comtCards(this.player1.mazo.cards)
        //barajea el mazo
        var deck1 = shuffle(this.player1.mazo.cards)
        //cojes el mazo barajeado y lo vuelves a meter en el json de player1
        this.player1.mazo.cards = deck1
        //guarda las cartas del mazo de player2 y le da un identificador a cada carta
        //var contC = comtCards(this.player2.mazo.cards)
        //barajea el mazo
        var deck2 = shuffle(this.player2.mazo.cards)
        //cojes el mazo barajeado y lo vuelves a meter en el json de player2
        this.player2.mazo.cards = deck2 

        //coje las primeras 7 cartas del mazo de player1 y las quita del mazo
        var deal1 = takeCards(7,this.player1.mazo.cards)
        console.log("deal")
        //separar las cartas del mazo y la mano
        this.player1.mazo.cards = deal1.mazo
        this.player1.mano = deal1.mano
        console.log("mano1")
        //coje las primeras 7 cartas del mazo de player1 y las quita del mazo
        var deal2 = takeCards(7,this.player2.mazo.cards)
        //separar las cartas del mazo y la mano
        this.player2.mazo.cards = deal2.mazo
        this.player2.mano = deal2.mano
        console.log("mano2")
        //coje el identificador de cada jugador y les envia el json de player (cliente-gamePlay.js)
        this.io.to(this.player1.id).emit("repartirCartas",this.player1)
        this.io.to(this.player2.id).emit("repartirCartas",this.player2)
        //contrincant
    }
    //Esta clase hace la accion mulligan
    Mulligan(socektid){
        //si el id del jugador es el mismo que el del socketId se ejecuta (sirve para que el servidor sepa quien hace mulligan)
        if(socektid == this.player1.id){
            var cardArray = []
            //recorre la mano del jugador1 y la mete en cardArray
            this.player1.mano.forEach(function(data){
                cardArray.push(data)
            })
            //recorre el mazo del jugador1 y la mete en cardArray
            this.player1.mazo.cards.forEach(function(data){
                cardArray.push(data)
            })
            //barajea el cardArray aleatoriamente
            var suflecard = shuffle(cardArray)
            //Y mete el mazo barajeado en el json de player1
            this.player1.mazo.cards = suflecard
            //vacia la mano del jugador1
            this.player1.mano = []

            var deal = takeCards(this.mulligan.cardsPla1,this.player1.mazo.cards)
            //cada vez que haces mulligan resta 1 a la cantiad de cartas q robas
            this.mulligan.cardsPla1 -= 1
            //vuelve a meter el mazo en el json de player1 despues de robar
            this.player1.mazo.cards = deal.mazo
            //vuelve a meter la mano en el json de player1 despues de robar
            this.player1.mano = deal.mano
            //emite al player1 su propio json(cliente-gamePlay.js)
            this.io.to(this.player1.id).emit("cards_mullig",deal)
            //hace lo mismo que antes pero con el jugador2
        }else if(socektid == this.player2.id){
            var cardArray = []
            this.player2.mano.forEach(function(data){
                cardArray.push(data)
            })
            this.player2.mazo.cards.forEach(function(data){
                cardArray.push(data)
            })
            var suflecard = shuffle(cardArray)
            this.player2.mazo.cards = suflecard
            this.player2.mano = []
            var deal = takeCards(this.mulligan.cardsPla2,this.player2.mazo.cards)
            this.mulligan.cardsPla2 -= 1
            this.player2.mazo.cards = deal.mazo
            this.player2.mano = deal.mano
            this.io.to(this.player2.id).emit("cards_mullig",deal)
            
        }
    }
    //Esta clase se ejecuta cuando los dos jugadores le dan a aceptar
    Mulligan_Finish(socektid){
           //emite el id de cada jugador a la escucha player(cliente-gamePlay.js)
           this.io.to(this.player1.id).emit("player",this.player1)
           this.io.to(this.player2.id).emit("player",this.player2)
           //emite el id de cada jugador a la escucha opponent(cliente-gamePlay.js)
           this.io.to(this.player2.id).emit("opponent",this.player1)
           this.io.to(this.player1.id).emit("opponent",this.player2)
    }
    //funcion para pintar la vida del jugador cada vez que haya cambios
     
    
    //funcion para sacar cartas
    CardInGame(socektid,id_card){
      var players = []
      players.push(this.player1)
      players.push(this.player2)
      var jugador = players.filter(data => data.id == socektid)
      var oponente = players.filter(data => data.id != jugador[0].id)
      console.log("jugador: "+jugador[0].mazo.name)
      console.log("oponente: "+oponente[0].mazo.name)
      var card = jugador[0].mano.filter(data => data.id == id_card)
      switch(card[0].Info.types[0]){
        case "Land":
          if(this.manaCast == true){
            this.manaCast = false
            var mano = jugador[0].mano.filter(data => data.id != id_card)
            jugador[0].mano = mano
            jugador[0].mana.push(card[0])
            var cant = jugador[0].mana.filter(data => data.name == card[0].name)
            console.log(cant)
            if(this.player1.id == socektid){
              this.player1 = jugador[0]
            }else if(this.player2.id == socektid){
              this.player2 = jugador[0]
            }
            this.io.to(jugador[0].id).emit("castCard",{type:"Land",card:card[0],cont:cant.length})
            this.io.to(oponente[0].id).emit("castOpo",{type:"Land",card:card[0],cont:cant.length})
          }
          break;
        case "Creature":
            var Manacost = jsonManacost(card[0].Info.manaCost,jugador[0])
            if(Manacost.use == true){
              jugador[0].mana = Manacost.mana
              jugador[0].mana_use = Manacost.mana_use
              if(this.player1.id == socektid){
                this.player1 = jugador[0]
                this.player1.campoEnderezar.push(card[0])
              }else if(this.player2.id == socektid){
                this.player2 = jugador[0]
                this.player2.campoEnderezar.push(card[0])
              }
              this.io.to(jugador[0].id).emit("castCard",{type:"Creature",card:card[0],mana: jugador[0].mana, mana_use: jugador[0].mana_use})
              this.io.to(oponente[0].id).emit("castOpo",{type:"Creature",card:card[0]})
            }
            break;
        }
    }
    //funcion para pasar de fase
    fases(numTur, socketId){
      console.log("fases:")
      numTur += 1 
      var fasePart = ["castCard","attack","castCardRE"]
      var faseSelect = fasePart[numTur]
      console.log(faseSelect)
      this.io.to(socketId).emit("turno",{start:true,function: faseSelect,NumFa:numTur})
    } 
    //pasa turno
    passTurn(socektid){
      var players = []
      players.push(this.player1)
      players.push(this.player2)
      var jugador = players.filter(data => data.id == socektid)
      var oponente = players.filter(data => data.id != jugador[0].id)
      if(oponente[0].mana_use.length != 0){
        oponente[0].mana_use.forEach(function(data){
          oponente[0].mana.push(data)
        })
        oponente[0].mana_use = []
      }
      if(oponente[0].campoGirar.length != 0){
        oponente[0].campoGirar.forEach(function(data){
          oponente[0].campoEnderezar.push(data)
        })
        oponente[0].campoGirar = []
      }
     var robar = takeCards(1,oponente[0].mazo.cards)
      oponente[0].mano.push(robar.mano[0])
      oponente[0].mazo.cards = robar.mazo
     if(this.player1.id == oponente.id){
      this.player1 = oponente[0]
    }else if(this.player2.id == oponente.id){
      this.player2 = oponente[0]
    }
      this.io.to(oponente[0].id).emit("turno",{start:true,function:"upkeep",NumFa:-1,jugador:oponente[0]})
      this.io.to(jugador[0].id).emit("turno",{start:false})

      //cartas al jugador que a pasado 
      this.io.to(jugador[0].id).emit("mantenimiento",oponente[0])
      this.manaCast = true
    }
    //funcioin para defer y atakar
    Attack(idArray, socketId){
      console.log("Attack:")
      var players = []
      var AttakArr = []
      var total = 0
      players.push(this.player1)
      players.push(this.player2)
      var player = players.filter(data => data.id == socketId) 
      var oponente = players.filter(data => data.id != socketId)
      player[0].campoEnderezar.forEach(function(element){
        var card = idArray.filter(data => data == element.id)
        if(card.length != 0){
          total += parseInt(element.Info.power)
          element.battle = true
          AttakArr.push(element)
        }else{
          element.battle = false
          AttakArr.push(element)
        }
      })
      //emitir los carbios de la carta para que los bea el oponente
      //oponete
      this.io.to(oponente[0].id).emit("visualCardsAttack",AttakArr)
      //player
      this.io.to(player[0].id).emit("visualCardsPlayer",AttakArr)
      this.io.to(oponente[0].id).emit("turno",{start:true,function:"defense",NumFa:1})

      console.log(total)
      this.battle.totalAttack = total
      this.battle.AttackCard = AttakArr
      console.log("attak total")
      console.log(this.battle.totalAttack)

    }

    Defense(datadef, socektid){
     this.battle.valid = true
     var players = []
     players.push(this.player1)
     players.push(this.player2)
     var player = players.filter(data => data.id == socektid) 
     var oponente = players.filter(data => data.id != socektid)
     if(datadef.valid == false){
      if(this.battle.valid == true){
        player[0].life -= this.battle.totalAttack
        this.battle.valid = false
      }
      //pintarvida
      console.log("DEFENSE:")
      console.log(this.battle.totalAttack)
      console.log(player[0].life)
      this.io.to(oponente[0].id).emit("turno",{start:true,function:"castCardRE",NumFa:2})
      this.io.to(player[0].id).emit("turno",{start:false})
     }
     pintarVida(this.io, player[0], oponente[0])
    }
    
    undefineCard(socektid,id_card,callback){
        var players = []
        players.push(this.player1)
        players.push(this.player2)
        var jugador = players.filter(data => data.id == socektid)
        console.log("mano")
        console.log(id_card)
        var card = jugador[0].mano.filter(data => data.id == id_card)
        console.log(card)
        if(card.length == 0){
            callback(jugador[0].mano)
        }else{
            callback(false)
        }

    }
}


exports.createGame = game;


function pintarVida(io, player, oponente){
  io.to(player.id).emit("vida",{"jugadorV":player.life,"oponeteV":oponente.life})
  io.to(oponente.id).emit("vida",{"jugadorV":oponente.life,"oponeteV":player.life})
  if(player.life <= 0){
    io.to(oponente.id).emit("winner",oponente)
    io.to(player.id).emit("loser",player)
  }else if(oponente.life <= 0){
    io.to(player.id).emit("winner",player)
    io.to(oponente.id).emit("loser",oponente)
  }
}
//funcion para mezclar cartas
function shuffle(arr) {
    var i,
        j,
        temp;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;    
};

//funcion para darle un identificador a cada carta
function comtCards(cards){
    var cardsNew = []
    cards.forEach(function(elem){
      var cont = elem.Info.cont
      if(cont > 1){
       for (i = 1; i < cont; i++) {
          var idObject = new Object()
          idObject.Info =  elem.Info
          var id = elem._id.split("")
          var shufid = shuffle(id)
          var idNew =  shufid.toString()
          idObject.id = idNew
          idObject.name = elem.name
          cardsNew.push(idObject)
        }
      }
      var idObject = new Object()
      idObject.Info =  elem.Info
      var id = elem._id.split("")
      var shufid = shuffle(id)
      var idNew =  shufid.toString()
      idObject.id = idNew
      idObject.name = elem.name
      cardsNew.push(idObject)
    });
    return cardsNew
}
  
//funcion para robar cartas
function takeCards(cant,cards){
    var mazo = []
    var mano = []
    var num = 1
    //funcion para igualar la cantidad de cartas q vas a robar  
    cards.forEach(function(elem){
        if(num > cant){
          mazo.push(elem)
        }else{
            mano.push(elem)
        }
        num += 1
    })
    var json = {
        mazo : mazo,
        mano: mano
    }
   return json
}


//funcion para conprobar la cantidad de mas que puedes usar 
function jsonManacost(manacost,player){
  var manaArr = []
  var resutJson = {
      mana_use : [],
      mana : [],
      use : false
  }
  var lenManaCard = manacost.length
  for(i = 0; i < lenManaCard; i++) { 
    var letra  = manacost.charAt(i)
    manaArr.push(letra)
  }
  //coste de mana
  var manaCreature = manaArr.filter(data => data != "}" && data != "{"  && data != "/" )
  var lenMana = 0
  var ManaType = []
  var Cantmana = 0
  //probas Manatype
  manaCreature.forEach(function(element) {
        var num = isNaN(element)
        if(num == false){
            var numCost = parseInt(element)
            lenMana += numCost
            Cantmana += numCost
        }else{
            ManaType.push(element)
            lenMana += 1
        }
  })
  var lenMType = ManaType.length 
  //contador de manas variable x
  var x = 0
  if(ManaType.length != 0){
    player.mana.forEach(function(element){
      var valid = false
      var letra = null
      ManaType.forEach(function(type){
        var cardMana = element.Info.colorIdentity.filter(data => data == type)
        console.log(cardMana.length)
        console.log(type)
        if(cardMana.length != 0 ){
          valid = true
          letra = type
        }
      })
      if(valid == true ){
        resutJson.mana_use.push(element)
        var Typecont = ManaType.filter(data => data == letra)
        var newType =  ManaType.filter(data => data != letra)
        if(Typecont.length > 1){
          delete Typecont[0];
          Typecont.forEach(function(elem){
            newType.push(elem)
          })
          ManaType = newType 
        }else if(Typecont.length == 1){
          ManaType = newType 
        }
        console.log("newType")
        console.log(ManaType)
      }else if(valid == false){
        resutJson.mana.push(element)
      }
    })
  }
  if(Cantmana != 0){
    var newMAna = []
    var x = 0
    resutJson.mana.forEach(function(elemmet){
      if(x < Cantmana){
        resutJson.mana_use.push(elemmet)
      }else{
        newMAna.push(elemmet)
      }
      x += 1
    })
    resutJson.mana = newMAna
  }
  console.log("lenManaUser")
  console.log(resutJson.mana_use.length)
  console.log(lenMana)
  if(resutJson.mana_use.length == lenMana ){
    resutJson.use = true
  }
  console.log("\n")
  return resutJson
}
function faseMantenimiento(oponente){
  console.log(oponente.mana_use)
  if(oponente.mana_use.length != 0){
    oponente.mana_use.forEach(function(data){
      oponente.mana.push(data)
    })
    oponente.mana_use = []
  }
  if(oponente.campoGirar.length != 0){
    oponente.campoGirar.forEach(function(data){
      oponente.campoEnderezar.push(data)
    })
    oponente.campoGirar = []
  }
  var robar = takeCards(1,oponente.mazo.cards)
  oponente.mano.push(robar.mano)
  oponente.mazo = robar.mazo
  return oponente;

}