const sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "todo.sqlite"

let Todo = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log("Connected to the SQLite database.");
        Todo.run(`CREATE TABLE IF NOT EXISTS todo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            todo_description text,
            todo_responsible text,
            todo_priority text, 
            todo_completed boolean
            )`,
        (err) => {
            if (err) {
                // Table already created
                console.log("if statement err")
                //console.log(err);
            }else{
                // Table just created, creating some rows
                //console.log("I am here");
            }
        });  
    }
});

module.exports = Todo;