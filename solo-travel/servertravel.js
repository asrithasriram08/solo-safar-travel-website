// Server-side code (Node.js + MongoDB)

require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5051;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection (FIXED)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("MongoDB connection successful");
});

// ================= MODELS =================

// User
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Generic travel schema (reused)
const travelSchema = new mongoose.Schema({
  name: String,
  age: Number,
  days: Number,
  travelDate: Date,
});

// Models
const GoaTravel = mongoose.model("GoaTravel", travelSchema);
const SikkimTravel = mongoose.model("SikkimTravel", travelSchema);
const ManaliTravel = mongoose.model("ManaliTravel", travelSchema);
const RannTravel = mongoose.model("RannTravel", travelSchema);
const KeralaTravel = mongoose.model("KeralaTravel", travelSchema);
const UdaipurTravel = mongoose.model("UdaipurTravel", travelSchema);
const NagalandTravel = mongoose.model("NagalandTravel", travelSchema);
const LehLadakhTravel = mongoose.model("LehLadakhTravel", travelSchema);

// ================= ROUTES =================

// Pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signintravel.html"));
});

app.get("/get", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signuptravel.html"));
});

app.get("/homepage.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "homepage.html"));
});

// ================= AUTH =================

// Signup
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

    res.send(`<h1>Registration successful!</h1><a href='/signintravel.html'>Sign In</a>`);
  } catch (err) {
    res.status(500).send("Error during registration");
  }
});

// Signin
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).send("Invalid credentials");
    }

    res.redirect("/homepage.html");
  } catch (err) {
    res.status(500).send("Error during login");
  }
});

// ================= TRAVEL ROUTES =================

// Helper function (clean code)
const createRoutes = (model, name) => {
  app.post(`/save-${name}`, async (req, res) => {
    try {
      const data = new model(req.body);
      await data.save();
      res.json({ success: true });
    } catch {
      res.json({ success: false });
    }
  });

  app.get(`/view-${name}`, async (req, res) => {
    try {
      const data = await model.find();
      res.json(data);
    } catch {
      res.status(500).json({ success: false });
    }
  });
};

// Create all routes
createRoutes(GoaTravel, "goa-travel");
createRoutes(SikkimTravel, "sikkim-travel");
createRoutes(ManaliTravel, "manali-travel");
createRoutes(RannTravel, "rann-travel");
createRoutes(KeralaTravel, "kerala-travel");
createRoutes(UdaipurTravel, "udaipur-travel");
createRoutes(NagalandTravel, "nagaland-travel");

// FIXED Leh route
app.post("/save-leh-ladakh-travel", async (req, res) => {
  try {
    const data = new LehLadakhTravel(req.body);
    await data.save();
    res.json({ success: true });
  } catch {
    res.json({ success: false });
  }
});

app.get("/view-leh-travel", async (req, res) => {
  try {
    const data = await LehLadakhTravel.find(); // ✅ FIXED
    res.json(data);
  } catch {
    res.status(500).json({ success: false });
  }
});

// ================= START SERVER =================
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});