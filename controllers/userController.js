const Users = require('../models/User');

//BAJAR TODOS LOS USUARIOS
exports.allUsers = (req, res) => {
    Users.find({}, (err, data) => {
        if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` });
        if (!data) return res.status(404).send({ message: `No existen series` });
        res.status(200).send(data);
    });
};

//CREAR UN USUARIO
exports.createUser = (req, res) => {
    let Userjson = req.body;
    var newUser = new Users(Userjson)
    newUser.save(function (err, data) {
        if (err) return res.status(500).send({ message: 'Error al realizar la peticion', err });
        if (!data) return res.status(404).send({ message: `dato` });
        res.status(200).send(data);
    });
};

//BAJAR UN USUARIO
exports.oneUser = (req, res) => {
    let UserId = req.params.name;
    Users.findOne({ _id: UserId }, (err, data) => {
        if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` });
        if (!data) return res.status(404).send({ message: `No existe ese admin` });
        res.status(200).send({ "Series": data });
    });
};

//ACTUALIZAR UN USUARIO
exports.updateUser = (req, res) => {
    let UserId = req.params.name;
    let Userjson = req.body;
    Users.findByIdAndUpdate(UserId, { $set: Userjson }, function (err, dato) {
        if (err) return res.status(500).send({ message: 'Error al realizar la peticion', err });
        if (!dato) return res.status(404).send({ message: `dato` });
        res.status(200).send({ "actualizada": dato });
    });
}


//BALIDAR SI SE REPIE EL USUARIO
exports.validateUser = (req, res, next) => {
    let userName = req.body.name;
    let repetir = false;
    Users.find({}, (err, data) => {

        data.forEach(function (element) {
            //console.log(element.name)
            if (element.name == userName) {
                repetir = true;
                //console.log("bai")
            }
        });

        //console.log(userName)
        if (repetir == false) {
            return next();
        } else {
            res.status(200).send({ message: `el usuario ya existe` });
        }
    });
}


//BORRAR USUARIO
exports.deleteUser = (req, res) => {
    var UserId = req.params.id;
    Users.findByIdAndRemove({ _id: UserId }, (err, data) => {
        if (err) return res.status(500).send({ message: `Error al borrar el usuario: ${err}` });
        if (!data) return res.status(404).send({ message: `No existe ese usuario` });
        res.status(200).send({ "Usuarios": data });

    });

};

