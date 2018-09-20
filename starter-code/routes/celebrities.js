const express = require('express');
const router  = express.Router();
const Celebrity = require('../models/Celebrity');

// REMEMBER: Add /celebrity before

// get celebrities list
router.get('/', (req, res) => {
  Celebrity.find()
  .then( celebrities => res.render('celebrities/list.hbs', {celebrities}))
  .catch( err => console.log(err));
})

// get new celebrity form
// IMPORTANT ORDER
router.get('/new', (req, res) => {
  res.render('celebrities/new');
})

router.post('/new', (req, res) => {
  let { name, occupation, catchPhrase } = req.body;

  Celebrity.create({name, occupation, catchPhrase})
  .then(() => res.redirect('/celebrities'))
  .catch(err => console.log(err));
})

// get edit celebrity form
router.get('/edit/:id', (req, res) => {
  Celebrity.findById(req.params.id)
  .then(celebrity => res.render('celebrities/edit', {celebrity}))
  .catch(err => console.log(err));
})

router.post('/edit/:id', (req, res) => {
  let { name, occupation, catchPhrase } = req.body;

  Celebrity.findByIdAndUpdate(req.params.id, {name, occupation, catchPhrase}, {new: true})
  .then(celebrity => res.redirect(`/celebrities/${celebrity._id}`))
  .catch(err => console.log(err));
})

// delete celebrity
router.get('/delete/:id', (req, res) => {
  Celebrity.findByIdAndRemove(req.params.id)
  .then( () => res.redirect('/celebrities'))
  .catch( err => console.log(err));
})

// get celebrity detail
router.get('/:id', (req, res) => {
  Celebrity.findById(req.params.id)
  .then( celebrity => res.render('celebrities/detail.hbs', {celebrity}))
  .catch( err => console.log(err));
})



module.exports = router;
