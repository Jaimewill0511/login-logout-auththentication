const express = require("express");

const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const {homepage, register, getIn, logout} = require("../controllers/controller")

router.get('/', homepage)
router.get('/register', (req, res) => res.render('Register'));
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard', {
    name : req.user.name, 
}));
router.get('/login', (req, res) => res.render('login'));
router.post('/register', register)
router.post('/login', getIn);
router.get('/logout', logout )


module.exports = router 