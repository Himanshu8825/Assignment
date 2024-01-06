const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();




// Import routes
const userRoute = require('./src/routes/user');
const fileUpload = require('express-fileupload');

// Initialize express app
const app = express();

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
// app.use(fileUpload({
//     useTempFiles: true
// }))

// Define port and MongoDB URI
const port = process.env.PORT || 3000;
const mongoDb = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoDb);
const db = mongoose.connection;

// Event listeners for MongoDB connection status
db.on('connected', () => {
    console.log('Db Connected');
});

db.on('error', (error) => {
    console.log(error);
});

// Set up view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use user routes
app.use('/user', userRoute);

// Middleware for JSON parsing
app.use(bodyParser.json());
app.use(express.json());

// Render login page for the root route
app.get('/', (req, res) => {
    res.render('login');
    console.log('Working');
});

// Render signup page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Render login page
app.get('/login', (req, res) => {
    res.render('login');
});

// Render home page
app.get('/home', (req, res) => {
    res.render('home');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port number ${port}`);
});
