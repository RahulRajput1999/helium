const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongo = require('mongoose');
const router = express.Router();

const userSchema = mongo.Schema({
    email: String,
    username: String,
    dob: String,
    password: String,
});
const User = mongo.model("User", userSchema);
mongo.connect('mongodb://localhost:27017/helium', {useNewUrlParser: true});
router.use(cors());
router.use(cookieParser());
router.use(bodyParser.json());
/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

router.get('/login', function (req, res) {
    res.write(req.query.username);
    res.end();
});
router.post('/login', function (req, res) {
    console.log(req.body.username);
    res.write('Posted');
    res.end();
});

router.post('/postuser',function (req,res) {
   const userInfo = req.body;
   if(!userInfo.email || !userInfo.username || !userInfo.dob || !userInfo.password) {
       res.json({status: false, msg: 'All fields are mercenary'});
       console.log('l1');
       console.log(userInfo.email + '|' + userInfo.username + '|' + userInfo.dob + '|' + userInfo.password);
       res.end();
   } else{
       let count = 0;
       User.find({username: userInfo.username},function (err,users){
           count = users.length;
       });
       if(count <= 0) {
           const newUser = new User({
               email: userInfo.email,
               username: userInfo.username,
               dob: userInfo.dob,
               password: userInfo.password
           });
           newUser.save(function (err, data) {
               if (err) {
                   res.json({status: false, msg: 'Something went wrong'});
                   console.log('l2');
                   res.end();
               } else {
                   res.json({status: true, msg: 'Done'});
                   res.end();
               }
           });
       } else{
           res.json({status: false, msg: 'User already exists'});
           console.log('false-l3');
           res.end();
       }
   }
});

router.get('/hello', function (req, res) {
    res.write("Hello");
    res.end();
});

module.exports = router;
