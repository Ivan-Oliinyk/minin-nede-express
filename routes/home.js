const { Router } = require("express");
const router = Router();
const config = require("../config");
const getHome = require("./home/getHomePage");
const {
  ROUTES: { BASE },
} = config;

router.get(BASE, getHome);

module.exports = router;
