const express = require('express');
const session = require('express-session');

const { PORT = 3000 } = process.env;

const app = express();

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

app.get('/', () => {

})

app.get('/home', () => {

})

app.get('/login', () => {

})

app.get('/register', () => {

})

app.post('/login', () => {

})

app.post('/register', () => {

})

app.post('/logout', () => {

})


app.listen(PORT, () => { console.log("PORT: ", PORT)})