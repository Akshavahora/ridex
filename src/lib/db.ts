import mongoose from "mongoose";

const mongodbUrl = process.env.MONGODB_URL;

if(!mongodbUrl) {
    throw new Error("db Url Not Found!")
}
 
let cached = global.mongooseConn

if(!cached) {
    cached = global.mongooseConn = {
        conn: null, promise: null 
    }
}

const connectDb = async () => {
    if(cached.conn) {
        return cached.conn
    }

    if(cached.promise) {
        // console.log("Promise conn");
    }

    if(!cached.promise) {
        // console.log("new connection");
        cached.promise = mongoose.connect(mongodbUrl).then((mongoose) => {
            return mongoose.connection
        })
    }    

    try {
        const conn = await cached.promise
        return conn
    } catch (error) {
        console.log(error)
    }
}

export default connectDb