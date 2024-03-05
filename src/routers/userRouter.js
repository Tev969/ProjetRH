const subscribeModel = require('../models/subscribeModel');
const userRouter = require('express').Router();
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const authguard = require('../../services/authguard')



userRouter.get('/subscribe' , (req,res) => {
    res.render('subscribe/index.html.twig')
})


userRouter.post("/subscribe" , async (req,res) => {
    try {
        const user = new subscribeModel(req.body);
        user.validateSync()
        console.log("mes couilles");
        await user.save();
        req.session.user = user._id
        res.redirect('/principalPage')
    } catch (error) {
        console.log(error);
        console.log(req.body);
        res.render('subscribe/index.html.twig',{error: error})
    }
})


// ​‌‌‌⁡⁣⁣⁢‍ROUTE LOGIN ⁡​


userRouter.get('/login' , (req,res) => {
    res.render('login/index.html.twig')
})

userRouter.post('/login' , async (req,res) => {
    try {
        let user = await subscribeModel.findOne({ email: req.body.email}) // on recherche l'utilisateur
        if (user) { // si il existe
            console.log(user.password);
            console.log(req.body);
            if (await bcrypt.compare(req.body.password, user.password)) { // on compare les mdp
                req.session.user = user // on stockrs user en session
                req.session.firstConnect = "Vous vous etes connecter avec succes"
                res.redirect('/principalPage') // on redidrige vers le panel admin
            } else {

                throw {password: 'Mauvais mot de passe'}
            }
        }  else {
            throw {email: 'Email incorect'}
        }
    } catch (error) {
        console.log(error);
        res.render('login/index.html.twig' , {
            title:"Connexion",
            error: error
        })
    }
})


userRouter.get('/principalPage' , authguard , (req,res) => {
    res.render('principalPage/index.html.twig')
})

module.exports = userRouter