"use client"

import{useProfileForm } from "../context/ProfileFormContext";
import { useRouter} from "next/navigation";
import {useState } from "react"

export default function EnterAbroadOrPlacementYear()
{
  const {placementOrAbroadYear, setPlacementOrAbroadYear}  = useProfileForm();
  const[error,setError] = useState("");
  const router = useRouter();

  const isValid = typeof placementOrAbroadYear === "boolean";

  function Next()
  {
    if (!isValid)
    {
      setError("Please enter if you want a placement or gap year.");
      return null;
    }
    else router.push("/createprofile/12");
  }

  function Back()
  {
    router.push("/createprofile/10");
  }

  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <h1 className="font-bold text-3xl text-blue-700">Do you want your course to have a placement or abroad year?</h1>
      <p className="text-sm text-gray-500">If you enter yes, you will be more likely to be recommended courses with placement/abroad years (they will cost more overall as 1 extra year).</p>
      <div className="flex items-center w-full max-w-3xl gap-20 justify-center">
        {/* Back*/}
        <button
        onClick={Back}
        className="flex items-center justify-center rounded-full w-20 h-20 bg-blue-500 hover:bg-blue-600 shadow-xl text-4xl text-black font-bold"
        aria-label="Previous"
        >←</button>

      {/* Select dropdown */}
      <select
        value={placementOrAbroadYear === true ? "true" : placementOrAbroadYear === false ? "false" : ""}
        onChange={(e) => {
            const value = e.target.value;
            if (value === "true") setPlacementOrAbroadYear(true);
            else if (value === "false") setPlacementOrAbroadYear(false);
            else setPlacementOrAbroadYear(undefined as any);
            setError("");
          }}
        className={`border rounded-xl p-4 shadow-md w-3/5 focus:outline-none focus:ring-2 text-center text-lg ${!isValid ? "border-red-500 focus:ring-red-400" :"border-blue-300 focus:ring-blue-400"}`}
        >
          <option value="">Select One</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
      </select>

      {/* Right*/}
      <button
        onClick={Next}
        disabled={!isValid}
        className= {`flex items-center justify-center rounded-full text-4xl w-20 h-20 text-4xl text-black font-bold shadow-xl transition-colors duration-200 ${isValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
        aria-label="Next"
      >→</button>

    </div>
    {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
