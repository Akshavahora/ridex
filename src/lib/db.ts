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

if(!cached.promise) {
    cached.promise = mongoose.connect(mongodbUrl).then((mongoose) => {
        return mongoose.connection
    })
}    

const connectDb = async () => {
    if(cached.conn) {
        return cached.conn
    }

    try {
        const conn = await cached.promise
        return conn
    } catch (error) {
        console.log(error)
    }
}

export default connectDb