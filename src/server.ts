import express, { Request, Response } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
const crypto = require("crypto");

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

const app = express();
const PORT = 5001;

app.use(express.json());

// Enable CORS for all routes
app.use(cors());

const localURL = "mongodb://localhost:27017/auth-demo";

// const remoteURL = 'mongodb+srv://hayksargsyan2015:4ox0Z4lJZ6NMNGHh@cluster1.aakjuwi.mongodb.net/?retryWrites=true&w=majority';
const remoteURL = 'mongodb+srv://hayksargsyan2015:4ox0Z4lJZ6NMNGHh@cluster1.aakjuwi.mongodb.net/auth-demo';


mongoose.connect(remoteURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'tazuc',
  // pluralization: false,
} as ConnectOptions);

const userSchema = new mongoose.Schema({
  id: String,
  username: String,
  password: String,
},{ collection: 'userner' });

const User = mongoose.model("User", userSchema);

app.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = Date.now();
    const user = new User({ id: userId, username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ username }, generateSecretKey(), {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findOneAndDelete({ id: userId });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
