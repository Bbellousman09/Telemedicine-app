const express = require('express');  
const bodyParser = require('body-parser');  

const app = express();  
const PORT = process.env.PORT || 3000;  

// Middleware to parse incoming form data  
app.use(bodyParser.urlencoded({ extended: true }));  

// Serve static files (like your login.html)  
app.use(express.static('public'));  

app.post('/login', (req, res) => {  
    const username = req.body.username;  
    const password = req.body.password;  

    // Replace this part with your authentication logic  
    if (username === 'user' && password === 'pass') { // Example check  
        res.send('Login successful!');  
    } else {  
        res.send('Invalid username or password.');  
    }  
});  

app.listen(PORT, () => {  
    console.log(`Server is running on http://localhost:${PORT}`);  
});
