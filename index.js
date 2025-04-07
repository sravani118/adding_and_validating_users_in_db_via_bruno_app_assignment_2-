require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const app = express();
app.use(express.json()); 

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected sucessfully'))
.catch(err => console.error('MongoDB connection failed', err));

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(404).json({ error: 'User already exists' });
        }

        const hashedPasword = await bcrypt.hash(password, 10);

        const newUser = new User({email, password: hashedPasword})
        await newUser.save();

        res.status(200).json({ message: 'Login successful', user:newUser });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});