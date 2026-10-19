'use client'
import axios from 'axios'
import React, { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, Badge, BadgeCheck, CheckCircle, CircleDashed, CreditCard, Landmark, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/


function page() {
    const router=useRouter()
    const [accountHolder, setAccountHolder] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [ifsc, setIfsc] = useState("")
    const [upi, setupi] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")


    const sanitizedIfsc = ifsc.trim().toUpperCase();
    const isNamedValid=accountHolder.trim().length>=3
    const isAccountNumberValid=accountNumber.trim().length>=9
    const isIfscValid=IFSC_REGEX.test(sanitizedIfsc)
    const isMobileValid=mobileNumber.trim().length===10 

    const canSubmit=isNamedValid && isAccountNumberValid && isIfscValid && isMobileValid


    const handleBank=async()=>{
        setLoading(true)
        setError("")
        try{
            const {data}=await axios.post("/api/partner/onboarding/bank",{
                accountHolder,
                accountNumber,
                ifsc:sanitizedIfsc,   
                upi,
                mobileNumber
            })
            console.log(data)
            setLoading(false)
        }catch(error:any){
            setError(error?.response?.data?.message ?? "Something went wrong")
            console.error(error)
            setLoading(false)
        }
    }


  



  return (
    <div className='min-h-screen bg-white flex items-center justify-center px-4'>

    <motion.div 
    initial={{opacity:0,y:28}}
    animate={{opacity:1,y:0}}
    className='w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8'>

        <div className="relative text-center">
          <button
            className="absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300
      flex items-center justify-center hover:bg-gray-100 transition"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
          </button>

          <p className="text-xs text-gray-500 font-medium">step 3 of 3</p>

          <h1 className="text-2xl font-bold mt-1">Bank & Payout Setup</h1>
          <p className="text-sm text-gray-500 mt-2">
            Used for Partner payouts
          </p>
        </div>   

        <div className='mt-8 space-y-6'>
            <div>
                <label htmlFor='ahn' className='text-xs font-semibold text-gray-500'>Account Holder Name</label>
                <div className='flex items-center mt-2'>
                    <div className='text-gray-400'><BadgeCheck/></div>
                     <input type="text"
                     id='ahn'
                      placeholder='As per bank records'
                    className ={`flex-1 border-b pb-2 text-sm focus:outline-none 
                    ${!isNamedValid && accountHolder.length>0? "border-red 400 focus:border-red-500":"border-gray-300 focus:border-black"}`}
                    
                     value={accountHolder}
                     onChange={(e) => setAccountHolder(e.target.value)} />

                </div>
                {!isNamedValid && accountHolder.length > 0 && (
                    <p className='text-red-500 text-xs mt-1'>Account holder name must be at least 3 characters long</p>
                )}
            </div>


            <div>
                <label htmlFor='ahn' className='text-xs font-semibold text-gray-500'>Bank account number</label>
                <div className='flex items-center mt-2'>
                    <div className='text-gray-400'><CreditCard/></div>
                     <input type='text'id='ahn' placeholder='Enter account number' 
                   className ={`flex-1 border-b pb-2 text-sm focus:outline-none 
                    ${!isAccountNumberValid && accountNumber.length>0? "border-red 400 focus:border-red-500":"border-gray-300 focus:border-black"}`}
                     value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />

                </div>
                 {!isAccountNumberValid && accountNumber.length > 0 && (
                    <p className='text-red-500 text-xs mt-1'>Account number must be at least 9 digits long</p>
                )}
            </div>

            <div>
                <label htmlFor='ahn' className='text-xs font-semibold text-gray-500'>IFSC code</label>
                <div className='flex items-center mt-2'>
                    <div className='text-gray-400'><Landmark/></div>
                     <input type='text'id='ahn' placeholder='HDFC001234'
                      className ={`flex-1 border-b pb-2 text-sm focus:outline-none 
                    ${!isIfscValid && ifsc.length>0? "border-red 400 focus:border-red-500":"border-gray-300 focus:border-black"}`}
                    value={ifsc.toUpperCase()} onChange={(e) => setIfsc(e.target.value)} />

                </div>
                  {!isIfscValid && ifsc.length > 0 && (
                    <p className='text-red-500 text-xs mt-1'>IFSC code is invalid</p>
                )}
            </div>

            <div>
                <label htmlFor='ahn' className='text-xs font-semibold text-gray-500'>Mobile number</label>
                <div className='flex items-center mt-2'>
                    <div className='text-gray-400'><Phone/></div>
                     <input type='text'id='ahn' placeholder='10 digit mobil number'
                      className ={`flex-1 border-b pb-2 text-sm focus:outline-none 
                    ${!isMobileValid && mobileNumber.length>0? "border-red 400 focus:border-red-500":"border-gray-300 focus:border-black"}`}
                     value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />

                </div>
                  {!isMobileValid && mobileNumber.length > 0 && (
                    <p className='text-red-500 text-xs mt-1'>Enter 10 digit Mobile number</p>
                )}
            </div>

            <div>
                <label htmlFor='ahn' className='text-xs font-semibold text-gray-500'>UPI ID(optional)</label>
                <div className='flex items-center mt-2'>
                    
                     <input type='text'id='ahn' placeholder='name@upi' className='flex-1 border-b pb-2 text-sm focus:outline-none 
                     border-gray-300 focus:border-black' value={upi} onChange={(e) => setupi(e.target.value)} />

                </div>
            </div>

        </div>

        
         {error && <p className='text-red-500 text-sm mt-4'>*{error}</p>}

        <div className='mt-6 flex items-start gap-3 text-xs text-gray-500'>
            <CheckCircle size={16} className='mt-0.5'/>
            <p>Bank details are verified before first payout.
                This usually takes 1-2 business days. You will be notified once verified.</p>
             </div>

         <motion.button
            whileHover={{scale:1.02}}
            whileTap={{scale:0.97}}
            onClick={handleBank}
            disabled={!canSubmit || loading}
            className='mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex
            disabled:opacity-40 transion flex items-center justify-center' >

          

        {loading?<CircleDashed className='text-white animate-spin'/>:"Continue"}
         </motion.button>

    </motion.div>

    </div>
  )
}

export default page