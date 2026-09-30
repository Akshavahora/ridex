import mongoose from "mongoose";

// Create Partner Document interface 
interface IPartnerDocs{
    owner: mongoose.Types.ObjectId,
    adharUrl: string,
    rcUrl: string,
    licenseUrl: string,  
    status: "approved" | "pending" |"rejected",
    rejectionReason?: string,
    createdAt: Date,
    updatedAt: Date
}

// Partner Document Schema
const partnerDocsSchema = new mongoose.Schema<IPartnerDocs>(
    {
        owner: {
            owner: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        adharUrl: {
            type: String,
        },
        rcUrl: {
            type: String,
        },
        licenseUrl: {
            type: String,
        },
        status:{
            type: String,
            enum: ["approved", "pending", "rejected"],
            default: "pending",
        },
        rejectionReason:{
            type: String,
        },
    }, {timestamps:true})

    const  partnerDocs = mongoose.models.partnerDocs || mongoose.model("partnerDocs", partnerDocsSchema)

    export default partnerDocs