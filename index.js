const express = require('express');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const userRoute = require('./src/routes/user');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));


const port = process.env.PORT || 3000; // Make sure to define the port
const mongoDb = process.env.MONGO_URI;

// dbConnection().then(() => {
//     app.listen(port, () => {
//         console.log(`Server running on port number ${port} and DB connected`);
//     });
// });

mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on('connected', () => {
    console.log('Db Connected');
})
db.on('error', (error) => {
    console.log(error);
})


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/user', userRoute);
app.use(bodyParser.json());
app.use(express.json());



app.get('/', (req, res) => {
    res.render('login');
    console.log('Working');
});


app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.listen(port, () => {
    console.log(`Server running on port number ${port} `);
});