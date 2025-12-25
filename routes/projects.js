const express = require('express');
const router = express.Router();
const path = require("path")
const connection = require("../connection")
const { ObjectId } = require('mongodb');
const e = require('express');
const bcrypt = require("bcrypt");
const { error } = require('console');
const { checkUser } = require("../middlwares/verifyUser")

router.get("/page", checkUser, async (req, res) => {
    let filepath = path.resolve("__dirname", "..", "files", "projects.html")
    console.log(filepath)
    if (filepath) {
        return res.status(200).sendFile(filepath)
    }
    else {
        return res.status(500).json({ "message": "internal server error" })
    }
})

//for insertion of the project data
router.post("/save", async (req, res) => {
    let _id = req.cookies._id;
    let { project, description } = req.body;
    if (!project || !description) {
        return res.status(400).json({ "message": "all values are required" })
    }
    try {
        let db = await connection();
        console.log("connected successfully")
        const collection = db.collection("projects");
        console.log("collection connected");
        let record = await collection.findOne({ "project": project });
        console.log(record)
        if (record) {
            return res.status(400).json({ "message": "project already exists" })
        }
        let result = await collection.insertOne({ "project": project, "description": description, "addedBy": _id })
        if (result.acknowledged === true) {
            return res.status(201).json({ "message": "project added sucessfully" })
        }
        await db.client.close();
    }
    catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ "message": "project addition failed" })
        }
        console.error(err);
        return res.status(500).json({ "message": "internal server error" })
    }

})

router.get("/show", async (req, res) => {
    try {
        let db = await connection();
        console.log("connected successfully")
        const collection = db.collection("projects");
        console.log("collection connected");
        let projects = []
        const result = collection.find({});
        for await (const document of result) {
            console.log(document);
            projects.push(document)
        }
        return res.status(200).json(projects)
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ "message": "something went wrong" })
    }
})

//for getting the single project
router.get("/shows", async (req, res) => {
    let name = req.query.id;
    let id = new ObjectId(name)
    console.log(name)
    try {
        let db = await connection();
        const collection = db.collection("projects");
        const result = await collection.find({ "_id": id }).toArray();
        console.log(result)
        await db.client.close();
        return res.status(200).json(result)
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ "message": "something went wrong" })
    }
})

router.get("/get", async (req, res) => {
    let name = req.query.name;
    console.log(name)
    try {
        let db = await connection();
        const collection = db.collection("projects");
        const result = await collection.find({ "project": name }).toArray();
        console.log(result)
        await db.client.close();
        return res.status(200).json(result)
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ "message": "something went wrong" })
    }
})

//for updating the project
router.put("/update", async (req, res) => {
    let user = req.cookies._id;
    let { _id, project, description } = req.body;
    let id = new ObjectId(_id)
    if (!project || !description) {
        return res.status(400).json({ "message": "all values are required" })
    }
    try {
        let db = await connection();
        console.log("connected successfully")
        const collection = db.collection("projects");
        console.log("collection connected");
        let result = await collection.updateOne({ "_id": id }, { $set: { "project": project, "description": description, "updated_by": user } })
        if (result.acknowledged === true) {
            return res.status(200).json({ "message": "project updated sucessfully" })
        }
        await db.client.close();

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ "message": "something went wrong" })
    }

})

//for deleting the project
router.delete("/delete", async (req, res) => {
    let { project } = req.body;
    try {
        let db = await connection();
        console.log("connected successfully")
        const collection = db.collection("projects");
        console.log("collection connected");
        //checking whether the project or task is ongoing
        const collections = db.collection("timesheets");
        console.log("collection connected");
        let record = await collections.find({ "project": project }).toArray();
        if (record.length > 0) {
            return res.status(400).json({ "message": "do not delete the project" })
        }
        else {
            let result = await collection.deleteOne({ "project": project })
            if (result.acknowledged === true) {
                return res.status(200).json({ "message": "project deleted sucessfully" })
            }
            await db.client.close();
        }

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ "message": "something went wrong" })
    }

})

module.exports = router;