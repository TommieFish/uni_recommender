"use client"

import{useProfileForm } from "../context/ProfileFormContext";
import { useRouter} from "next/navigation";
import {useState } from "react"

export default function EnterAddress()
{
  const {address,setAddress}  = useProfileForm();
  const[error,setError] = useState("");
  const router = useRouter();

  const isValid = address.trim().length >= 0


  function Next()
  {
    if(!isValid)
    {
      setError("Please enter your address");
      router.push("/createprofile/4");
      return;
    }
    setError("")
    console.log("Next clicked.")
    router.push("/createprofile/4");
  }

  function Back()
  {
    router.push("/createprofile/2");
  }

  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <h1 className="font-bold text-3xl text-blue-700">What is your address?</h1>
      <p className="text-xl text-gray-400">(optional)</p>
      <div className="flex items-center w-full max-w-3xl gap-20 justify-center">
        {/* Back button*/}
        <button
        onClick={Back}
        className="flex items-center justify-center rounded-full w-20 h-20 bg-blue-500 hover:bg-blue-800 shadow-xl text-4xl text-black font-bold"
        aria-label="Previous"
        >←</button>

        {/* Input for name*/}
        <input
          value={address}
          onChange={(nameBox) => {setAddress(nameBox.target.value); setError("")}}
          placeholder = "House number, street"
          className="border rounded-xl p-4 shadow-md w-2/5 focus:outline-none focus:ring-2 text-center text-lg">
        </input>

        {/* Next button */}
        <button
          onClick={Next}
          disabled={!isValid}
          className={`w-20 h-20 flex items-center justify-center rounded-full text-4xl text-black font-bold shadow-xl transition-colors duration-200 ${isValid? "bg-blue-500 hover:bg-blue-600": "bg-gray-400 cursor-not-allowed"}`}
          aria-label="Next">
          →
        </button>
      </div>
        
      {/* Shows error text if is an error */}
      {error && <p className="text-red-500 text-sm">{error}</p>} 
    </div>
  )
}