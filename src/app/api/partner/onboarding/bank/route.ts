import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const session = await auth();
        if (!session || !session.user?.email) {
            return Response.json(
                {
                    message: "unauthorized",
                },
                { status: 400 },
            );
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return Response.json(
                {
                    message: "User not found",
                },
                { status: 400 },
            );
        }

        const {accountHolder, accountNumber, upi, ifsc, mobileNumber } = await req.json();
        if(!accountHolder || !accountNumber || !ifsc || !mobileNumber) {
            return Response.json(
                {
                    message: "Missing required fields",
                },
                { status: 400 },
            );
        }

        // if documents are there then update it otherwise upload the documents 
        const PartnerBankDoc = await PartnerBank.findOneAndUpdate(
            { owner: user._id },
            { 
                accountHolder, 
                accountNumber, 
                upi, 
                ifsc,
                status: "added", 
            },
            { upsert: true, new: true }
        );

        user.mobileNumber = mobileNumber;
        if(user.partnerOnBoardingSteps < 3) {
            user.partnerOnBoardingSteps = 3;
        }

        await user.save();
        return Response.json(
                { PartnerBank },
                { status: 201 },
            );

    } catch (error) {
        return Response.json(
            {
                message: `POST bank error: ${error}`,
            },
            { status: 500 },
        );
    }
}