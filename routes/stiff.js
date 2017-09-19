var express = require('express');
var router = express.Router();

/* GET home page. */
var min=0;
var max=100;
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
router.get('/stiffmister', function(req, res, next) {
  res.render('stiff', { title: 'RandomInteger', className:'cst', ranNumber:getRandomArbitrary(min,max) });
});

module.exports = router;