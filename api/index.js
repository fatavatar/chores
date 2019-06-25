const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Chores = require('./chores');
const Users = require('./users')
const Log = require('./logs')

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute =
  'mongodb://@192.168.1.114:27017/chores';

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// this is our get method
// this method fetches all available data in our database
router.get('/chores', (req, res) => {
  Chores.find((err, data) => {
    if (err) {
      return res.json({ success: false, error: err });
    }
    return res.json({ success: true, data: data });
  });
});

// this is our get method
// this method fetches all available data in our database
router.get('/users', (req, res) => {
  Users.find((err, data) => {
    if (err) {
      return res.json({ success: false, error: err });
    }
    return res.json({ success: true, data: data });
  });
});


// this is our update method
// this method overwrites existing data in our database
router.get('/start/:id/:user', (req, res) => {
  Chores.findById(req.params.id, (err, chore) => {
    if (err) return res.json({ success: false, error: err });
    Users.findOne({name: req.params.user}, (err, user) => {
      if (err) return res.json({success: false, error: err});
      if (chore.beingDoneBy) {
        Chores.find((err,data) => {
          if (err) return res.json({ success: false, error: err});
          return res.json({success: false, error: "Chore already in progress by " + chore.beingDoneBy, chores: data})  
        })
      } else { 
        chore.beingDoneBy = req.params.user
        Chores.findByIdAndUpdate(req.params.id, chore, (err) => {
          if (err) return res.json({ success: false, error: err});
          let startLog = new Log()
          startLog.user = user
          startLog.chore = chore
          startLog.action = "start"
          startLog.save((err) => {
            if (err) return res.json({ success: false, error: err});
            Chores.find((err,data) => {
              if (err) return res.json({ success: false, error: err});
              return res.json({success: true, chores: data})  
            })
          })
        })
      }
    })
  })
});

// this is our update method
// this method overwrites existing data in our database
router.get('/stop/:id/:user', (req, res) => {

  Chores.findById(req.params.id, (err, chore) => {
    if (err) return res.json({ success: false, error: err });
    Users.findOne({name: req.params.user}, (err, user) => {
      if (err) return res.json({success: false, error: err});
      if (!chore.beingDoneBy || chore.beingDoneBy !== req.params.user) {
        Chores.find((err,data) => {
          if (err) return res.json({ success: false, error: err});
          return res.json({success: false, error: "Chore not owned by " + req.params.user, chores: data})  
        })
      } else {        
        chore.beingDoneBy = ""
        chore.lastEndTime = Date.now()
        Chores.findByIdAndUpdate(req.params.id, chore, (err) => {
          if (err) return res.json({ success: false, error: err});
          let stopLog = new Log()
          stopLog.user = user
          stopLog.chore = chore
          stopLog.action = "stop"
          stopLog.save((err) => {
            if (err) return res.json({ success: false, error: err});
            Chores.find((err,data) => {
              if (err) return res.json({ success: false, error: err});
              return res.json({success: true, chores: data})  
            })
          })
        })
      }
    })
  })
});


// this is our delete method
// this method removes existing data in our database
router.delete('/deleteData', (req, res) => {
  const { id } = req.body;
  Data.findByIdAndRemove(id, (err) => {
    if (err) return res.json({ success: false, error: err});
    return res.json({ success: true });
  });
});


const startUsers = [
  {
    name: 'Kiefer',
    isAdmin: false,
    currentRewards: 0,
  },
  {
    name: 'Hugo',
    isAdmin: false,
    currentRewards: 0,
  },
  {
    name: 'Brody',
    isAdmin: false,
    currentRewards: 0,
  },
  {
    name: 'Dad',
    isAdmin: true,
    currentRewards: 0,
  },
  {
    name: 'Mom',
    isAdmin: true,
    currentRewards: 0,
  }
]

router.get('/initializeUsers', (req,res) => {
  startUsers.map((item, index) => {
    let newUser = new Users()
    newUser.name = item.name
    newUser.isAdmin = item.isAdmin
    newUser.currentRewards = item.currentRewards
    newUser.save((err) => {
      if (err) console.log("error saving the user" + err)      
    })
  })
  return res.json({ success: true })

})

// this is our create methid
// this method adds new data in our database
router.post('/addChore', (req, res) => {
  let chore = new Chores();

  const { name, reward, description, users, repeatDelay } = req.body;

  chore.choreName = name
  chore.reward = reward
  chore.description = description
  chore.validFor = users
  chore.beingDoneBy = ''
  chore.lastEndTime = 0
  chore.repeatDelay = repeatDelay

  chore.save((err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use('/', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));