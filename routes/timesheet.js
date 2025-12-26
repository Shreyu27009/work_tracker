const express = require('express');
const router = express.Router();
const path = require("path")
const connection = require("../connection")
const { ObjectId } = require('mongodb');
const { error } = require('console');
const { checkUser } = require("../middlwares/verifyUser")
router.get("/page", checkUser, async (req, res) => {
    let filepath = path.resolve("__dirname", "..", "files", "timesheet.html")
    console.log(filepath)
    if (filepath) {
        return res.status(200).sendFile(filepath)
    }
    else {
        return res.status(500).json({ "message": "internal server error" })
    }
})

router.post("/save", async (req, res) => {
    let db;
    let user = req.cookies._id;
    console.log(req.body)
    let { date, project, task, description, work_hrs, remark } = req.body;
    if (!date || !project || !task || !description || !work_hrs) {
        return res.status(400).json({ "message": "all values are required" })
    }
    if (work_hrs < 0 || work_hrs >= 24 || work_hrs == 0 || work_hrs == 24) {
        return res.status(400).json({ "message": "invalid hours of work" })
    }
    try {
        db = await connection();
        console.log("connected successfully")
        const collection = db.collection("timesheets");
        console.log("collection connected");
        let result = collection.insertOne({ "date": date, "project": project, "task": task, "description": description, "work_hrs": work_hrs, "remark": remark, "addedBy": user })
        return res.status(201).json({ "message": "added successfully" })


    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ "messgage": "internal server error" })
    }
})

//for getting the timesheets as per the logged user
router.get("/shows", async function (req, res) {
    try {
        let user = req.cookies._id;
        let db = await connection();
        console.log("connected successfully")
        const collection = db.collection("timesheets");
        console.log("collection connected")
        let timesheet = []
        const result = collection.find({ "addedBy": `${user}` });
        for await (const document of result) {
            console.log(document);
            timesheet.push(document)
        }
        return res.status(200).json(timesheet)
    }
    catch (err) {
        console.error("error:", err);
        return res.status(500).json({ "message": "internal server error" })
    }
})


//for getting the timesheet based on the _id
router.get("/show", async function (req, res) {
    let db;
    try {
        let user = req.cookies._id;
        let query = req.query.id;
        let id = new ObjectId(query)
        console.log(query)
        db = await connection();
        console.log("connected successfully")
        const collection = db.collection("timesheets");
        console.log("collection connected")
        const result = await collection.find({ "_id": id, "addedBy": `${user}` }).toArray();
        console.log(result)
        //await db.client.close()
        return res.status(200).json(result)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ "message": "internal server error" })
    }
})

//for updating the timesheet record
router.put("/update", async (req, res) => {
    let db;
    let user = req.cookies._id;
    console.log(req.body)
    let { _id, date, project, task, description, work_hrs, remark } = req.body;
    let id = new ObjectId(_id)
    if (!date || !project || !task || !description || !work_hrs) {
        return res.status(400).json({ "message": "all values are required" })
    }
    if (work_hrs < 0 || work_hrs > 24 || work_hrs == 0 || work_hrs == 24) {
        return res.status(400).json({ "message": "invalid hours of work" })
    }
    try {
        db = await connection();
        console.log("connected successfully")
        const collection = db.collection("timesheets");
        console.log("collection connected");
        let result = await collection.updateOne({ "_id": id }, { $set: { "date": date, "project": project, "task": task, "description": description, "work_hrs": work_hrs, "remark": remark, "updatedBy": user } })
        console.log(result)
        if (result.acknowledged === true) {
            return res.status(200).json({ "message": "updated successfully" })
        }
        await db.client.close()

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ "messgage": "internal server error" })
    }
})

router.delete("/delete", async (req, res) => {
    let db;
    let { _id } = req.body;
    let id = new ObjectId(_id)
    console.log(id)
    try {
        db = await connection();
        console.log("connected successfully")
        const collection = db.collection("timesheets");
        console.log("collection connected");
        let result = await collection.deleteOne({ "_id": id })
        console.log(result)
        if (result.acknowledged === true) {
            return res.status(200).json({ "message": "record deleted successfully" })
        }
        //await db.client.close();
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ "messgage": "internal server error" })
    }
    finally {
        await db.client.close();
    }
})

router.get("/getBydate", async (req, res) => {
    let db;
    let user = req.cookies._id;
    let start = req.query.start;
    let end = req.query.end;
    console.log(start, end, user)
    if (!start || !end) {
        return res.status(400).json({ "message": "select the dates appropriately" })
    }
    try {
        db = await connection();
        console.log("connected successfully")
        const collection = db.collection("timesheets");
        console.log("collection connected")
        let result = await collection.find({
            "addedBy": `${user}`,
            "date": { $gte: `${start}`, $lte: `${end}` }
        }).toArray()
        return res.status(200).json(result)
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ "message": "internal server error" })
    }
    finally {
        await db.client.close();
    }
})



module.exports = router;