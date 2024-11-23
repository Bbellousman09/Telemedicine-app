require('dotenv').config(); // Load environment variables

const express = require('express');  
const bodyParser = require('body-parser');  
const bcrypt = require('bcrypt');  
const Sequelize = require('sequelize'); // Import Sequelize

// Load environment variables from .env file
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS; // Corrected to DB_PASS
const dbName = process.env.DB_NAME;

// Initialize Sequelize
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: 'mysql'
});

const app = express();  
const PORT = process.env.PORT || 3000;  

// Middleware  
app.use(bodyParser.urlencoded({ extended: true }));  
app.use(bodyParser.json()); // Ensure JSON body parsing
app.use(express.static('public'));  

// Define User model
const User = sequelize.define('User', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Sync the database and User model
sequelize.sync()
    .then(() => console.log('Database synced'))
    .catch((err) => console.error('Unable to sync database:', err));

// User registration endpoint  
app.post('/register', async (req, res) => {  
    const { username, email, password } = req.body;  
    console.log('Received registration data:', req.body); // Log received data

    try {  
        // Ensure the password is provided
        if (!password) {
            return res.status(400).send('Password is required');
        }

        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
        const newUser = await User.create({  
            username,  
            email,
            password: hashedPassword,  
        });  
        res.status(201).json({ message: 'User registered successfully!', redirect: '/login.html' });  
    } catch (error) {  
        console.error('Registration error:', error);  
        res.status(500).send('Internal Server Error');  
    }  
});


// User login endpoint  
app.post('/login', async (req, res) => {  
    const { username, password } = req.body;  

    try {  
        const user = await User.findOne({ where: { username } });  
        if (!user) {  
            return res.status(401).send('Invalid username or password.');  
        }  

        const isPasswordValid = await bcrypt.compare(password, user.password);  
        if (isPasswordValid) {  
            console.log('Login successful for user:', user.username); // Log the username
            res.status(200).json({ message: 'Login successful!', redirect: '/dashboard.html', username: user.username });  
        } else {  
            res.status(401).send('Invalid username or password.');  
        }  
    } catch (error) {  
        console.error('Login error:', error);  
        res.status(500).send('Internal Server Error');  
    }  
});




app.listen(PORT, () => {  
    console.log(`Server is running on http://localhost:${PORT}`);  
});
