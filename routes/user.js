const { log } = require('debug/src/browser');
var express = require('express');
const session = require('express-session');
const { route } = require('express/lib/application');
const { redirect, render } = require('express/lib/response');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
var userHelpers = require('../helpers/user-helpers')
const accountSID = 'ACdfff695a12c4d218a69d67693837d22a';
const serviceSID = 'VA73bb5779ea41f09e76aa0a553aaf3c4d';
const authToken = 'e75c07e07e14dce47b673d19a83ad7ef';
const client = require('twilio')(accountSID,authToken)

const verifyLogin = (req, res, next) => {
  if (req.session.userLoggedIn) {
    next();
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      if (!response.blocked) {
        req.session.user = response.user
        req.session.userLoggedIn = true;
        res.redirect('/')
      } else {
        req.session.userLogInErr = 'Sorry your account have been blocked'
        res.redirect('/login')
      }
    } else {
      req.session.userLogInErr = 'Invalid Username or Password'
      res.redirect('/login')
    }
  })
})
router.get('/', function (req, res, next) {
  let user = req.session.user
  productHelper.getAllProducts().then((products) => {
    productHelper.getAllCategory().then((category) => {
      res.render('user/view-products', { products, category, user });
    })
  })
});
router.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/')
  } else {
    res.render('user/login', { 'logInErr': req.session.userLogInErr })
    req.session.userLogInErr = false
  }
})

router.get('/otpLogin', (req, res) => {
  if (req.session.user) {
    res.redirect('/')
  } else {
    res.render('user/otpLogin', { 'logInErr': req.session.userLogInErr })
    req.session.userLogInErr = false
  }
})

var otpPhone
router.post('/otpLogin', (req, res) => {
var phone = req.body.mobile;
userHelpers.checkPhone(phone).then((num)=>{
  if(num?.userBlocked){
    res.render('user/otpLogin',{otpErr1:true})
  }else{
    if(num){
      client.verify
      .services(serviceSID)
      .verifications.create({
        to: `+91${req.body.mobile}`,
        channel: 'sms'
      })
      .then((resp)=>{
        if(resp){
          otpPhone = phone;
          res.render('user/otpSubmit',{otpPhone})
        }
      })
    }else{
      res.render('user/otpLogin',{otpErr:'Invalid Phone Number'})
    }
  }
  
})
otpPhone=null;
})

router.post('/otpSubmit/:id',(req,res)=>{
  const {otp} = req.body
  let phoneNumber = req.params.id;
  client.verify
  .services(serviceSID)
  .verificationChecks.create({
    to: `+91${phoneNumber}`,
    code: otp
  })
  .then((resp)=>{
    if(resp.valid){
      userHelpers.doOtpLogin(phoneNumber).then((response)=>{
        if (response.status) {
            req.session.user = response.user
            req.session.userLoggedIn = true;
            res.redirect('/')
        } else {
          req.session.userLogInErr = 'Invalid Username or Password'
          res.redirect('/login')
        }
      })
    }else{
      res.render('user/otpLogin',{otpErr:'Invalid otp'})
    }
  })
})

router.get('/signup', (req, res) => {
  res.render('user/signup')
})
router.post('/signup', (req, res) => {
  userHelpers.emailCheck(req.body.Emailaddress,req.body.Mobile).then((resp) => {
    if (resp) {
      if(resp.Mobile == req.body.Mobile){
        let check = true;
        res.render('user/signup', { check:'Mobile Already exist' })
      }else{
        let check = true;
        res.render('user/signup', { check:'Email Already exist' })
      }
    }else {
      userHelpers.doSignup(req.body).then((response) => {
        req.session.user = response.user
        req.session.loggedIn = true
        res.redirect('/login')
      })
    }
  })
})
router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.user
      req.session.userLoggedIn = true;
      res.redirect('/')
    } else {
      req.session.userLogInErr = 'Invalid Username or Password'
      res.redirect('/login')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.user = null;
  req.session.userLoggedIn = false;
  res.redirect('/');
})
router.get('/cart', verifyLogin, async (req, res) => {
  let user = req.session.user
  res.render('user/cart', { user })
})

router.get('/product-page/:id', async (req, res) => {
  let product = await userHelpers.productView(req.params.id)
  let user = req.session.user
  res.render('user/product-page', { product, user })
})

module.exports = router;
