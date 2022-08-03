const bcrypt = require('bcrypt');
const users = require('../users/users');
const express = require("express");
const router = express.Router();

const saltrounds = 16;

//Use this function to create a hashed password to assign to a user in your database. Since we are not using a database here we are putting this hashed password in our users.js file.
// async function main(){ 
//   const plainpassword = '********* input whatever your text password may be **********'; 
//   const hash = await bcrypt.hash(plainpassword, saltrounds); 
//   console.log(hash); 
// }

// main(); 


router.get('/', function (req, res) {
  console.log(req.session.id); //logging the session id 
  if (req.session.user) {
    res.redirect('/private')
  } else {
    res.render('login');
  }
});


//page for the user to fill in the login form with a username and password
router.post('/login', async (req, res) => {

  let loginFailed = false;

  //login fails if the user does not input a username or password
  if (!req.body.username && !req.body.password) {
    loginFailed = true;
  } else {
    for (let i = 0; i <= users.length - 1; i++) {
      //if username is not equal to a username in the users file, the login fails
      if (users[i].username != req.body.username) {
        loginFailed = true;
      } else {
        let loginSuccess = await bcrypt.compare(req.body.password, users[i].hashedPassword);

        // if the login is successfull, the data is retreived from the users file 
        if (loginSuccess) {
          req.session.user = {
            'username': users[i].username,
            'password': users[i].hashedPassword,
            '_id': users[i]._id,
            'firstName': users[i].firstName,
            'lastName': users[i].lastName,
            'profession': users[i].profession,
            'bio': users[i].bio
          };
          res.redirect('/private');
        }
        else {
          loginFailed = true;
        }
      }
    }
  }
  if (loginFailed) {
    res.status(401).render('login', { errorMessage: "You have entered an incorrect username and/or password." });
  }
});


//function checking if the user is authenticated
function userAuth(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.status(403).render('incorrectUP');
  }
}


//route takes us to the user's private information page if the user provides the correct credentials
router.get("/private", userAuth, (req, res) => {
  res.render('userInfo', req.session.user);
});


//brings the user to a logout page and clears the cookie 
router.get("/logout", async (req, res) => {
  // deleting the authcookie
  res.clearCookie("AuthCookie"); 
  req.session.destroy();
  res.render('logout');
});

module.exports = router;