import { MongoClient } from "mongodb";

class MongoClient {
    constructor(uri) {
        this.client = new MongoClient(uri)
        this.connected = false;
        this.db = null;
    }

    getAllEvents() {
        const database = this.client.db("proddb")
        const events = database.collection("Event")
        const cursor = events.find({})
        return cursor
    }
}

module.exports = MongoClient;
