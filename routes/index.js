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

router.post('/login', function (req, res) {
    const userInfo = req.body;
    if (!userInfo.username || !userInfo.password) {
        res.json({status: false, msg: 'All fields are mercenary'});
        console.log('l1');
        res.end();
    } else {
        User.find({username: userInfo.username}, function (err, user) {
            if (user.length <= 0) {
                res.json({status: false, msg: 'Wrong Username or Password'});
                res.end();
            } else{
                res.json({status: true, msg: 'Successfully logged in', user: user});
                res.end();
            }
        });
    }
});
//User.collection.drop();

router.post('/postuser', function (req, res) {
    const userInfo = req.body;
    if (!userInfo.email || !userInfo.username || !userInfo.dob || !userInfo.password) {
        res.json({status: false, msg: 'All fields are mercenary'});
        console.log('l1');
        console.log(userInfo.email + '|' + userInfo.username + '|' + userInfo.dob + '|' + userInfo.password);
        res.end();
    } else {
        let count = 0;
        User.find({username: userInfo.username}, function (err, users) {
            count = users.length;
            console.log(count);
            if (count <= 0) {
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
            } else {
                res.json({status: false, msg: 'User already exists'});
                console.log('false-l3');
                res.end();
            }
        });
        console.log('c2' + count);

    }
});

module.exports = router;
