const authguard = require("../../services/authguard");
const employeeModel = require("../models/employeeModel");
const subscribeModel = require("../models/subscribeModel");
const employeeRouter = require("express").Router();
const multer = require("../../services/multer-config");
const upload = require("../../services/multer-config");

employeeRouter.get("/addEmployee", authguard, async (req, res) => {
  res.render("addEmployee/index.html.twig", {
    user: await subscribeModel.findById(req.session.user._id),
  });
});

employeeRouter.post(
  "/addEmployee",
  authguard,
  multer.single("photo"),
  async (req, res) => {
    try {
      let employee = new employeeModel(req.body);
      if (req.file) {
        if (req.multerError) {
          throw { errorUpload: "le ficher n'est pas valide" };
        }
        req.body.photo = req.file.filename;
        employee.photo = req.file.filename;
      }
      employee._user = req.session.user._id;
      employee.validateSync();
      await employee.save();
      res.redirect("/principalPage");
    } catch (error) {
      console.log(req.session);
      res.render("addEmployee/index.html.twig", {
        user: await subscribeModel
          .findById(req.session.user._id)
          .populate("employeeCollection"),
        error: error,
      });
    }
  }
);

employeeRouter.get(
  "/deleteEmployee/:employeeid",
  authguard,
  async (req, res) => {
    try {
      await employeeModel.deleteOne({ _id: req.params.employeeid });
      res.redirect("/principalPage");
    } catch (error) {
      res.render("principalPage/index.html.twig", {
        errorDelete: "Probleme survenue lors du delete",
        user: await subscribeModel
          .findById(req.session.user._id)
          .populate("employeeCollection"),
      });
    }
  }
);

employeeRouter.get(
  "/updateEmployee/:employeeid",
  authguard,
  async (req, res) => {
    try {
      let employee = await employeeModel.findById(req.params.employeeid);
      res.render("updateEmployee/index.html.twig", {
        user: await employeeModel.findById(req.session.user._id),
        employee: employee,
      });
    } catch (error) {
      console.log(error);
      res.render("principalPage/index.html.twig", {
        user: await subscribeModel
          .findById(req.session.user._id)
          .populate("employeeCollection"),
        errorMessage: "Utilisateur que vous souhaitez modifier n'existe pas",
        user: await employeeModel.findById(req.session.user._id),
      });
    }
  }
);

employeeRouter.post(
  "/update/:employeeid",
  authguard,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (req.file) {
        req.body.photo = req.file.filename;
      }
      await employeeModel.updateOne({ _id: req.params.employeeid }, req.body);
      res.redirect("/principalPage");
    } catch (error) {
      res.render("principalPage/index.html.twig", {
        errorDelete: "Probleme survenue ",
      });
    }
  }
);

employeeRouter.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/login");
});

employeeRouter.get(
  "/blameEmployee/:employeeid",
  authguard,
  async (req, res) => {
    try {
      let employee = await employeeModel.findById(req.params.employeeid);
      if (employee) {
        employee.blame += 1;
        if (employee.blame >= 3) {
          await employeeModel.deleteOne({ _id: req.params.employeeid });
        } else {
          employee.save();
        }
      }
      res.redirect("/principalPage");
    } catch (error) {
      console.log(error);
      res.render("/principalPage");
    }
  }
);

employeeRouter.get("/search", (req, res) => {
  const query = req.query.query;
  employeeModel.find(
    {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { fonction: { $regex: query, $options: "i" } },
      ],
    },
    (err, employees) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({
            error:
              "Une erreur s'est produite lors de la recherche des employés.",
          });
      }
      // Retournez les résultats de la recherche au format JSON
      res.json(employees);
    }
  );
});

module.exports = employeeRouter;
