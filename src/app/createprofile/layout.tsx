"use client"

import {  usePathname } from "next/navigation";
import {ReactNode } from "react";
import { ProfileFormProvider } from "./context/ProfileFormContext";

interface Layout {children : ReactNode} //children need be made of valid React content

export default function CreateProfileLayout ({ children} : Layout)
{
  const pathname = usePathname(); //get current,full URL

  const stepMatch= pathname.match(/\/createprofile\/(\d+)/); //extract step num
  const currentStep=stepMatch ? parseInt(stepMatch[1]) : 1 //starts step 1
  const totalSteps=14;
  const progressPercent=Math.min((currentStep /totalSteps) * 100, 100);

  return (
    <ProfileFormProvider>
      <div className= "flex items-center justify-center min-h-screen p-6">
        <div className ="max-w-3xl  w-full bg-white/70 shadow-xl rounded-2xl p-8 relative">
          {/*bar show progress*/}
          <div className="absolute top-0 left-0 w-full h-2 bg-gray rounded-t-xl overflow-hidden">
            <div className="bg-blue-500 transition-all h-full " style={ {width: `${progressPercent}%`}}/>
          </div>
          {children}
        </div>
      </div>
    </ProfileFormProvider>
  )
}