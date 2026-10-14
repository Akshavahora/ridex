import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

// Update and upload bank details in the database for the partner onboarding process
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

    const { accountHolder, accountNumber, upi, ifsc, mobileNumber } =
      await req.json();
    if (!accountHolder || !accountNumber || !ifsc || !mobileNumber) {
      return Response.json(
        {
          message: "Missing required fields",
        },
        { status: 400 },
      );
    }

    // if documents are there then update it otherwise upload the documents
    const partnerBank = await PartnerBank.findOneAndUpdate(
      { owner: user._id },
      {
        accountHolder,
        accountNumber,
        upi,
        ifsc,
        status: "added",
      },
      { upsert: true, new: true },
    );

    user.mobileNumber = mobileNumber;
    if (user.partnerOnBoardingSteps < 3) {
      user.partnerOnBoardingSteps = 3;
    }

    await user.save();

    return Response.json({ partnerBank }, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        message: `POST bank error: ${error}`,
      },
      { status: 500 },
    );
  }
}

//  GET API to get the partner bank details
export async function GET(req: NextRequest) {
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

    const partnerBank = await PartnerBank.findOne({ owner: user._id });
    if (!partnerBank) {
      return Response.json(
        {
          message: "Partner bank details not found",
        },
        { status: 404 },
      );
    }

    return Response.json({ partnerBank }, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        message: `GET bank error: ${error}`,
      },
      { status: 500 },
    );
  }
}
