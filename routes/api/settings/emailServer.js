const express = require('express');
const router = express.Router();
var { con } = require('../../../config/mysqlDB');


router.get('/', async (req, res) => {
  console.log("Hello Ecotime");
  con.query("SELECT * FROM settings", function (err, result, fields) {
    if (err) throw err;
    console.log(result[0].id);
    res.status(200).json(result);
  });
})


module.exports = router;