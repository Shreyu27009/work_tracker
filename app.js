
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const HomeRouter = require('./routes/timesheet');
const usersRouter = require('./routes/users');
const projectRouter = require("./routes/projects");
const taskRouter = require("./routes/tasks")
const connection = require("./connection");
const app = express();
connection()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', usersRouter);
app.use('/home', HomeRouter);
app.use('/projects', projectRouter);
app.use("/tasks", taskRouter);



app.listen(8080, () => {
    console.log("server is listening on the port 8080")
})

module.exports = app;
