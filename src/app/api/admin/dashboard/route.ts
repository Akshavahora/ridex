import {auth} from "@/auth"
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";

//Here it will check weather the logged in is admin or not
export async function GET(req:NextRequest){
    try{
        await connectDb()
        const session = await auth()
        if(!session || !session.user?.email || session.user.role !=="admin"){
            return Response.json({message:"unauthorized"}
                ,{status:400}
            )
        }
//Finding all the partners by using countDocuments

    const totalPartners=await User.countDocuments({role:"partner"})
    const totalApprovedPartners=await User.countDocuments({role:"partner",partnerStatus:"approved"})
    const totalPendingPartners=await User.countDocuments({role:"partner",partnerStatus:"pending"})
    const totalRejectedPartners=await User.countDocuments({role:"partner",partnerStatus:"rejected"})


//Finding the users who are remaining for reviews 

     const pendingPartnerUsers=await User.find({
        role:"partner",
        partnerStatus:"pending",
        partnerOnBoardingSteps:{$gte:3}
     })  

//$in Oparater will go inside the array and check the partners ids and findout the owers vehicle id
     const partnerIds=pendingPartnerUsers.map((p)=>p._id)
     const partnerVehicles=await Vehicle.find({
        owner:{$in:partnerIds}
     })

//here we will get the id of owner and we can add the type of vehical
     const vehicleTypeMap=new Map(
        partnerVehicles.map((v)=>[String(v.owner),v.type])
        
     )

     const pendingPartnersReviews=pendingPartnerUsers.map((p)=>({
        _id:p._id,
        name:p.name,
        email:p.email,
        vehicleType:vehicleTypeMap.get(String(p._id))
     }))

return NextResponse.json({

    stats:{
    totalPartners,
    totalApprovedPartners,
    totalPendingPartners,
    totalRejectedPartners,
        
    },

   
    pendingPartnersReviews

},{
    status:200
}
)
    }catch(error){
        return NextResponse.json({

        message:`admin dashboard error ${error}`

},{
    status:500
})

    }
}