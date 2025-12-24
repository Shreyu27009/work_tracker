const express = require('express');
const router = express.Router();
const path = require("path")
const connection = require("../connection")
const { ObjectId } = require('mongodb');
const e = require('express');
const bcrypt = require("bcrypt");
const { error } = require('console');

router.get("/page", async (req, res) => {
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
    let { date, project, description, remark } = req.body;
    if (!date || !project || !description) {
        return res.status(400).json({ "message": "all values are required" })
    }
    try {
        let db = await connection();
        console.log("connected successfully")
        const collection = db.collection("projects");
        console.log("collection connected");
        let record = await collection.find({ "project": project });
        let projects = []
        for await (const document of record) {
            console.log(document);
            projects.push(document)
        }
        console.log(projects)
        if (projects.length > 0) {
            return res.status(400).json({ "message": "project already exists" })
        }
        let result = await collection.insertOne({ "date": date, "project": project, "description": description, "remark": remark, "addedBy": _id })
        if (result.acknowledged === true) {
            return res.status(201).json({ "message": "project added sucessfully" })
        }
        else {
            return res.status(400).json({ "message": "project addition failed" })
        }

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ "message": "project addition failed" })
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
    let name = req.query.name;
    try {
        let db = await connection();
        const collection = db.collection("projects");
        const result = await collection.find({ "project": name }).toArray();
        console.log(result)
        return res.status(200).json(result)
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ "message": "something went wrong" })
    }
})

//for updating the project
router.put("/update", async (req, res) => {
    let _id = req.cookies._id;
    let { oname, date, project, description } = req.body;
    if (!date || !project || !description) {
        return res.status(400).json({ "message": "all values are required" })
    }
    try {
        let db = await connection();
        console.log("connected successfully")
        const collection = db.collection("projects");
        console.log("collection connected");
        let record = await collection.find({ "project": project });
        let projects = []
        for await (const document of record) {
            console.log(document);
            projects.push(document)
        }
        console.log(projects)
        if (projects.length > 0) {
            return res.status(400).json({ "message": "project already exists" })
        }
        if (projects.length === 0) {
            let result = await collection.updateOne({ "project": oname }, { $set: { "date": date, "project": project, "description": description, "updated_by": _id } })
            if (result.acknowledged === true) {
                return res.status(200).json({ "message": "project updated sucessfully" })
            }
            else {
                return res.status(400).json({ "message": "project update failed" })
            }
        }
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
        let record = await collections.find({ "project": project });
        let projects = []
        for await (const document of record) {
            console.log(document);
            projects.push(document)
        }
        console.log(projects)
        if (projects.length > 0) {
            return res.status(400).json({ "message": "do not delete the project" })
        }
        else {
            let result = await collection.deleteOne({ "project": project })
            if (result.acknowledged === true) {
                return res.status(200).json({ "message": "project deleted sucessfully" })
            }
            else {
                return res.status(404).json({ "message": "project not found" })
            }
        }

    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ "message": "something went wrong" })
    }

})

module.exports = router;