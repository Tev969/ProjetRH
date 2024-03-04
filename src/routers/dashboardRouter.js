const dashBoardRouter = require('express').Router();

dashBoardRouter.get("/dashboard" , (req,res) => {
    res.render("dashboard/index.html.twig")
})


module.exports = dashBoardRouter
