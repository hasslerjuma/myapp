// My Login App
const express = require('express');
const session = require('express-session');
const app = express();

app.set('view engine','ejs');
app.set('views', './views');
app.use(express.static('public'));
const users = {};

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: false
}));


app.get('/', (req, res) => {
    if (req.session.username) {
        res.render('home',{name: req.session.username});
    } else {
        res.redirect('/login');
    }
  
});

app.get('/about', (req, res) => {
  res.send('This is the about page.');
});

app.get('/login', (req, res) => {
  res.render('login', {error: null});
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (users[username] && users[username] === password) {
        req.session.username = username;
        res.redirect('/');
    } else {
        res.render('login', {error: 'Invalid username or password.'});
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/register', (req, res) => {
    res.render('register', {error: null});
});

app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (users[username]) {
        res.render('register', {error: 'Username already exists.'});
    } else {
        users[username] = password;
        res.redirect('/login');
    }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
