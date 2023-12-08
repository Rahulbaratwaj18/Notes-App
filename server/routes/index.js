const express = require("express");

const router = express.Router();

const mainController = require("../controller/maincontroller");

const { isloggedIn } = require("../middleware/checkAuth");

router.get("/", mainController.homepage);

router.get("/about", mainController.aboutPage);

//Dashboard routes

router.get("/dashboard", isloggedIn, mainController.dashboard);

router.get("/dashboard/item/:id", isloggedIn, mainController.viewNote);

router.post("/dashboard/item/:id", isloggedIn, mainController.updateNote);

router.delete(
  "/dashboard/item-delete/:id",
  isloggedIn,
  mainController.deleteNote
);

router.get("/dashboard/add", isloggedIn, mainController.addNote);

router.post("/dashboard/add", isloggedIn, mainController.addNoteSubmit);


router.get("/dashboard/search", isloggedIn, mainController.searchNote);

router.post("/dashboard/search", isloggedIn, mainController.serachNoteSubmit);




module.exports = router;
