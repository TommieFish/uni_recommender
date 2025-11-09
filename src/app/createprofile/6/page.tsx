"use client"

import {useCourses } from "@/hooks/useCourses"
import{useProfileForm } from "../context/ProfileFormContext";
import { useRouter} from "next/navigation";
import {useState } from "react"

export default function EnterPreferredCourse()
{
  const {preferredCourse,setPreferredCourse}  = useProfileForm();
  const[error,setError] = useState("");
  const[showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const courses = useCourses();

  const length = preferredCourse.trim().length;
  const isValid = (length > 0) && courses.includes(preferredCourse.trim());

  function Next()
  {
    if (!isValid)
    {
      setError("Please enter your course.");
      return null;
    }
    else router.push("/createprofile/7");
  }

  function Back()
  {
    router.push("/createprofile/5");
  }


  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">Your Course For Recommendation</h1>
      <p className="text-sm text-gray-500">Which course are you planning on taking?</p>
      <p className="text-sm text-gray-500">Unfortunately, urrently only works for Computer Science, Physics and Mechanical Engineering</p>

      <div className="flex items-center justify-center w-full max-w-3xl gap-20">
        {/* Back button*/}
        <button
          onClick={Back}
          className="flex items-center justify-center rounded-full w-20 h-20 bg-blue-500 hover:bg-blue-600 shadow-xl text-4xl text-black font-bold transition-colors duration-200"
          aria-label="Previous"
          >←  
        </button>

        {/* uni Input w. search*/}
        <div className="relative w-3/5">
          <input
            type="text"
            value={preferredCourse}
            onChange={(course) => (setPreferredCourse(course.target.value), setError(""), setShowDropdown(true))}
            className={`border rounded-xl p-4 shadow-md w-full focus:outline-none focus:ring-2 text-center text-lg transition-colors duration-200 ${!isValid ? "border-red-500 focus:ring-red-400" :"border-blue-300 focus:ring-blue-400"}`}
            placeholder = "Search course..."
          />
            {/* dropdown*/}
            {preferredCourse && showDropdown &&(
              <ul className = "absolute z-10 mt-1 w-full bg-white/80 border border-blue-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {courses.filter((name) => name.toLowerCase().startsWith(preferredCourse.toLowerCase()))
                  .map((name) => (
                    <li
                      key={name}
                      onClick={() => {setPreferredCourse(name); setShowDropdown(false);}}
                      className="px-4 py-2 cursor-pointer hoverLbg-blue-200 text-center"
                      >{name}
                    </li>
                  ))
                }
              </ul>
            )}
        </div>

        {/* Next button */}
        <button
          onClick={Next}
          disabled={!isValid}
          className={`w-20 h-20 flex items-center justify-center rounded-full text-4xl text-black font-bold shadow-xl transition-colors duration-200 ${isValid === true ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
          aria-label="Next">
          →
        </button>
      </div>
            
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}