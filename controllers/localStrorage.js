const Cards = require('../models/Card')
const Users = require('../models/User')

//CANTIDAD DE CARTAS QUE TIENES EN EL SERVIDO
exports.card_deks_cont = (req, res) => {
    const user_data = req.body
    console.log(user_data)
    const Json_data = {
        cards_c: null,
        deck_c: null
    }
    console.log(Json_data)
    Cards.find({}, (err, cards) => {
        if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` });
        if (!cards) return res.status(404).send({ message: `No existen series` });
        Json_data.cards_c = cards.length
        Users.findOne(user_data, (err, data) => {
            if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` });
            Json_data.deck_c = data.mazos.length
            res.status(200).send(Json_data)
        })
    });
}