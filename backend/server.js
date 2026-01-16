/*import express from "express";

const app = express();
app.get("/",(req,res)=>{
res.send("Server is ready");
});
app.listen(5000,()=>{
console.log("Server started at http://localhost:5000");
});
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
connectDB();

import userRoute from "./routes/userRoute.js";
//API Routes
app.use("/api",userRoute); 
app.get("/api/user",(req,res)=>{
    res.send(userRoute);
});

//display message on server side local host
app.get('/message', (req, res) => {
    res.json({message: 'Hello'})
})


import cors from "cors";
// Middleware
app.use(cors());
app.use(express.json());*/

// backend/server.js
// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { generateWelcomeEmail } from "./emailTemplate.js";

import cookieParser from "cookie-parser"; // ✔ parse cookies
import { connectDB } from "./config/db.js";

import userRoute from "./routes/userRoute.js";
import eventRoute from "./routes/eventRoute.js";
import tagRoute from "./routes/tagRoute.js";

dotenv.config();

const app = express();

// ✔ Required for cookie authentication between frontend & backend
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

console.log("JWT SECRET =", process.env.JWT_SECRET);











// ✔ JSON & cookies
app.use(express.json());
app.use(cookieParser());

// ✔ Health check
app.get("/", (req, res) => {
  res.send("Server is ready");
});

// ✔ API routes
app.use("/api", userRoute);
app.use("/api", eventRoute);
app.use("/api", tagRoute);

// ✔ Connect DB
connectDB();

// ✔ Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});


app.post('/VolunteerSignUp', (req, res) => {
    UserModel.create(req.body)
    .then(Users => res.json(Users))
    .catch(err => res.json(err))
});


//UNTESTED login verification - add frontend post request
app.post("/Login", async (req, res) => {

    //change to UserModel.login(req.body) after making separate function in userController?
    const {username, password} = req.body; //do i need to say hash instead of password or will this work?
    const user = await UserModel.findOne({username: username});
    if(!user){
        return res.status(401).json({message: "User not found"});
    }

    const isValid = await bcrypt.compare(password, user.hash);
    if (!isValid) {
        res.send("wrong password")
        return;
    }
    res.status(200).json({ message: 'Login successful' });
    console.log('Login successful');
});

//nodemailer api
const transporter = nodemailer.createTransport({
    host: process.env.GMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

const mailOptions = {
    from: process.env.GMAIL_USER,
    to: 'r.w.singrin@gmail.com', //send to this email address
    subject: 'Node.js mail',
    text: 'Welcome to iVolunteer! Your account has been registered.' //update to reference actual user name
};

/*
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('send mail error', error);
    }
    else {
        console.log('Email sent: ', info.response);
    }
});*/ //sends one time test email upon server start

// endpoint for nodemailer
app.post('/send-email', async (req, res) => {
    const { email, username } = req.body;
    
    const htmlTemplate = generateWelcomeEmail(username, email);
    
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Welcome to iVolunteer!',
        html: htmlTemplate
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully', info });
    } catch (error) {
        console.error('Email send error:', error);
        res.status(500).json({ message: 'Failed to send email', error });
    }
});
