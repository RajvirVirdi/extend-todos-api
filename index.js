const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());


// Question 1: Add a "Priority" Field to the To-Do API
// Sample data
let todos = [
  { id: 1, task: "Learn Node.js", completed: false, priority: "medium" },
  { id: 2, task: "Build a REST API", completed: false, priority: "medium" }
];

// added parameter priority to the data, default medium

// GET /todos - Retrieve all to-do items
//app.get('/todos', (req, res) => {
//  res.json(todos);
//});
// commented out as per request

/* 
Q.3"
GET /todos - Retrieve all to-do items or filter by completed status.
after completing this part, you need to comment out the GET end point 
already implemented here to test this new GET endpoint! 
*/
app.get('/todos', (req, res) => {
    let {completed} = req.query
    if (completed === 'true' || completed === 'false') { // triple equal is strict equality, both true and false is there cuz that is expected
        let doneCompleted = completed === 'true'; // string input turned into boolean
        let filteredByCompleted = todos.filter(item => item.completed === doneCompleted) // completed field matches, then it goes here
        res.json(filteredByCompleted); // return completed list
    }
    else {
    res.json(todos); // this is from method before, default behaviour of just returning
    }
  });


// POST /todos - Add a new to-do item
app.post('/todos', (req, res) => {
  const newTodo = {
    id: todos.length + 1,
    task: req.body.task,
    completed: false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /todos/:id - Update an existing to-do item
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).send("To-Do item not found");
  }
  todo.task = req.body.task || todo.task;
  todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;
  res.json(todo);
});

/*
Question 2: Implement a "Complete All" Endpoint
example usage: 
curl -X PUT http://localhost:3000/todos/complete-all
*/

app.put('/todos/completeall', (req,res) => {
    if (!todos) {
        return res.status(404).send("no items found"); // in case there is nothing in the list, let it be known
    }
    todos.forEach(item => {item.completed=true}) //set everything to completed state
    res.status(200).send(); // tell client all is ok
});


// DELETE /todos/:id - Delete a to-do item
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).send("To-Do item not found");
  }
  todos.splice(index, 1);
  res.status(204).send();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});