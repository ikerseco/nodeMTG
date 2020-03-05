const mtg = require('mtgsdk')
const Cards = require('../models/Card')

//COJER CARTAS DE LA API Y GUARDARLAS EN LA BASE DE DATOS

exports.getAllCards = (req, res) => {
  var tipe = req.params.tipeCard
  mtg.card.where({ pageSize: 100, set: "RNA", types:tipe, language: "spanish"})
    .then(cards => {
        const cards_ary = []
        cards.forEach(function(data) {
          const filterCards = data.foreignNames.filter(data => data.language == "Spanish")
          var json_cards = {
            colorIdentity:data.colorIdentity,
            manaCost: data.manaCost,
            type: data.type,
            types: data.types,
            subtypes: data.subtypes,
            set: data.set,
            power: data.power,
            toughness: data.toughness,
            text: data.text,
            foreignNames: filterCards[0]
          }
          var json = {
            Info: json_cards,
            name: data.name
          }
          cards_ary.push(json)
        });
        Cards.insertMany(cards_ary, (err, docs) => {
            if (err) return res.status(500).send({ message: 'Error al realizar la peticion', err });
            if (!docs) return res.status(404).send({ message: `dato` });
            console.log(cards_ary.length)
            res.status(200).send(cards_ary)
      })    
})
}

exports.getOneCard = (req,res) =>{
  var n = req.params.nameCard
  console.log(n)
  mtg.card.where({pageSize: 1, name:n,set: "RNA", language: "spanish"})
  .then(data => {
    const filterCards = data[0].foreignNames.filter(data => data.language == "Spanish")
    var json_cards = {
      colorIdentity:data[0].colorIdentity,
      manaCost: data[0].manaCost,
      type: data[0].type,
      types: data[0].types,
      subtypes: data[0].subtypes,
      set: data[0].set,
      power: data[0].power,
      toughness: data[0].toughness,
      text: data[0].text,
      foreignNames: filterCards[0]
    }
    var json = {
      Info: json_cards,
      name: data[0].name
    }
    var newCard = new Cards(json)
    newCard.save(function (err, data) {
      if (err) return res.status(500).send({ message: 'Error al realizar la peticion', err });
      if (!data) return res.status(404).send({ message: `dato` });
      res.status(200).send(data);
    })
  })
}


exports.norepetirNonbre = (req, res, next) => {
  var n = req.params.nameCard;
  console.log(n)
  Cards.find({}, (err, data) => {
    mtg.card.where({ pageSize: 1, name: n ,language: "spanish",set: "RNA"})
      .then(da => {
        console.log(da)
        if(da.length == 0){
          return res.status(404).send({ message: "noexit" });
        }
        nameRE = false
        data.forEach(function (element) {
          console.log(element.name)
          if (element.name == da[0].name) {
            nameRE = true
          }
        })
        console.log(nameRE)
        if (nameRE == false) {
          return next()
        } else {
          return res.status(404).send({ message: "400 exit card" });
        }

      })
  });
}

exports.downloadCards = (req, res) => {
  Cards.find({}, (err, Cards) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` });
    if (!Cards) return res.status(404).send({ message: `No existen series` });
    res.status(200).send({ Cards });
  });
};

