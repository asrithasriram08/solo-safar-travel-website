// Server-side code (Node.js + MongoDB)
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5051;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/traveldbr", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => {
  console.log("MongoDB connection successful");
});

// User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Goa Travel schema and model
const goaTravelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  days: { type: Number, required: true },
  travelDate: { type: Date, required: true },
});
const GoaTravel = mongoose.model("GoaTravel", goaTravelSchema);

// Sikkim Solo Travel schema and model
const sikkimTravelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  days: { type: Number, required: true },
  travelDate: { type: Date, required: true },
});
const SikkimTravel = mongoose.model("SikkimTravel", sikkimTravelSchema);

// Manali Travel schema and model
const manaliTravelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  days: { type: Number, required: true },
  travelDate: { type: Date, required: true },
});
const ManaliTravel = mongoose.model("ManaliTravel", manaliTravelSchema);

// Routes
// Serve Sign-In page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signintravel.html"));
});

// Serve Sign-Up page
app.get("/get", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signuptravel.html"));
});

// Handle Sign-Up
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already in use");
    }
    const newUser = new User({ username, email, password });
    await newUser.save();
    console.log("User registered:", newUser);
    res.status(200).send(
      `<h1>Registration successful!</h1><a href='/signintravel.html'>Sign In</a>`
    );
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error during registration.");
  }
});

// Handle Sign-In
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).send("Invalid email or password");
    }
    console.log("User signed in:", user);
    res.redirect("/homepage.html");
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).send("Error during sign-in.");
  }
});

// Serve Homepage
app.get("/homepage.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "homepage.html"));
});

// Handle saving Goa travel details
app.post("/save-goa-travel", async (req, res) => {
  const { name, age, days, travelDate } = req.body;
  try {
    const newTravelDetails = new GoaTravel({ name, age, days, travelDate });
    await newTravelDetails.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving travel details:", error);
    res.json({ success: false });
  }
});

// Handle viewing Goa travel details
app.get("/view-goa-travel", async (req, res) => {
  try {
    const travelDetails = await GoaTravel.find();
    res.json(travelDetails);
  } catch (error) {
    console.error("Error retrieving travel details:", error);
    res.status(500).json({ success: false });
  }
});

// Handle saving Sikkim travel details
app.post("/save-sikkim-travel", async (req, res) => {
  const { name, age, days, travelDate } = req.body;
  try {
    const newTravelDetails = new SikkimTravel({ name, age, days, travelDate });
    await newTravelDetails.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving Sikkim travel details:", error);
    res.json({ success: false });
  }
});

// Handle viewing Sikkim travel details
app.get("/view-sikkim-travel", async (req, res) => {
  try {
    const travelDetails = await SikkimTravel.find();
    res.json(travelDetails);
  } catch (error) {
    console.error("Error retrieving Sikkim travel details:", error);
    res.status(500).json({ success: false });
  }
});

// Handle saving Manali travel details
app.post("/save-manali-travel", async (req, res) => {
  const { name, age, days, travelDate } = req.body;
  try {
    const newTravelDetails = new ManaliTravel({ name, age, days, travelDate });
    await newTravelDetails.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving Manali travel details:", error);
    res.json({ success: false });
  }
});

// Handle viewing Manali travel details
app.get("/view-manali-travel", async (req, res) => {
  try {
    const travelDetails = await ManaliTravel.find();
    res.json(travelDetails);
  } catch (error) {
    console.error("Error retrieving Manali travel details:", error);
    res.status(500).json({ success: false });
  }
});

// Rann of Kutch Travel schema and model
const rannTravelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  days: { type: Number, required: true },
  travelDate: { type: Date, required: true },
});
const RannTravel = mongoose.model("RannTravel", rannTravelSchema);

// Handle saving Rann of Kutch travel details
app.post("/save-rann-travel", async (req, res) => {
  const { name, age, days, travelDate } = req.body;
  try {
    const newTravelDetails = new RannTravel({ name, age, days, travelDate });
    await newTravelDetails.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving Rann of Kutch travel details:", error);
    res.json({ success: false });
  }
});

// Handle viewing Rann of Kutch travel details
app.get("/view-rann-travel", async (req, res) => {
  try {
    const travelDetails = await RannTravel.find();
    res.json(travelDetails);
  } catch (error) {
    console.error("Error retrieving Rann of Kutch travel details:", error);
    res.status(500).json({ success: false });
  }
});

// Kerala Travel schema and model
const keralaTravelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  days: { type: Number, required: true },
  travelDate: { type: Date, required: true },
});
const KeralaTravel = mongoose.model("KeralaTravel", keralaTravelSchema);

// Handle saving Kerala travel details
app.post("/save-kerala-travel", async (req, res) => {
  const { name, age, days, travelDate } = req.body;
  try {
    const newTravelDetails = new KeralaTravel({ name, age, days, travelDate });
    await newTravelDetails.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving Kerala travel details:", error);
    res.json({ success: false });
  }
});

// Handle viewing Kerala travel details
app.get("/view-kerala-travel", async (req, res) => {
  try {
    const travelDetails = await KeralaTravel.find();
    res.json(travelDetails);
  } catch (error) {
    console.error("Error retrieving Kerala travel details:", error);
    res.status(500).json({ success: false });
  }
});

// Udaipur Travel schema and model
const udaipurTravelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  days: { type: Number, required: true },
  travelDate: { type: Date, required: true },
});
const UdaipurTravel = mongoose.model("UdaipurTravel", udaipurTravelSchema);

// Handle saving Udaipur travel details
app.post("/save-udaipur-travel", async (req, res) => {
  const { name, age, days, travelDate } = req.body;
  try {
    const newTravelDetails = new UdaipurTravel({ name, age, days, travelDate });
    await newTravelDetails.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving Udaipur travel details:", error);
    res.json({ success: false });
  }
});

// Handle viewing Udaipur travel details
app.get("/view-udaipur-travel", async (req, res) => {
  try {
    const travelDetails = await UdaipurTravel.find();
    res.json(travelDetails);
  } catch (error) {
    console.error("Error retrieving Udaipur travel details:", error);
    res.status(500).json({ success: false });
  }
});

// Nagaland Travel schema and model
const nagalandTravelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  days: { type: Number, required: true },
  travelDate: { type: Date, required: true },
});
const NagalandTravel = mongoose.model("NagalandTravel", nagalandTravelSchema);

// Handle saving Nagaland travel details
app.post("/save-nagaland-travel", async (req, res) => {
  const { name, age, days, travelDate } = req.body;
  try {
    const newTravelDetails = new NagalandTravel({ name, age, days, travelDate });
    await newTravelDetails.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving Nagaland travel details:", error);
    res.json({ success: false });
  }
});

// Handle viewing Nagaland travel details
app.get("/view-nagaland-travel", async (req, res) => {
  try {
    const travelDetails = await NagalandTravel.find();
    res.json(travelDetails);
  } catch (error) {
    console.error("Error retrieving Nagaland travel details:", error);
    res.status(500).json({ success: false });
  }
});

// Leh Travel schema and model
const lehLadakhTravelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  days: { type: Number, required: true },
  travelDate: { type: Date, required: true },
});

const LehLadakhTravel = mongoose.model("LehLadakhTravel", lehLadakhTravelSchema);

// Handle saving Leh travel details
app.post("/save-leh-ladakh-travel", async (req, res) => {
  const { name, age, days, travelDate } = req.body;
  try {
    const newTravelDetails = new LehLadakhTravel({ name, age, days, travelDate });
    await newTravelDetails.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving Leh Ladakh travel details:", error);
    res.json({ success: false });
  }
});

// Handle viewing Leh travel details
app.get("/view-leh-travel", async (req, res) => {
  try {
    const travelDetails = await LehTravel.find();
    res.json(travelDetails);
  } catch (error) {
    console.error("Error retrieving Leh travel details:", error);
    res.status(500).json({ success: false });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
