const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongo = require('mongoose');
const router = express.Router();

// Model for the mongodb database.
const userSchema = mongo.Schema({
    email: String,
    username: String,
    dob: String,
    password: String,
});
const User = mongo.model("User", userSchema);

const sessionSchema = mongo.Schema({
    sessionID: String,
    userID: String,
    userName: String,
});
const Session = mongo.model("Session", sessionSchema);
const topicSchema = mongo.Schema({
    name: String,
});
const Topic = mongo.model("Topic", topicSchema);
const questionSchema = mongo.Schema({
    question: String,
    description: String,
    topic_ids: [String],
    date: String,
    user_id: String,
    up_votes: Number,
    down_votes: Number,
});
const  Question = mongo.model("Question", questionSchema);
// Connecting to mongodb server.
const promise = mongo.connect('mongodb://localhost:27017/helium', {useNewUrlParser: true});
//console.log(promise);

// Cross Origin Resource Sharing filter to communicate between angular cli and node js.
router.use(cors({credential: true}));
router.use(cookieParser());
router.use(bodyParser.json());
router.use(session({secret: "Your secret key"}));

// Route for post request of login form.
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
            } else {
                console.log(user);
                if (user[0].password.match(userInfo.password)) {
                    console.log(user[0]);
                    var date = new Date();
                    var t = date.getMilliseconds();
                    var sessID = t.toString() + user[0]._id;
                    const newSession = new Session({
                        sessionID: sessID,
                        userID: user[0]._id,
                        userName: user[0].username
                    });
                    newSession.save(function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(data);
                        }
                    });
                    res.json({status: true, msg: 'Successfully logged in', sessionID: sessID});
                    res.end();
                } else {
                    res.json({status: false, msg: 'Wrong Username or Password'});
                    res.end();
                }
            }
        });
    }
});
//User.collection.drop();
//Session.collection.drop();
// get the user session if exists
router.post('/getSession', function (req, res) {
    const sessionID = req.body;
    if (sessionID.sessionID) {
        Session.find({sessionID: sessionID.sessionID}, function (err, session) {
            if (err) {
                console.log('error' + err);
                res.end();
            } else {
                if (session.length > 0) {
                    res.json({status: true, session: session[0]});
                } else {
                    res.json({status: false});
                }
                res.end();
            }
        });
    } else {
        res.json({status: false});
        res.end();
    }
});

router.post('/destroySession', function (req, res) {
    const sessionID = req.body;
    if (sessionID.sessionID) {
        Session.remove({sessionID: sessionID.sessionID}, function (err, data) {
            if (err) {
                console.log(err);
                res.end();
            } else {
                res.json({status: true});
                res.end();
            }
        });
    } else {
        res.json({status: false});
        res.end();
    }
});
// router for post request of sign up page
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
    }
});

module.exports = router;