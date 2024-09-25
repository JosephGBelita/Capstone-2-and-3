const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require('passport');
const session = require('express-session');
require('./passport')
//s43
const userRoutes = require("./routes/user")
const productRoutes = require("./routes/product")
const cartRoutes =require("./routes/cart")
const orderRoutes = require("./routes/order")


require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));



const corsOptions = {
  
    origin: ['http://localhost:3000'],
    credentials: true, 
    optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));
app.use(session({
    secret: process.env.clientSecret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/users", userRoutes);
app.use("/products",productRoutes);
app.use("/cart",cartRoutes)
app.use("/orders",orderRoutes)


if(require.main === module){
    app.listen(process.env.PORT || 3000, () => {
        console.log(`API is now online on port ${ process.env.PORT || 3000}`)
    });
}

module.exports = {app, mongoose};