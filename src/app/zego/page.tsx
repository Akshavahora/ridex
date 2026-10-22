'use client'
import React, { useRef } from 'react'
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
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
    <div ref={containerRef}className='h-screen'>
        <button onClick={startCall}>Start Call</button>
        

    </div>
  )
}

export default page