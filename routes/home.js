const { Router } = require("express");
const router = Router();
const config = require("../config");
const getHome = require("./home/getHomePage");
const {
  ROUTRES: { BASE },
} = config;

router.get(BASE, getHome);

module.exports = router;
