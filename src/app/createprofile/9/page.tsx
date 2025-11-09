"use client"

import{useProfileForm } from "../context/ProfileFormContext";
import { useRouter} from "next/navigation";
import {useState } from "react"

export default function EnterWantedClubs()
{
  const {wantedClubCount,setWantedClubCount}  = useProfileForm();
  const[error,setError] = useState("");
  const router = useRouter();

  const isValid = wantedClubCount > 0;

  function Next()
  {
    if (!isValid)
    {
      setError("Please enter the number of clubs.");
      return null;
    }
    else router.push("/createprofile/10");
  }

  function Back()
  {
    router.push("/createprofile/8");
  }

  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <h1 className="font-bold text-3xl text-blue-700">What is the total number of clubs you would like at your university?</h1>
      <p className="text-sm text-gray-600">Max of 600</p>
      <div className="flex items-center w-full max-w-3xl gap-20 justify-center">
        {/* Back*/}
        <button
        onClick={Back}
        className="flex items-center justify-center rounded-full w-20 h-20 bg-blue-500 hover:bg-blue-600 shadow-xl text-4xl text-black font-bold"
        aria-label="Previous"
        >←</button>

      {/* Input for num clubs*/}
      <input
        type="number"
        value={wantedClubCount ===0 ? "" : wantedClubCount.toString()}
        max="600"
        min="0"
        onChange={(club_count) => {
          const value = parseInt(club_count.target.value, 10);
          const clampedValue = isNaN(value) ? 0 : Math.min(value, 600);
          setWantedClubCount(isNaN(clampedValue) ? 0 : clampedValue)
          setError("")}
        }
        placeholder = "Number of clubs"
        className={`border rounded-xl p-4 shadow-md w-3/5 focus:outline-none focus:ring-2 text-center text-lg ${!isValid ? "border-red-500 focus:ring-red-400" :"border-blue-300 focus:ring-blue-400"}`}>
      </input>

      {/* Next*/}
      <button
        onClick ={Next}
        disabled= {!isValid }
        className={`w-20 h-20 flex items-center justify-center rounded-full text-4xl text-black font-bold shadow-xl transition-colors duration-200 ${isValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
        aria-label="Next">
        →
      </button>
    </div>
        
    {error && <p className="text-red-500 text-sm">{error}</p>} 
    </div>
  )
}