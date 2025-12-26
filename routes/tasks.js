const express = require('express');
const router = express.Router();
const path = require("path")
const connection = require("../connection")
const { ObjectId } = require('mongodb');
const { error } = require('console');
const { checkUser } = require("../middlwares/verifyUser")

router.get("/page", checkUser, async (req, res) => {
    let filepath = path.resolve("__dirname", "..", "files", "tasks.html")
    if (filepath) {
        return res.status(200).sendFile(filepath)
    }
    return res.status(500).json({ "message": "internal server error" })
})

router.post("/save", async (req, res) => {
    let db;
    let user = req.cookies._id;
    console.log(user)
    let { task, description } = req.body;
    if (!task || !description) {
        return res.status(400).json({ "message": "all values are required" })
    }
    try {
        db = await connection();
        console.log("connected successfully")
        const collection = db.collection("tasks");
        console.log("collection connected");
        let record = await collection.findOne({ "task": task });
        if (record) {
            return res.status(400).json({ "message": "task already exists" })
        }
        let result = await collection.insertOne({ "task": task, "description": description, "addedBy": user })
        console.log(result)
        if (result.acknowledged == true) {
            return res.status(201).json({ "message": "task added successfully" })
        }
        await db.client.close()
    }
    catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ "message": "Task addition failed" })
        }
        console.error(err)
        return res.status(500).json({ "message": "internal server error" })
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
        const result = await collection.find({});
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
    let db;
    let task = req.query.id;
    let id = new ObjectId(task)
    console.log(task)
    if (!task) {
        return res.status(400).json({ "message": "something went wrong" })
    }
    try {
        db = await connection();
        const collection = db.collection("tasks");
        const result = await collection.find({ "_id": id }).toArray();
        await db.client.close()
        return res.status(200).json(result)
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ "message": "something went wrong" })
    }

})

//for updating the task
router.put("/update", async (req, res) => {
    let db;
    let user = req.cookies._id;
    console.log(user)
    let { _id, task, description } = req.body;
    let id = new ObjectId(_id)
    if (!task || !description) {
        return res.status(400).json({ "message": "all values are required" })
    }
    try {
        db = await connection();
        console.log("connected successfully")
        const collection = db.collection("tasks");
        console.log("collection connected");
        let result = await collection.updateOne({ "_id": id }, { $set: { "task": task, "description": description, "updated_by": user } })
        if (result.acknowledged === true) {
            return res.status(200).json({ "message": "task updated sucessfully" })
        }
        await db.client.close()
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ "message": "something went wrong" })
    }
    finally {
        //await db.client.close();
    }

})

//for deleting the task
router.delete("/delete", async (req, res) => {
    let db;
    let { task } = req.body;
    try {
        db = await connection();
        console.log("connected successfully")
        const collection = db.collection("tasks");
        console.log("collection connected");
        const collections = db.collection("timesheets");
        console.log("collection connected");
        let result = await collection.deleteOne({ "task": task })
        console.log(result)
        if (result.acknowledged === true) {
            return res.status(200).json({ "message": "task deleted sucessfully" })
        }
        await db.client.close()
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({ "message": "something went wrong" })
    }
    finally {
        await db.client.close();
    }
})

router.get("/get", async (req, res) => {
    let db;
    let name = req.query.name;
    console.log(name)
    try {
        db = await connection();
        const collection = db.collection("tasks");
        const result = await collection.find({ "task": name }).toArray();
        console.log(result)
        // await db.client.close()
        return res.status(200).json(result)
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ "message": "something went wrong" })
    }
    finally {
        await db.client.close();
    }
})

module.exports = router;

