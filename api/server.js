// Remeber to do "npm start" in both the api and client directory. The api one starts the database on port 3001 and the client one starts the actual react application

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> console.log("Connected to DB"), ()=> console.log("Could not connect to DB!") ).catch(console.error);

const Todo = require("./models/Todo");

app.get("/todos", async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
    // So if we make a request to localhost:3001/todos, it will find the todos via line 20 Todo.find() using our model Todo defined in the file Todo.js which connects to our mongoose database, gets the todos we need and passes them back to this file as res
})

app.post("/todo/new", (req, res) => {
        // Below is going to create a new todo collection inside our MongoDB database when we go to localhost/todo/new URL
    const todo = new Todo({
        // Text is the only required field in our databae. req.body means anything we pass through in our request, like the body of the request, we will get in here
        text: req.body.text
    });

    todo.save(); // Saves to our collection in the database
    res.json(todo); // Will pass our new todo back so we can add it to our list
    
})

app.delete("/todo/delete/:id", async (req, res) => {
    const result = await Todo.findByIdAndDelete(req.params.id); // findByIdAndDelete is part of Mongoose
    res.json(result);
})

app.delete("/todo/delete_complete", async (req, res) => {
    const result = await Todo.deleteMany({complete: true});
    res.json(result);
})

app.get("/todo/complete/:id", async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    todo.complete = !todo.complete;
    todo.save();
    res.json(todo);
})

app.listen(3001, ()=> console.log("Sever started on port 3001"));

