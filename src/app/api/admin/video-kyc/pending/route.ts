
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";

export async function GET() {
    try {
        await connectDb();

        const session = await auth()
        if (!session || !session.user) {
            return Response.json({ message: "user is not authenticated" },
                { status: 400 }
            )

        }

        const partner = await User.find({
            role: "partner",
            VideoKycStatus: {$in:["pending",""]}
        })
        return Response.json(
            partner, 
            {status:200}
        )

    } catch (error) {
        return Response.json(
            {message: `partner kyc get error | ${error}`}, 
            {status:200}
        )
    } 
}
