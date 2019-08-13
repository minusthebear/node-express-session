const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const users = [
    { id: 1, name: 'Alex', email: 'alex@gmail.com', secret: '12345'},
    { id: 2, name: 'Bob', email: 'bob@gmail.com', secret: '67890'},
    { id: 3, name: 'Dan', email: 'dan@gmail.com', secret: 'qwert'}
]

app.use(session({
    name: 'my-sesh',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure:false,
        sameSite:true,
        maxAge: 1000 * 60 * 5
    }
}));

const redirectLogin = (req, res, next) => {
    console.log('req.session', req.session);

    if (!req.session.loginWithId) {
        req.session.loginWithId = 0;
    }
    if (!req.session.userId) {
        res.redirect('/login')
    } else {
        req.session.loginWithId += 1;
        next();
    }
}

const redirectHome = (req, res, next) => {
    console.log('req.session', req.session);

    if (!req.session.loginWithoutId) {
        req.session.loginWithoutId = 0;
    }
    if (req.session.userId) {
        res.redirect('/home')
    } else {
        req.session.loginWithoutId += 1;
        next();
    }
}

app.get('/', (req, res) => {
    const { userId } = req.session;
    console.log(req.session);
    res.send(`<h1>Welcome!</h1>
                ${userId ? `<a href="/home">Home</a>
                <form method="post" action="/logout">
                    <button>Logout</button>
                </form>` : `<a href="/login">Login</a>
                <a href="/register">Register</a>`
                }
               
    `)
})

app.get('/home', redirectLogin, (req, res) => {
    res.send(`
        <h1>Home</h1>
        <a href="/">Main</a>
        <ul>
            <li>Name: </li>
            <li>Email: </li>
</ul>
    `)
})

app.get('/login', redirectHome, (req, res) => {
    res.send(`<h1>Login!</h1>
                <form method="post" action="/login">
                    <input type="email" name="email" placeholder="email" required />
                    <input type="password" name="password" placeholder="password" required />
                    <input type="submit" />
                </form>
                <a href="/register">Register</a>
    `)
})

app.get('/register', redirectHome, (req, res) => {
    res.send(`<h1>Register!</h1>
                <form method="post" action="/register">
                    <input name="name" placeholder="name" required />
                    <input type="email" name="email" placeholder="email" required />
                    <input type="password" name="password" placeholder="password" required />
                    <input type="submit" />
                </form>
                <a href="/login">Register</a>
    `)
})

app.post('/login', redirectHome, (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    if (email && password) {
        const user = users.find(user => user.email === email && user.secret === password);

        console.log(user);

        if (user) {
            req.session.userId = user.id;
            return res.redirect('/home');
        }
    }

    res.redirect('/login');
})

app.post('/register', redirectHome, (req, res) => {
    const { name, email, password } = req.body;

    if (name && email && password) {
        const exists = users.some(user => user.email === email);

        if (!exists) {
            const user = {
                id: users.length + 1,
                name,
                email,
                password
            }

            users.push(user);

            req.session.userId = user.id;

            return res.redirect('/home');
        }
    }

    res.redirect('/login');
})

app.post('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/home');
        }
        res.clearCookie('my-sesh');
        res.redirect('/login');
    })
})


app.listen(PORT, () => { console.log("PORT: ", PORT)})