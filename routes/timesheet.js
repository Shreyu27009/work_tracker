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
    let user = req.cookies._id;
    console.log(req.body)
    let { date, project, task, description, work_hrs, remark } = req.body;
    if (!date || !project || !task || !description || !work_hrs) {
        return res.status(400).json({ "message": "all values are required" })
    }
    if (work_hrs < 0 || work_hrs > 24) {
        return res.status(400).json({ "message": "invalid hours of work" })
    }
    try {
        let db = await connection();
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
        let timesheets = []
        const result = collection.find({ "addedBy": `${user}` });
        for await (const document of result) {
            console.log(document);
            timesheets.push(document)
        }
        return res.status(200).json(timesheets)
    }
    catch (err) {
        return res.status(500).json({ "message": "internal server error" })
    }
})


//for getting the timesheet based on the _id
router.get("/show", async function (req, res) {
    try {
        let user = req.cookies._id;
        let query = req.query.id;
        let id = new ObjectId(query)
        console.log(query)
        let db = await connection();
        console.log("connected successfully")
        const collection = db.collection("timesheets");
        console.log("collection connected")
        const result = await collection.find({ "_id": id, "addedBy": `${user}` }).toArray();
        console.log(result)
        return res.status(200).json(result)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ "message": "internal server error" })
    }
})

//for updating the timesheet record
router.put("/update", async (req, res) => {
    let user = req.cookies._id;
    console.log(req.body)
    let { _id, date, project, task, description, work_hrs, remark } = req.body;
    let id = new ObjectId(_id)
    if (!date || !project || !task || !description || !work_hrs) {
        return res.status(400).json({ "message": "all values are required" })
    }
    if (work_hrs < 0 || work_hrs > 24) {
        return res.status(400).json({ "message": "invalid hours of work" })
    }
    try {
        let db = await connection();
        console.log("connected successfully")
        const collection = db.collection("timesheets");
        console.log("collection connected");
        let result = await collection.updateOne({ "_id": id }, { $set: { "date": date, "project": project, "task": task, "description": description, "work_hrs": work_hrs, "remark": remark, "updatedBy": user } })
        console.log(result)
        if (result.acknowledged === true) {
            return res.status(200).json({ "message": "updated successfully" })
        }
        return res.status(400).json({ "message": "timesheet update failed with error 400" })


    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ "messgage": "internal server error" })
    }
})

router.delete("/delete", async (req, res) => {
    let { _id } = req.body;
    let id = new ObjectId(_id)
    console.log(id)
    try {
        let db = await connection();
        console.log("connected successfully")
        const collection = db.collection("timesheets");
        console.log("collection connected");
        let result = await collection.deleteOne({ "_id": id })
        console.log(result)
        if (result.acknowledged === true) {
            return res.status(200).json({ "message": "record deleted successfully" })
        }
        return res.status(400).json({ "message": "timesheet update failed with error 400" })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ "messgage": "internal server error" })
    }
})

router.get("/getBydate", async (req, res) => {
    let user = req.cookies._id;
    let start = req.query.start;
    let end = req.query.end;
    console.log(start, end, user)
    if (!start || !end) {
        return res.status(400).json({ "message": "select the dates appropriately" })
    }
    try {
        let db = await connection();
        console.log("connected successfully")
        const collection = db.collection("timesheets");
        console.log("collection connected")
        let timesheets = []
        let result = await collection.find({
            "addedBy": `${user}`,
            "date": { $gte: `${start}`, $lte: `${end}` }
        });
        for await (const document of result) {
            console.log(document);
            timesheets.push(document)
        }
        return res.status(200).json(timesheets)
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ "message": "internal server error" })
    }
})



module.exports = router;