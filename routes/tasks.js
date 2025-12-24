const express = require('express');
const router = express.Router();
const path = require("path")
const connection = require("../connection")
const { ObjectId } = require('mongodb');
const { error } = require('console');

router.get("/page", async (req, res) => {
    let filepath = path.resolve("__dirname", "..", "files", "tasks.html")
    if (filepath) {
        return res.status(200).sendFile(filepath)
    }
    return res.status(500).json({ "message": "internal server error" })
})

router.post("/save", async (req, res) => {
    let user = req.cookies._id;
    console.log(user)
    let { date, task, description } = req.body;
    if (!date || !task || !description) {
        return res.status(400).json({ "message": "all values are required" })
    }
    try {
        let db = await connection();
        console.log("connected successfully")
        const collection = db.collection("tasks");
        console.log("collection connected");
        let record = await collection.find({ "task": task });
        let tasks = []
        for await (const document of record) {
            console.log(document);
            tasks.push(document)
        }
        console.log(tasks)
        if (tasks.length > 0) {
            return res.status(400).json({ "message": "task already exists" })
        }
        let result = await collection.insertOne({ "task": task, "date": date, "description": description, "addedBy": user })
        console.log(result)
        if (result.acknowledged == true) {
            return res.status(201).json({ "message": "task added successfully" })
        }
        return res.status(400).json({ "message": "Task addition failed" })
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({ "message": "task addition failed" })
    }
})

//for getting all the tasks
router.get("/shows", async (req, res) => {
    try {
        let db = await connection();
        console.log("connected successfully")
        const collection = db.collection("tasks");
        console.log("collection connected");
        let tasks = []
        const result = collection.find({});
        for await (const document of result) {
            console.log(document);
            tasks.push(document)
        }
        return res.status(200).json(tasks)
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ "message": "something went wrong" })
    }
})

router.get("/show", async (req, res) => {
    let task = req.query.name;
    console.log(task)
    if (!task) {
        return res.status(400).json({ "message": "something went wrong" })
    }
    try {
        let db = await connection();
        const collection = db.collection("tasks");
        const result = await collection.find({ "task": task }).toArray();
        return res.status(200).json(result)
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ "message": "something went wrong" })
    }

})

//for updating the task
router.put("/update", async (req, res) => {
    let user = req.cookies._id;
    console.log(user)
    let { oname, date, task, description } = req.body;
    if (!oname || !date || !task || !description) {
        return res.status(400).json({ "message": "all values are required" })
    }
    try {
        let db = await connection();
        console.log("connected successfully")
        const collection = db.collection("tasks");
        console.log("collection connected");
        //checking if the tasks already exists
        let record = await collection.find({ "task": task });
        let tasks = []
        for await (const document of record) {
            console.log(document);
            tasks.push(document)
        }
        console.log(tasks)
        if (tasks.length > 0) {
            return res.status(400).json({ "message": "task already exists" })
        }
        let result = await collection.updateOne({ "task": oname }, { $set: { "date": date, "task": task, "description": description, "updated_by": user } })
        if (result.acknowledged === true) {
            return res.status(200).json({ "message": "task updated sucessfully" })
        }
        else {
            return res.status(400).json({ "message": "task update failed" })
        }
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ "message": "something went wrong" })
    }

})

//for deleting the task
router.delete("/delete", async (req, res) => {
    let { task } = req.body;
    try {
        let db = await connection();
        console.log("connected successfully")
        const collection = db.collection("tasks");
        console.log("collection connected");
        const collections = db.collection("timesheets");
        console.log("collection connected");
        let record = await collections.find({ "task": task });
        let projects = []
        for await (const document of record) {
            console.log(document);
            projects.push(document)
        }
        console.log(projects)
        if (projects.length > 0) {
            return res.status(400).json({ "message": "do not delete the task" })
        }
        //deleting the previous task to map with the id
        let result = await collection.deleteOne({ "task": task })
        console.log(result)
        if (result.acknowledged === true) {
            return res.status(200).json({ "message": "task deleted sucessfully" })
        }
        else {
            return res.status(400).json({ "message": "task deletion failed" })
        }
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({ "message": "something went wrong" })
    }
})

module.exports = router;

