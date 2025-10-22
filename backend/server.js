const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");



// backend -> mongod
// backend -> nodemon server.js

// express app
const app = express();
app.use(cors());
app.use(express.json());

//server frontend files
app.use(express.static(path.join(__dirname, "../")));

// connect mongodb
mongoose.connect("mongodb://localhost:27017/filetransfer", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// schema for user
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

// model 
const User = mongoose.model("User", userSchema);

// schema
const historySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: String,
    timestamp: { type: Date, default: Date.now }
});
const History = mongoose.model("History", historySchema);

// middelware 
const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).send("Access Denied");
    } try {
        const verified = jwt.verify(token, "secretkey");
        req.user = verified;
        next();

    }
    catch (err) {
        res.status(400).send("Invalid Token");
    }
};

// routes

// signup route
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({success: false, message:"User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.json({success: true, message:"User Signed Up Successfully", redirect: "\login.html"});

});

// login route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(400).send("user not found");
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).send("Incorrect password");
    }
    // token generation 

    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1h" });
    res.json({ message: "Login Successfully", token });
});


// save history route 
app.post("/history", authMiddleware, async (req, res) => {
    const { action } = req.body;
    const newHistory = new History({ userId: req.user.id, action });
    await newHistory.save();
    res.send("History saved successfully");
});

// get history route
app.get("/history", authMiddleware, async (req, res) => {
    const history = await History.find({ userId: req.user.id });
    res.json(history);
});

// fallback route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
}); 

// start srever
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});


