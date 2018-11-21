const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.use('/celebrities', require('./celebrities'));

router.use('/auth', require('./auth'));


module.exports = router;
