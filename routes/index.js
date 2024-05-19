var express = require('express');
const passport = require('passport');
var router = express.Router();
const UserModel = require('../models/user');
const localStrategy = require('passport-local');
const isLoggedIn = require('../middlewares/middleware').isLoggedIn;
const upload = require('../multer');
const flash = 

passport.use(new localStrategy(UserModel.authenticate()));

router.get('/', function(req, res) {
  res.render('index', {footer: false});
});
router.post('/register', function (req,res) {
  var newUser = new UserModel({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email
  });

  UserModel.register(newUser, req.body.password)
  .then(function(){
    passport.authenticate('local')(req, res, function(){
      res.redirect('/profile');
    });
  })
});

router.get('/login', function(req, res) {
  let message = req.flash('error')[0];
  res.render('login', {footer: false,message});
});
router.post('/login',passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.get('/logout', function(req, res,next) {
  req.logout(function(err){
    if(err) return next(err);
  });
  res.redirect('/login');
});

router.get('/feed', isLoggedIn, function(req, res) {
  res.render('feed', {footer: true});
});

router.get('/profile', isLoggedIn,async function(req, res) {
  const user = await UserModel.findOne({username:req.session.passport.user});
  res.render('profile', {user,footer: true});
});

router.get('/search', isLoggedIn, function(req, res) {
  res.render('search', {footer: true});
});

router.get('/edit', isLoggedIn, async function(req, res) {
  const user = await UserModel.findOne({username:req.session.passport.user});
  res.render('edit', {user,footer: true});
});
router.post('/update', upload.single('image'), isLoggedIn,async function(req, res) {
  const user = await UserModel.findOneAndUpdate({username:req.session.passport.user},
    {username:req.body.username,name:req.body.name,bio:req.body.bio}, 
    {new: true}
  );
  if(req.file){
    user.profilePic = req.file.filename;
    await user.save();
}
  res.redirect('/profile');
});

router.get('/upload', isLoggedIn, function(req, res) {
  res.render('upload', {footer: true});
});
module.exports = router;
