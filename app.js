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
  keys: ['token'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'))

app.use((req, res, next) => {
  res.locals.session = req.session.token;
  next();
})
//Define service endpoints

//GET /  welcome page 

app.get('/', (req, res) => {
  let token = null
  session = req.session
  if (session) {
    token = session.token
  }
  if (token) {
    res.render('welcome.html.ejs', { data: token })
  } else {
    res.render('welcome.html.ejs', { data: null })
  }
})
/**
  Create Invoice requirements
  1. Logged in user
  2. Invoice creation form
  3. API connection 
  4. API rCannot read property 'then' of undefinedequest
  5. Notify user (response)
*/
//GET /login endpoint (form)
app.get('/login', (req, res) => {
  let userSession = req.session
  console.log(userSession)
  res.render('login.html.ejs')
})
//POST /login endpoint (actual call)
app.post('/login', (req, res) => {
  session = req.session
  let options = {
    method: 'POST',
    url: config.api.authenticate,
    json: true,
    body: {
      principal: req.body.username,
      credentials: req.body.password,
      system: 'lucy'
    }
  }
  rp(options)
    .then(data => {
      session.token = data
      console.log(session)
      res.redirect('/')
    })
    .catch(err => {
      res.status(500).json({
        message: 'Unable to login',
        detail: err
      })
    })
})

app.get('/invoices', (req, res) => {
  const who = req.query.who || 'kidus'

  HelloCash.getInvoices(who)
    .then(data => {
      // console.log(data);
      res.render('invoices.html.ejs', { data: data })
    })
    .catch(err => {
      res.status(500).json({
        "message": "error"
      })
    })
})

app.get('/accounts', (req, res) => {
  const who = req.body.who || 'yemane'
  HelloCash.getAccounts(who)
    .then(data => {
      // console.log(data);
      res.render('accounts.html.ejs', { data: data })
    })

    .catch(err => {
      res.status(500).json({
        "message": "error"
      })
    })
})
app.get('/createinvoice', (req, res) => {
  res.render('createinvoice.html.ejs')
})
app.post('/createinvoices', (req, res) => {
  var who = 'kidus'
  var payload = {
    "amount": parseInt(req.body.amount),
    "description": req.body.description,
    "from": req.body.from,
    "currency": "ETB",
    "tracenumber": 'Kaleab - ' + new Date(),
    "notifyfrom": true,
    "notifyto": true,
    "expires": "2019-08-14T11:05:20.000Z"
  }

  HelloCash.createInvoices(who, payload)
    .then(data => {
      // console.log(data)
      res.render('invoiceshow.html.ejs', { data: data })
    }).catch(err => {
      res.status(500).json({
        "message": "error"
      })
    })
})

app.get('/transfers', (req, res) => {
  const who = 'yemane'
  HelloCash.getTransfers(who)
    .then(data => {
      res.render('transfers.html.ejs', { data: data })
    }).catch(err => {
      console.log(err)
    })
})

app.get('/crttransfer', (req, res) => {
  res.render('crttransfer.html.ejs')
})

app.post('/createtransfer', (req, res) => {
  var who = 'kidus'
  var transferbody = {

    "amount": parseInt(req.body.amount),
    "description": req.body.description,
    "to": req.body.to,
    "currency": "ETB",
    "tracenumber": "kaleab -" + new Date(),
    "referenceid": "id -" + new Date(),
    "notifyfrom": true,
    "notifyto": true
  }
  let tok = ''
  HelloCash.login(who).then(token => {
    tok = token;
    HelloCash.createTransfer(token, transferbody).
      then((data) => {
        let transfer_id = []
        transfer_id.push(data.id)

        // console.log(data)
        HelloCash.authorizeTransfer(transfer_id, tok)
          .then(data => {
            res.render("transfercrted.html.ejs", { data: data })
            console.log(data)
          }).catch(err => {
            console.log("error", err)
          })
      }).catch(err => {
        console.log("error", err)
      })
  })
})
app.get('/logout', (req, res) => {
  req.session = null// destroying the session
  //res.render('welcome.html.ejs')
  res.redirect('/')

})
//End of service endpoints definition
//Start the server
app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`)
})

