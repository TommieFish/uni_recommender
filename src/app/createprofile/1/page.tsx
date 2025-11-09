"use client"

import{useProfileForm } from "../context/ProfileFormContext";
import { useRouter} from "next/navigation";
import {useState } from "react"

export default function EnterName()
{
  const {name,setName}  = useProfileForm();
  const[error,setError] = useState("");
  const router = useRouter();

  const length = name.trim().length;
  const isValid = length > 0;

  function Next()
  {
    if (!isValid)
    {
      setError("Please enter your full name.");
      return null;
    }
    router.push("/createprofile/2");
  }

  function Back()
  {
    router.push("/createprofile");
  }

  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <h1 className="font-bold text-3xl text-blue-700">What is your full name?</h1>
      <div className="flex items-center w-full max-w-3xl gap-20 justify-center">
        {/* Back button*/}
        <button
        onClick={Back}
        className="flex items-center justify-center rounded-full w-20 h-20 bg-blue-500 hover:bg-blue-600 shadow-xl text-4xl text-black font-bold"
        aria-label="Previous"
        >←</button>

        {/* Input for name*/}
        <input
          value={name}
          onChange={(nameBox) => {setName(nameBox.target.value), setError("")}}
          placeholder = "Enter your name"
          className={`border rounded-xl p-4 shadow-md w-3/5 focus:outline-none focus:ring-2 text-center text-lg ${!isValid ? "border-red-500 focus:ring-red-400" :"border-blue-300 focus:ring-blue-400"}`}>
        </input>

        {/* Next button */}
        <button
          onClick={Next}
          disabled={!isValid}
          className={`w-20 h-20 flex items-center justify-center rounded-full text-4xl text-black font-bold shadow-xl transition-colors duration-200 ${isValid === true ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
          aria-label="Next">
          →
        </button>
      </div>

    {/* Shows error text if is an error */}
    {error && <p className="text-red-500 text-sm">{error}</p>} 
    </div>
  )


}