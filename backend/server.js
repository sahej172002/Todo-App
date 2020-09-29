const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const db = require("./todo.model.js");
const PORT = 4000;
const todoRoutes = express.Router();

app.use(cors());
app.use(bodyParser.json());

todoRoutes.route('/').get(function(req, res) {
    var sql = "select * from todo";
    var params = [];
    db.all(sql, params, (err, todos) => {
        if (err) {
            console.log(err);
            return;
        } else {
            res.json(todos);
        }
      });
});

todoRoutes.route('/:id').get(function(req, res) {
    var sql = "select * from todo where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, todo) => {
        if (err) {
          console.log(err);
          return;
        } else {
            res.json(todo);
        }
    });
});

todoRoutes.route('/add').post(function(req, res) {
    var data = {
        todo_description: req.body.todo_description,
        todo_responsible: req.body.todo_responsible,
        todo_priority : req.body.todo_priority,
        todo_completed : req.body.todo_completed,
    }
    var sql ='INSERT INTO todo (todo_description, todo_responsible, todo_priority, todo_completed) VALUES (?,?,?,?)'
    var params =[data.todo_description, data.todo_responsible, data.todo_priority, data.todo_completed]
    db.run(sql, params, function (err, result) {
        if (err){
            console.log(err);
            res.status(400).send('adding new todo failed');
            return;
        } else {
            res.status(200).json({'todo': 'todo added successfully'});
        }
    });
});

todoRoutes.route('/update/:id').post(function(req, res) {
    var data = {
        todo_description: req.body.todo_description,
        todo_responsible: req.body.todo_responsible,
        todo_priority : req.body.todo_priority,
        todo_completed : req.body.todo_completed
    }
    var sql = `UPDATE todo SET 
        todo_description = COALESCE(?,todo_description), 
        todo_responsible = COALESCE(?,todo_responsible), 
        todo_priority = COALESCE(?,todo_priority),
        todo_completed = COALESCE(?,todo_completed)
        WHERE id = ?`;
    var params =[data.todo_description, data.todo_responsible, data.todo_priority, data.todo_completed, req.params.id];
    db.run(sql, params, function (err, result) {
            if (err){
                res.status(400).send("Update not possible");
                console.log(err);
                return;
            } else {
                res.json({message: "Todo updated!", "params": params})
            }
    });
});

app.use('/todos', todoRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});