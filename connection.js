
const mongodb = require('mongodb');
const url = "mongodb://127.0.0.1:27017"
const client = new mongodb.MongoClient(url);

const connection = async () => {
    try {
        await client.connect();
        console.log("database connected successfully");
        const database = client.db("work_tracker")

        try {
            await database.createCollection("timesheets")
            await database.createCollection("tasks")
            await database.createCollection("projects")
            await database.createCollection("users")
            console.log("collection created with schema")
        }
        catch (err) {
            if (err.code === 48) {
                console.log("collection already exists processing")
            }
        }
        return database;

    }
    catch (err) {
        console.error("database connection failed", err)
    }
}
/*
const mongodb = require('mongodb');
const url = "mongodb://127.0.0.1:27017";
const client = new mongodb.MongoClient(url, {
    maxPoolSize: 100,
    minPoolSize: 10
});
let dbInstance = null;
const connection = async () => {
    if (dbInstance) return dbInstance;
    try {

        await client.connect();
        console.log("database connected successfully");
        const database = client.db("work_tracker")

        try {
            await database.createCollection("timesheets")
            await database.createCollection("tasks")
            await database.createCollection("projects")
            await database.createCollection("users")
            console.log("collection created with schema")
        }
        catch (err) {
            if (err.code === 48) {
                console.log("collection already exists processing")
            }
        }
        dbInstance = database; 
        return dbInstance;

    }
    catch (err) {
        console.error("database connection failed", err)
    }
}*/
module.exports = connection;