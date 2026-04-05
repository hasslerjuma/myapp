// My Login App..
const express = require('express');
const session = require('express-session');
const app = express();

app.set('view engine','ejs');
app.set('views', './views');
app.use(express.static('public'));
const users = {};
const interns = [];

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: false
}));


app.get('/', (req, res) => {
    if (req.session.username) {
        res.render('dashboard',{name: req.session.username, interns: interns});
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

app.get('/interns/add', (req, res) => {
    if (req.session.username) {
        res.render('add-intern', { error: null });
    } else {
        res.redirect('/login');
    }
});

app.post('/interns/add', (req, res) => {
    if (req.session.username) {
        const { name, phone, skill, progress } = req.body;

        if (!name || !phone || !skill) {
            res.render('add-intern', { error: 'Please fill in all fields' });
        } else {
            interns.push({
                id: interns.length + 1,
                name: name,
                phone: phone,
                skill: skill,
                progress: progress
            });
            res.redirect('/');
        }
    } else {
        res.redirect('/login');
    }
});

app.get('/interns/delete/:id', (req, res) => {
    if (req.session.username) {
        const id = parseInt(req.params.id);
        const index = interns.findIndex(intern => intern.id === id);
        if (index !== -1) {
            interns.splice(index, 1);
        }
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

app.get('/interns/edit/:id', (req, res) => {
    if (req.session.username) {
        const id = parseInt(req.params.id);
        const intern = interns.find(i => i.id === id);
        if (intern) {
            res.render('edit-intern', { intern: intern });
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/login');
    }
});

app.post('/interns/edit/:id', (req, res) => {
    if (req.session.username) {
        const id = parseInt(req.params.id);
        const intern = interns.find(i => i.id === id);
        if (intern) {
            intern.name = req.body.name;
            intern.phone = req.body.phone;
            intern.skill = req.body.skill;
            intern.progress = req.body.progress;
        }
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
