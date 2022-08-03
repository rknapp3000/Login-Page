const session = require('express-session');
const express = require("express");
const app = express();
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
app.use('/public', express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  name: 'AuthCookie',
  secret: 'this is a secret',
  resave: false,
  saveUninitialized: true
}));

app.engine('handlebars', exphbs({ defaultLayout: "main" }));

app.set('view engine', 'handlebars');

app.use('*', (req, res, next) => {
  console.log("[%s]:   %s   %s   ***** %s *****", new Date().toUTCString(), req.method, req.originalUrl,
    `${req.session.user ? "User Authenticated" : "User Not Authenticated"}`);
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server! Your routes will be running on http://localhost:3000");
});