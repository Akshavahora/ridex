import { Connection } from "mongoose";

declare global {
    var mongooseConn: {
        conn: Connection | null, //if the connection is already established, it will be stored here
        promise: Promise<Connection> | null; //if the connection is in progress, the promise will be stored here
    }
}

export {}