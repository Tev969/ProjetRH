const subscribeModel = require("../models/subscribeModel");
const userRouter = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const authguard = require("../../services/authguard");

userRouter.get("/subscribe", (req, res) => {
  res.render("subscribe/index.html.twig");
});

userRouter.post("/subscribe", async (req, res) => {
  try {
    const user = new subscribeModel(req.body);
    user.validateSync();
    await user.save();
    req.session.user = user._id;
    res.redirect("/principalPage");
  } catch (error) {
    console.log(error);
    console.log(req.body);
    res.render("subscribe/index.html.twig", { error: error });
  }
});

// ​‌‌‌⁡⁣⁣⁢‍ROUTE LOGIN ⁡​

userRouter.get("/login", (req, res) => {
  res.render("login/index.html.twig");
});

userRouter.post("/login", async (req, res) => {
  try {
    let user = await subscribeModel.findOne({ email: req.body.email }); // on recherche l'
    if (user) {
      // si il existe
      console.log(user.password);
      console.log(req.body);
      if (bcrypt.compareSync(req.body.password, user.password)) {
        // on compare les mdp
        req.session.user = user; // on stockrs user en session
        req.session.firstConnect = "Vous vous etes connecter avec succes";
        res.redirect("/principalPage"); // on redidrige vers le panel admin
      } else {
        throw { password: "Mauvais mot de passe" };
      }
    } else {
      throw { email: "Email incorect" };
    }
  } catch (error) {
    console.log(error);
    res.render("login/index.html.twig", {
      title: "Connexion",
      error: error,
    });
  }
});

userRouter.get("/principalPage", authguard, async (req, res) => {
  try {
    let filterCriteria = {}; // Initialiser le critère de filtrage

    // Vérifier si req.query.filterFunction est défini
    if (req.query.filterFunction) {
      filterCriteria = {
        fonction: { $regex: req.query.filterFunction, $options: "i" },
      };
    }

    const user = await subscribeModel.findById(req.session.user._id).populate({
      path: "employeeCollection",
      match: filterCriteria,
    });

    res.render("principalPage/index.html.twig", {
      user: user,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send(
        "Une erreur s'est produite lors du chargement de la page principale."
      );
  }
});

/*
dans la route de blame :

tu recupere ton employe
tu prend son nombre de blame et tu l'incremente,
Si blame > 3
on delete l'utilisateur
sinon, on reviens sur le dashboard

*/

module.exports = userRouter;
