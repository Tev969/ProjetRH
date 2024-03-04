const subscribeModel = require('../models/subscribeModel');
const userModel = require('../models/userModel');
const userRouter = require('express').Router();
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");




userRouter.get('/subscribe' , (req,res) => {
    res.render('subscribe/index.html.twig')
})


userRouter.post("/subscribe" , async (req,res) => {
    try {
        const user = new subscribeModel(req.body);
        await user.save();
        res.redirect('/login')
    } catch (error) {
        res.render('login/index.html.twig')
    }
})


// ​‌‌‌⁡⁣⁣⁢‍ROUTE LOGIN ⁡​


userRouter.get('/login' , (req,res) => {
    res.render('login/index.html.twig')
})

userRouter.post('/login' , async (req,res) => {
    try {
        let user = await userModel.findOne({ email: req.body.email}, { password: 0}) // on recherche l'utilisateur
        if (user) { // si il existe
            if (await bcrypt.compare(req.body.password, user.password)) { // on compare les mdp
                req.session.user = user // on stockrs user en session
                res.redirect('/pagePrincipale') // on redidrige vers le panel admin
            } else {
                throw {password: 'Mauvais mot de passe'}
            }
        }  else {
            throw {email: "Utilisateur introuvable"}
        }
    } catch (error) {
        res.render('login/index.html.twig')
    }
})


module.exports = userRouter