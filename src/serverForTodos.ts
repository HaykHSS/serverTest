import express, { Response, Request } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import mongoose, { ConnectOptions } from "mongoose";

const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());

const remoteURL =
  "mongodb+srv://hayksargsyan2015:4ox0Z4lJZ6NMNGHh@cluster1.aakjuwi.mongodb.net/";

mongoose.connect(remoteURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "todos",
  // pluralization: false,
} as ConnectOptions);

const todoSchema = new mongoose.Schema(
  {
    text: String,
    id: String,
  },
  { collection: "todos" }
);

const Todo = mongoose.model("Todo", todoSchema);

app.post("/todo", async (req: Request, res: Response) => {
  try {
    const todo = new Todo({ id: req.body.id, text: req.body.text });
    await todo.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/todos", async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/todo/:id", async (req: Request, res: Response) => {
  try {
    const deletedTodo = await Todo.findOneAndDelete({ id: req.params.id });
    if (!deletedTodo) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/todo", async (req: Request, res: Response) => {
  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { id: req.body.id },
      { $set: { text: req.body.text } },
      { new: true }
    );
    if(!updatedTodo){
        res.status(404).json({message:'todo not found'})
    }
    res.status(200).json(updatedTodo)
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port:${PORT}`);
});
