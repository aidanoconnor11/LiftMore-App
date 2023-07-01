const express = require("express");
const { check } = require("express-validator");
const checkAuth = require("../middleware/check-auth");
const liftsControllers = require("../controllers/lifts-controllers");

const router = express.Router();

router.get("/:lid", liftsControllers.getLiftById);

router.get("/user/:uid", liftsControllers.getLiftsByUserId);

//router.use(checkAuth);

router.post("/", check("title").not().isEmpty(), liftsControllers.createLift);

router.patch("/:lid", liftsControllers.updateLift);

router.delete("/:lid", liftsControllers.deleteLift);

module.exports = router;
