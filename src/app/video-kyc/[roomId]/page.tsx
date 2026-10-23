'use client'
import React, { useRef } from 'react'
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import Image from 'next/image'
function page() {

   const {userData}=useSelector((state:RootState)=>state.user)
    const containerRef=useRef<HTMLDivElement>(null)
    const startCall=async()=>{
        if(!containerRef.current) {
            return null
        }

        try{
            const appID= Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID)
            const serverSecret=process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET
            const kitToken=ZegoUIKitPrebuilt.generateKitTokenForTest(
                appID,
                serverSecret!,
                "jhishf",  
                userData?._id.toString()!,
                "Saniya"
            )

            const zp=ZegoUIKitPrebuilt.create(kitToken)
              zp.joinRoom({
        container: containerRef.current,
        
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        },
        showPreJoinView: false
      });


        }catch(error){
            console.log(error)

        }
    }
  return (
    <div className='min-h-screen bg-black text-white flex flex-col'>
      <div className='px-6 py-4 border-white/10 flex flex-col sm:flex-row justify-between
      items-starts sm:items-center gap-4'>
        <div>
          <Image src={"/logo.png"} alt="logo" width={44} height={44} priority />

          <p className='text-xs text-gray-400'>{userData?.role=="admin" ? "Admin Verification" : "Partner Video KYC"}</p>
        </div>

      </div>
        
        

    </div>
  )
}

export default page