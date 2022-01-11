require('./models/User');
require('./models/Track');
const express = require ('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const requireAuth = require('./middlewares/requireAuth')

const app = express();

app.use(bodyParser.json()); //To parse the Json information
app.use(authRoutes);
app.use(trackRoutes);

const mongoUri = 'mongodb+srv://thirdwayv:thirdwayv12345@cluster0.983wp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(mongoUri,{
    //Used to connect to Mongodb
    useNewUrlParser: true
});

mongoose.connection.on('connected', () => {
    //Used to handle errors after initial connection was established
    console.log('Connected to mongodb instance')
});

mongoose.connection.on('error',(err) => {
    //Check for errors upon connection to the DB
    console.error('Error connecting to mongodb instance', err)
});

app.get('/', requireAuth, (req,res) => {
    //Check for valid JWT
    res.send(`Email: ${req.user.email}`);
});

app.listen(3000,() => {
    //run process on port 3000
    console.log("Port 3000 Test");
});