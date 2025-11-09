"use client"

import {useRouter } from"next/navigation";
import { useEffect } from "react";

export default function CreateProfileLanding()
{
  const router = useRouter();

  useEffect(() => {
    router.refresh(); //refresh navbar, so people can see admin
  }, [])

  return (
    <div className="flex flex-col items-center text-center space-y-6 w-full px-4">
      <div className="w-full max-w-md">
        <h1 className = "text-3xl font-bold text-indigo-700 max-w-3xl mb-4">Create your Profile</h1>
        <p className ="text-gray-600 mb-6">Answer a few questions to create a personalised university recommendation list</p>
        <button
          onClick={() => router.push("/createprofile/1")}
          className="w-full text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-5 rounded-xl font-semibold shadow text-center"
          >Start Quiz
        </button>
      </div>
    </div>
  )
}