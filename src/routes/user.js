const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const { storage } = require('../cloudanary/config');
const upload = multer({ storage });

router.use(express.json());
router.use(cookieParser(process.env.JWT_SECRET));

// Route for user signup
router.post('/signup', upload.single('image'), async (req, res) => {
    try {
        const { name, phoneNo, email, password } = req.body;

        if (!name || !email || !phoneNo || !password) {
            return res.status(401).send("Please fill correctly");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('You are already registered');
        }

        const hashPassword = await bcrypt.hash(password, 10);
        // Check if file information is available
        if (!req.file || !req.file.path || !req.file.filename) {
            return res.status(400).send("File information not available");
        }

        const newUser = new User({
            name,
            phoneNo,
            email,
            profilePic: {
                url: req.file.path,  // Use req.file.path instead of req.file.url
                filename: req.file.filename
            },
            password: hashPassword,
        });

        console.log(newUser.profilePic);
        await newUser.save();

        const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        const expires = new Date();
        expires.setDate(expires.getDate() + 1);

        // Set the token as a cookie
        res.cookie('token', token, { httpOnly: true, path: '/', domain: 'localhost', signed: true, expires });

        return res.status(200).send('Successfully registered');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

// Route for user login
router.post('/login', async (req, res) => {
    try {
        const { email, password, phoneNo } = req.body;

        if (!email && !phoneNo) {
            return res.status(401).send('Please enter email or phonenumber');
        }

        let user;
        if (email) {
            user = await User.findOne({ email });
        } else if (phoneNo) {
            user = await User.findOne({ phoneNo });
        }

        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        const isMatchedpass = await bcrypt.compare(password, user.password);
        if (!isMatchedpass) {
            return res.status(401).send('Invalid credentials');
        }

        // Clear any existing token cookie
        res.clearCookie('token', { httpOnly: true, path: '/', domain: 'localhost', signed: true, expires: new Date(0) });

        // Generate a new token
        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const expires = new Date();
        expires.setDate(expires.getDate() + 1);

        // Set the new token as a cookie
        res.cookie('token', token, { httpOnly: true, path: '/', domain: 'localhost', signed: true, expires });

        return res.status(200).redirect('/home');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

// Route to get all users
router.get('/allUser', async (req, res) => {
    try {
        const allUser = await User.find();
        return res.status(200).send({ message: 'ok', user: allUser });
    } catch (error) {
        return res.status(400).send('Something went wrong');
    }
});

// Route to edit user details
router.patch('/edit/:userId', upload.single('image'), async (req, res) => {
    try {
        const { userId } = req.params;
        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(401).send('User not exists');
        }

        const { name, profilePic } = req.body;
        existingUser.name = name;
        existingUser.profilePic = profilePic;
        await existingUser.save();
        return res.status(200).send('User successfully updated');
    } catch (error) {
        return res.status(401).send('Something went wrong');
    }
});

// Route to get user details by ID
router.get('/userDetails/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(401).send('User not exists');
        }

        return res.status(200).send({ message: 'ok', user: existingUser });
    } catch (error) {
        return res.status(500).send('Server error');
    }
});

// Route to delete user by ID
router.delete('/delete/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(401).send('User not exists');
        }
        await existingUser.deleteOne();
        return res.status(200).send('User deleted');
    } catch (error) {
        return res.status(500).send('Server error');
    }
});

module.exports = router;
