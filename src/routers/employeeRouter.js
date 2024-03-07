const authguard = require("../../services/authguard");
const employeeModel = require("../models/employeeModel");
const subscribeModel = require("../models/subscribeModel");
const employeeRouter = require("express").Router();
const multer = require("../../services/multer-config")

employeeRouter.get("/addEmployee", authguard, async (req, res) => {
  res.render("addEmployee/index.html.twig",
   {
    user: await subscribeModel.findById(req.session.user._id)
  });
});

employeeRouter.post('/addEmployee' , authguard, multer.single('photo') , async (req,res) => {
    try {
        let employee = new employeeModel(req.body)
        if (req.file) {
            if (req.multerError) {
                throw{errorUpload:"le ficher n'est pas valide"}
            }
            req.body.photo = req.file.filename
            employee.photo = req.file.filename
        }
        employee._user = req.session.user._id
        employee.validateSync()
        await employee.save()
        res.redirect("/principalPage")
    } catch (error) {
        res.render('addEmployee/index.html.twig' , {
            user: await subscribeModel.findById(req.session.user._id).populate('employeeCollection'),
            error: error,
        })
    }
})

employeeRouter.get('/deleteEmployee/:employeeid' , authguard , async (res,req) => {
    try {
        await employeeModel.deleteOne({ _id: req.params.employeeid})
        res.redirect('/principalPage')
    } catch (error) {
        res.render('principalPage/index.html.twig' , {
            errorDelete: "Probleme survenue lors du delete",
            user: await subscribeModel.findById(req.session.user._id).populate('employeeCollection')
        })
    }
})





module.exports = employeeRouter



