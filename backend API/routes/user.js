const express = require("express");
const passport = require("passport");
const userController = require("../controllers/user");
const { verify, verifyAdmin, isLoggedIn } = require("../auth");

const router = express.Router();

router.post("/check-email", userController.checkEmailExists);

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/details",verify, userController.getProfile);

router.put('/update-password', verify, userController.updatePassword);

router.put('/profile', verify, userController.updateProfile);

router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.updateUserAsAdmin);


module.exports = router;