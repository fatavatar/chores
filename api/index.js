const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Chores = require('./chores');
const Users = require('./users')
const Log = require('./logs')
const Gmail = require('./creds')
const multer = require('multer')

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();
const fileupload = multer();

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
        Chores.findByIdAndUpdate(req.params.id, chore, async (err) => {
          if (err) return res.json({ success: false, error: err});
          let startLog = new Log()
          startLog.user = user
          startLog.chore = chore
          startLog.action = "start"
          await startLog.save()
          Chores.find((err,data) => {
            if (err) return res.json({ success: false, error: err});
            return res.json({success: true, chores: data})  
          })          
        })
      }
    })
  })
});


router.get('/redeem/:type/:user', (req, res) => {
  Users.findOne({name: req.params.user}, async (err, foundUser) => {
    if (err) return res.json({ success: false, error: err });
    if (foundUser.currentRewards >= 15) {
      foundUser.currentRewards -= 15
      await foundUser.save()
      const mailOptions = {
        from: 'chores@gmail.com', // sender address
        to: "trigger@applet.ifttt.com", // list of receivers
        subject: "#" + (req.params.type === "tv" ? "GAMES" : req.params.user.toUpperCase()),
      };
      Gmail.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
     return res.json({success:true})
    } else {
      return res.json({success: false, error: "Not enough time."})
    }
  })
})

router.get('/getTime/:user', (req, res) => {
  Users.findOne({name: req.params.user}, (err, foundUser) => {
    if (err) return res.json({ success: false, error: err });
    else return res.json({success: true, rewards: foundUser.currentRewards})
  })
})

// this is our update method
// this method overwrites existing data in our database
router.get('/stop/:id/:user', (req, res) => {
  stopChore(res, req.params.id, req.params.user, null)
})

router.post('/stop/:id/:user', fileupload.single('photo'), (req, res) => {
  const formData = req.file
  console.log("Stopping Chore " + req.params.id + " for user " + req.params.user)
  base64Data = Buffer.from(formData.buffer, 'binary').toString('base64')
  stopChore(res, req.params.id, req.params.user, base64Data)
})

function stopChore(res, id, user, photo) {
  console.log("photo = " + photo)
  
  Chores.findById(id, (err, chore) => {
    if (err) return res.json({ success: false, error: err });
    Users.findOne({name: user}, async (err, foundUser) => {
      if (err) return res.json({success: false, error: err});
      if (!chore.beingDoneBy || chore.beingDoneBy !== user) {
        Chores.find((err,data) => {
          if (err) return res.json({ success: false, error: err});
          return res.json({success: false, error: "Chore not owned by " + user, chores: data})  
        })
      } else {        
        foundUser.currentRewards += chore.reward
        await foundUser.save()
        chore.beingDoneBy = ""
        chore.lastEndTime = Date.now()
        await Chores.save()
        
        let stopLog = new Log()
        stopLog.user = foundUser
        stopLog.chore = chore
        stopLog.action = "stop"
        stopLog.photo = photo 
        await stopLog.save()
        // Send email:
        Users.find({isAdmin: true}, (err, admins) => {
          admins.map((item) => {
            const mailOptions = {
              attachments: {
                cid:"DonePhoto",
                encoding: "base64",
                content: photo,
                filename: false                    
              },
              from: 'chores@gmail.com', // sender address
              to: item.email, // list of receivers
              subject: chore.choreName + ' done by ' + user, // Subject line
              html: '<p>' + user + ' completed ' + chore.choreName + ' at ' + chore.lastEndTime + '<br /> <br /> <img alt="Done Photo" src="cid:DonePhoto"></p>'// plain text body
            };
            Gmail.sendMail(mailOptions, function (err, info) {
              if(err)
                console.log(err)
              else
                console.log(info);
            });
          })
        })

        Chores.find((err,data) => {
          if (err) return res.json({ success: false, error: err});
          return res.json({success: true, chores: data})  
        })        
      }
    })
  })
};


// this is our delete method
// this method removes existing data in our database
router.delete('/deleteData', (req, res) => {
  const { id } = req.body;
  Data.findByIdAndRemove(id, (err) => {
    if (err) return res.json({ success: false, error: err});
    return res.json({ success: true });
  });
});


router.post('/initializeUsers', (req,res) => {
  startUsers = req.body
  startUsers.map( async (item, index) => {
    let newUser = new Users()
    newUser.name = item.name
    newUser.isAdmin = item.isAdmin
    newUser.currentRewards = item.currentRewards
    newUser.email = item.email
    await newUser.save()
  })
  return res.json({ success: true })

})

// this is our create methid
// this method adds new data in our database
router.post('/addChore', async (req, res) => {
  let chore = new Chores();

  const { name, reward, description, users, repeatDelay } = req.body;

  chore.choreName = name
  chore.reward = reward
  chore.description = description
  chore.validFor = users
  chore.beingDoneBy = ''
  chore.lastEndTime = 0
  chore.repeatDelay = repeatDelay

  await chore.save()
  return res.json({ success: true });
  
});

// append /api for our http requests
app.use('/', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));