const user = require('../models/User')

//BAJAR TODOS LOS MAZOS DEL USUARIO
exports.getDeck = (req, res) => {
    let dataU = req.query;
    user.findOne(dataU, (err, datauser) => {
        if (err) return res.status(500).send({ message: 'Error al crear el mazo', err });
        if (!datauser) return res.status(404).send({ message: `dato` });
        res.status(200).send(datauser.mazos);
    })
}

//GUARDAR LOS CANBIOS DEL MAZO
exports.editDeck = (req, res) => {
    let dataU = req.body;
    user.findOne({ idUsuario: dataU.idUsuario }, (err, datauser) => {
        if (err) return res.status(500).send({ message: 'Error al crear el mazo', err });
        if (!datauser) return res.status(404).send({ message: `dato` });
        const userdeks = datauser.mazos.filter(data => data.name != dataU.data_m.name)//arazoak
        datauser.mazos = userdeks
        datauser.mazos.push(dataU.data_m)
        user.findByIdAndUpdate(datauser._id, { $set: datauser }, (err, updata) => {
            if (err) return res.status(500).send({ message: 'Error al crear el mazo', err });
            if (!updata) return res.status(404).send({ message: `dato` });
            res.status(200).send(datauser);
        });
    })
}

//PARA CREAR UN MAZO
exports.createDeck = (req, res) => {
    let dataU = req.body;
    user.findOne({ idUsuario: dataU.idUsuario }, (err, datauser) => {
        if (err) return res.status(500).send({ message: 'Error al crear el mazo', err });
        if (!datauser) return res.status(404).send({ message: `dato` });
        datauser.mazos.push(dataU.data_m)
        user.findByIdAndUpdate(datauser._id, { $set: datauser }, (err, updata) => {
            if (err) return res.status(500).send({ message: 'Error al crear el mazo', err });
            if (!updata) return res.status(404).send({ message: `dato` });
            res.status(200).send(datauser);
        });
    })
}

//PARA ELIMINAR UN MAZO
exports.removeDeck = (req, res) => {
    let dataU = req.body;
    user.findOne({ idUsuario: dataU.idUsuario }, (err, datauser) => {
        if (err) return res.status(500).send({ message: 'Error al crear el mazo', err });
        if (!datauser) return res.status(404).send({ message: `dato` });

        const userdeks = datauser.mazos.filter(data => data.name != dataU.name)
        datauser.mazos = userdeks
        user.findByIdAndUpdate(datauser._id, { $set: datauser }, (err, updata) => {
            if (err) return res.status(500).send({ message: 'Error al crear el mazo', err });
            if (!updata) return res.status(404).send({ message: `dato` });
            res.status(200).send(datauser);
        });
    })
}

//PARA NO REPETIR EL MAZO
exports.noRepeat = (req, res, next) => {
    let dataU = req.body;
    user.findOne({ idUsuario: dataU.idUsuario }, (err, datauser) => {
        console.log(dataU.data_m.name)
        var search = datauser.mazos.filter(data => data.name == dataU.data_m.name)
        console.log(search.length)
        if (search.length >= 1) {
            return res.status(404).send({ message: `el mazo existe` });;
        } else {
            return next()
        }
    })
}


