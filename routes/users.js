const express = require('express');
const router = express.Router();
const path = require("path")
const connection = require("../connection")
const { ObjectId } = require('mongodb');
const e = require('express');
const bcrypt = require("bcrypt");
const { error } = require('console');


router.get("/signup/page", async (req, res) => {
    let filepath = path.resolve("__dirname", "..", "files", "signup.html")
    console.log(filepath)
    if (filepath) {
        return res.status(200).sendFile(filepath)
    }
    else {
        return res.status(500).json({ "message": "internal server error" })
    }
})

router.post("/signup/save", async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ "message": "all field are required" })
    }
    try {
        let db = await connection();
        console.log("connected successfully")
        const collection = db.collection("users");
        console.log("collection connected")
        let plaintext = password.toString();
        let saltRounds = 10
        let encryptedPassword = await bcrypt.hash(plaintext, saltRounds);
        let result = await collection.insertOne({ "_id": email, "password": encryptedPassword })
        console.log(result)
        if (result.acknowledged == true) {
            return res.status(200).json({ "message": "data inserted successfully" })
        }
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({ "message": "internal server error" })
    }
})

router.get("/login/page", async (req, res) => {
    let filepath = path.resolve("__dirname", "..", "files", "login.html")
    console.log(filepath)
    if (filepath) {
        return res.status(200).sendFile(filepath)
    }
    else {
        return res.status(500).json({ "message": "internal server error" })
    }
})

router.post("/login", async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ "message": "all fields are required" })
    }
    try {
        let db = await connection();
        console.log("connected successfully")
        const collection = db.collection("users");
        console.log("collection connected");
        let user = await collection.findOne({ _id: email })
        if (user == null) {
            return res.status(404).json({ "message": "user not found" })
        }
        else {
            let e_password = await bcrypt.compare(password, user.password)
            console.log(e_password)
            if (e_password) {
                const options = {
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                }
                console.log(user._id)
                return res.status(200).cookie('_id', user._id, options).json({
                    success: true,
                    user
                })
            }
            else {
                return res.status(400).json({ "message": "password mismatch" });
            }

        }
    }
    catch (err) {
        console.log(err)
        return res.json(500).json({ "message": "internal server error" })
    }
})

module.exports = router;