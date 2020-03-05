const express = require('express')
const router = express.Router();


const userCtrl = require('../controllers/userController.js')
const cardsCtrl = require('../controllers/cardController.js')
const decksCtrl = require('../controllers/deckController.js')
const userDeckCtrl = require('../controllers/userDeckController.js')
const localStoCtrl = require('../controllers/localStrorage.js')
const gameCrlt = require('../controllers/gameController.js')



//Users
router.get("/allUsers",userCtrl.allUsers)
router.post("/createUser",userCtrl.validateUser,userCtrl.createUser)
router.get("/oneUser/:name",userCtrl.oneUser)
router.put("/updateUser/:name",userCtrl.updateUser)
router.delete("/deleteUser/:id",userCtrl.deleteUser)
//cards
router.get('/downloadCards',cardsCtrl.downloadCards)
router.get("/allCards/:tipeCard", cardsCtrl.getAllCards)
router.get("/getOneCard/:nameCard",cardsCtrl.norepetirNonbre,cardsCtrl.getOneCard)
//mazos
router.post("/createDeck",decksCtrl.createDeck)
router.put("/Deck/saveCard/:name",decksCtrl.repitcard,decksCtrl.savecard)
router.post("/removeDeck",userDeckCtrl.removeDeck)
//usermazo
router.get("/UserDekc/all",userDeckCtrl.getDeck)
router.post("/UserDekc/edit",userDeckCtrl.editDeck)
router.post("/UserDekc/create",userDeckCtrl.noRepeat,userDeckCtrl.createDeck)
//localstorage
router.post("/localStorage/check",localStoCtrl.card_deks_cont)

//game 
//router.post("/creategame",gameCrlt.findGame)




module.exports = router
