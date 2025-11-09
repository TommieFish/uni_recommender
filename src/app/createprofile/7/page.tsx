"use client"

import{useProfileForm } from "../context/ProfileFormContext";
import { useRouter} from "next/navigation";
import {useState } from "react"

export default function EnterPreferredAssessment()
{
  const {preferredAssessment,setPreferredAssessment}  = useProfileForm();
  const[error,setError] = useState("");
  const router = useRouter();

  const length = preferredAssessment.trim().length;
  const isValid = length > 0;

  function Next()
  {
    if (!isValid)
    {
      setError("Please enter your preferred assessment type.");
      return null;
    }
    else router.push("/createprofile/8");
  }

  function Back()
  {
    router.push("/createprofile/6");
  }

  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <h1 className="font-bold text-3xl text-blue-700">What is your preferred assessment type?</h1>
      <p className="text-sm text-gray-500">Choose the assessment type you would prefer to have for the majority of your uni life</p>
      <div className="flex items-center w-full max-w-3xl gap-20 justify-center">
        {/* Back button*/}
        <button
        onClick={Back}
        className="flex items-center justify-center rounded-full w-20 h-20 bg-blue-500 hover:bg-blue-600 shadow-xl text-4xl text-black font-bold"
        aria-label="Previous"
        >←</button>

      {/* Select dropdown */}
      <select
        value={preferredAssessment}
        onChange={(assessment_type) => (setPreferredAssessment(assessment_type.target.value), setError(""))}
        className={`w-2/5 border rounded-xl p-4 shadow-md focus:outline-none focus:ring-2 transition-all duration-200 text-center text-lg ${ error ? "border-red-500 focus:ring-red-400" : "border-blue-300 focus:ring-blue-400"}`}>
          <option value="">Select One</option>
          <option value="Exams">Exams</option>
          <option value="Coursework">Coursework</option>
      </select>
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