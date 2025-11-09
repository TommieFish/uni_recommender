"use client"

import{useProfileForm } from "../context/ProfileFormContext";
import { useRouter} from "next/navigation";
import {useState } from "react"

export default function EnterCity()
{
  const {location,setLocation}  = useProfileForm();
  const[error,setError] = useState("");
  const router = useRouter();

  const length = location.trim().length;
  const isValid = length > 0;

  function Next()
  {
    if (!isValid)
    {
      setError("Please enter your city.");
      return null;
    }
    else router.push("/createprofile/3");
  }

  function Back()
  {
    router.push("/createprofile/1");
  }

  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <h1 className="font-bold text-3xl text-blue-700">What city do you live in?</h1>
      <div className="flex items-center w-full max-w-3xl gap-20 justify-center">
        {/* Back button*/}
        <button
        onClick={Back}
        className="flex items-center justify-center rounded-full w-20 h-20 bg-blue-500 hover:bg-blue-600 shadow-xl text-4xl text-black font-bold"
        aria-label="Previous"
        >←</button>

        {/* Input for name*/}
        <input
          value={location}
          onChange={(nameBox) => {setLocation(nameBox.target.value), setError("")}}
          placeholder = "Enter your city"
          className={`border rounded-xl p-4 shadow-md w-3/5 focus:outline-none focus:ring-2 text-center transition-colors duration-200 text-lg ${!isValid ? "border-red-500 focus:ring-red-400" :"border-blue-300 focus:ring-blue-400"}`}>
        </input>

        {/* Next button */}
        <button
          onClick={Next}
          disabled={!isValid}
          className={`w-20 h-20 flex items-center justify-center rounded-full text-4xl text-black font-bold shadow-xl transition-colors duration-200 ${isValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
          aria-label="Next">
          →
        </button>
      </div>
          
      {error && <p className="text-red-500 text-sm">{error}</p>} 
    </div>
  )


}