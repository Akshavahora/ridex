"use client";
import { useEffect } from "react";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "@/redux/userSlice";

function useGetMe(enabled: boolean) {

    const dispatch = useDispatch()
  useEffect(() => {
    if (!enabled) {
      return
    }
const getMe = async () => {
    try{
         const {data} = await axios.get("/api/user/me")
    dispatch(setUserData(data))
        
    }catch(error){
        console.log("get me error",error)
    }
    
}
getMe()
  }, [enabled])
}

export default useGetMe;
