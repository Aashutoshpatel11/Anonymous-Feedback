import mongoose from "mongoose";

type connectionObject = {
    isConnected?: Number
}

const connection:connectionObject = {}

async function connectDB():Promise<void>{
    if(connection){
        console.log("Database is Already Connected");
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {})
        if(db){
            connection.isConnected = db.connections[0].readyState
        }
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Error Connecting to Database", error);
        process.exit()
    }
}

export default connectDB;