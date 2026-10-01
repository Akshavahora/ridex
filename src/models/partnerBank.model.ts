import mongoose from "mongoose";

// Create Partner Document interface 
interface IPartnerBank{
    owner: mongoose.Types.ObjectId,
    accountHolder: string,
    accountNumber: string,
    ifsc: string,
    upi?: string,
    status: "not_added" | "added" |"verified",
    createdAt: Date,
    updatedAt: Date
}

// Partner Document Schema
const partnerBankSchema = new mongoose.Schema<IPartnerBank>(
    {
        owner: {
            owner: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        accountHolder: {
            type: String,
            required: true,
        },
        accountNumber: {
            type: String,
            required: true,
            unique: true,
        },
        ifsc: {
            type: String,
            required: true,
            uppercase: true,
        },
        upi: {
            type: String,
        },
        status: {
            type: String,
            enum: ["not_added", "added", "verified"],
            default: "not_added",
        },
    }, {timestamps:true})

    const  partnerBank = mongoose.models.partnerBank || mongoose.model("partnerBank", partnerBankSchema)

    export default partnerBank              