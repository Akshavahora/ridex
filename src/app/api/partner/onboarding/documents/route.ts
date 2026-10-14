import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/db";
import PartnerDocs from "@/models/partnerDocs.model";

import User from "@/models/user.model";
import { NextRequest } from "next/server";

// Update and upload documents in the database for the partner onboarding process
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

    const formData = await req.formData();
    const aadhar = formData.get("aadhar") as Blob;
    const license = formData.get("license") as Blob;
    const rc = formData.get("rc") as Blob;

    if (!aadhar || !license || !rc) {
      return Response.json(
        {
          message: "Missing required documents",
        },
        { status: 400 },
      );
    }

    const uploadPayload: any = {
      status: "pending",
      rejectionReason: "",
    };

    // Upload documents to cloudinary
    if (aadhar) {
      const url = await uploadOnCloudinary(aadhar);
      if (!url) {
        return Response.json(
          {
            message: "aadhar upload failed",
          },
          { status: 500 },
        );
      }
      uploadPayload.adharUrl = url;
    }
    if (license) {
      const url = await uploadOnCloudinary(license);
      if (!url) {
        return Response.json(
          {
            message: "license upload failed",
          },
          { status: 500 },
        );
      }
      uploadPayload.licenseUrl = url;
    }
    if (rc) {
      const url = await uploadOnCloudinary(rc);
      if (!url) {
        return Response.json(
          {
            message: "rc upload failed",
          },
          { status: 500 },
        );
      }
      uploadPayload.rcUrl = url;
    }

    const partnerDocs = await PartnerDocs.findOneAndUpdate(
      { owner: user._id },
      { $set: uploadPayload },
      { upsert: true, new: true }
    );

    if(user.partnerOnBoardingSteps < 2) {
      user.partnerOnBoardingSteps = 2;
    }

    await user.save();

    return Response.json(
      partnerDocs,
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      {
        message: "An error occurred while uploading documents",
      },
      { status: 500 },
    );
  }
}