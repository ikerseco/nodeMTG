const deck = require('../models/Deck');
const card = require('../models/Card');
const user = require('../models/User')

//CREAR EL MAZO 
exports.createDeck = (req, res) => {
    let deckJson = req.body;
    let newDeck = new deck(deckJson)
    newDeck.save(function (err, data) {
        if (err) return res.status(500).send({ message: 'Error al crear el mazo', err });
        if (!data) return res.status(404).send({ message: `dato` });
        res.status(200).send(data);
    });
};

//GUARDAR CARTAS EN EL MAZO
exports.savecard = (req, res) => {
    let name = req.params.name;
    let Narray = name.split("&")
    card.findOne({ name: Narray[1] }, (err, dacard) => {
        deck.findOne({ name: Narray[0] }, (err, dadeck) => {
            let de = dadeck
            let dc = dacard
            let _id = dadeck._id
            dc.Info.cont = 1
            de.cards.push(dc)
            deck.findByIdAndUpdate(_id, { $set: de }, (err, updata) => {
                if (err) return res.status(500).send({ message: 'Error al crear el mazo', err });
                if (!updata) return res.status(404).send({ message: `dato` });
                res.status(200).send(dadeck);
            });
        })

    })
    //res.status(200).send("ok");
};

//NO REPETIR CARTA
exports.repitcard = (req, res, next) => {
    let name = req.params.name;
    let Narray = name.split("&")
    card.findOne({ name: Narray[1] }, (err, dacard) => {
        deck.findOne({ name: Narray[0] }, (err, dadeck) => {
            let esixt = false
            let cont = null
            let _id = dadeck._id
            if (dadeck.cards.length != 0) {
                dadeck.cards.forEach(element => {
                    if (element.name == dacard.name) {
                        element.Info.cont += 1
                        esixt = true
                        cont = element.Info.cont
                    }
                })
            }
            if (esixt == true && cont <= 4) {
                deck.findByIdAndUpdate(_id, { $set: dadeck }, (err, updata) => {
                    if (err) return res.status(500).send({ message: 'Error al crear el mazo', err });
                    if (!updata) return res.status(404).send({ message: `dato` });
                    res.status(200).send(dadeck);
                });
            } else if (esixt == true && cont > 4) {
                res.status(404).send("maximo de cartas");
            }
            else if (esixt == false) {
                return next()
            }

        });
    })

}



//NO REPETIR MAZO
exports.norepitDeck = (req, res, netx) => {
    let nameDek = req.params.name
    let userData = req.body
    user.findOne(userData, (err, datau) => {
        if (err) return res.status(500).send({ message: 'Error al crear el mazo', err });
        if (!datau) return res.status(404).send({ message: `updata` });
        if (datau.mazos.length == 0) return res.status(404).send({ message: 'existe el mazo' })
        /// res.status(200).send(datau);
        deck.findOne({ name: nameDek }, (err, datade) => {
            if (err) return res.status(500).send({ message: 'Error al crear el mazo', err });
            if (!datade) return res.status(404).send({ message: `updata` });
            let repit = false
            datau.mazos.forEach(element => {
                if (element.name == nameDek) {
                    repit = true
                }
            })
            if (repit == true) {
                return res.status(404).send({ message: 'esite el mazo' })
            } else {
                return next()
            }
        })
    })
}


