const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = require('./Schema/user');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.DB_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const User = mongoose.model('User', UserSchema);
        const user = new User({ username: name, email, password: hashedPassword });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
});

const User = mongoose.model('User', UserSchema);

app.listen(PORT, () => {
    console.log(`Application started at port ${PORT}`);
});
