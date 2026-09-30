import mongoose from "mongoose";

type vehicleType = 
    "bike" |
    "car" |
    "loading" |
    "truck" |
    "auto"


// Create vehicle interface 
interface IVehicle{
    owner: mongoose.Types.ObjectId,
    type: vehicleType,
    vehicleModel: string,
    number: string, 
    imageUrl?:string,
    baseFare?:number,
    pricePerKM?: number,
    waitingCharge?: number,
    status: "approved" | "pending" |"rejected",
    rejectionReason?: string,
    isActive:boolean,
    createdAt: Date,
    updatedAt: Date
}

// Vehicle Schema
const vehicleSchema = new mongoose.Schema<IVehicle>(
    {
        owner: {
            owner: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type:{
            type: String,
            enum: ["bike", "car", "loading", "truck", "auto"],
            required: true,
        },
        number:{
            type: String,
            required: true,
            unique: true,
        },
        vehicleModel:{
            type: String,
            required: true,
        },
        imageUrl:{
            type: String,
        },
        baseFare:{
            type: Number,
        },
        pricePerKM:{
            type: Number,
        },
        waitingCharge:{
            type: Number,
        },
        status:{
            type: String,
            enum: ["approved", "pending", "rejected"],
            default: "pending",
        },
        rejectionReason:{
            type: String,
        },
        isActive:{
            type: Boolean,
            default: true,
        }
    }, {timestamps:true})

    const  Vehicle = mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema)

    export default Vehicle