var config = require('./config/config')
var PORT = process.env.PORT || 5000
var express = require('express')
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var bodyParser = require('body-parser')
var ejs = require('ejs')
var HelloCash = require('./lib/hellocash')
var rp = require('request-promise-native')
var app = express()
var expressHelpers = require('express-helpers'); expressHelpers(app);

app.use(cookieSession({
    name: 'kmsession',
    key: ['token']
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'))

app.use(cookieSession({
    name: 'myvookiename',
    key: ['token as a key'],
    maxAge: 24 * 60 * 60 * 1000
}));

app.use((req, res, next) => {
    res.locals.session = req.session.token
    next()
})

app.get('/', (req, res) => {
    var token = null
    session = req.session
    if (session) {
        token = session.token
    }
    if (token) {
        res.render
    }
})

app.post('/login', (req, res) => {
    session = req.session;
    let options = {
        url= cinfig.api.authenticate,
        json: true,
        body: {
            principal: req.body.username,
            cridentials: req.body.password,
            system: 'lucy'
        }

    }
    rp(options)
        .then(data=>{
            session.token=data,
            res.redirect('/')
        })
        .catch(error=>{
            res.status(500).json({
                message:"error login",
                detail: err
            })
        })
})





