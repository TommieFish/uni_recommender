"use client"

import {useProfileForm } from "../context/ProfileFormContext";
import { useRouter } from "next/navigation";
import {useState, useEffect} from "react";
import {getSupabase } from "@/lib/supabase/client";

type Grade = 
{ 
  subject : string
  grade : string
};

export default function GetPredictedGrades()
{
  const{predictedGrades, setPredictedGrades} = useProfileForm();
  const router = useRouter();
  const [error, setError ] = useState("");
  const  [courses, setCourses] = useState<{id: string; name:string}[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    //fixes error of having an async default function inside of a "use client"
    const fetchCourses = async() => {
      const supabase = getSupabase();
  
      //fetches courses for user to input their predicted grades
      const { data, error : courseFetchError} = await supabase
        .from("alevel_courses")
        .select("id, name")
      
      if (courseFetchError)
      {
        console.error("Error fetching courses: ", courseFetchError.message);
        setCourses([]);
      }
      else
      {
        setCourses(data || []);
      }
      setLoading(false)
    }

    fetchCourses();
    
  }, [])


  //updates the predicted grade. Field is either subject or grade
 const handleChange = (i: number, field: keyof Grade, value: string) => {
    const updated = [...predictedGrades]
    updated[i] = { ...updated[i], [field]: value }
    setPredictedGrades(updated)
  }


  //only allows next page if at least 3 gradicted grade subject pairs are given
  function Next()
  {
    const filled = predictedGrades.filter(predicted_grade => predicted_grade.subject.trim() && predicted_grade.grade.trim());
    if (filled.length < 3)
    {
      setError("Please enter at least 3 subjects");
      return;
    }

    //no duplicate subjects
    const subjects = filled.map(predicted_grade => predicted_grade.subject.trim().toLowerCase());
    const hasDuplicates = new Set(subjects).size!== subjects.length; // a set would remove duplicates, so len would change

    if (hasDuplicates)
    {
      setError("Duplicate subjects are ot allowed.");
      return;
    }

    setError("");
    router.push("/createprofile/5");
  }

  function Back()
  {
    router.push("/createprofile/3");
  }

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <h1 className="text-3xl text-blue-500 font-bold text-center">Enter your predicted Grades</h1>

      {/* table with a list of options*/}
      {predictedGrades.map((predicted_grade : Grade, index : number) => (
        <div key={index} className="flex justify-center gap-4">

          {/* selects subject for grade*/}
          <select
            value={predicted_grade.subject}
            onChange={(subject) => handleChange(index, "subject", subject.target.value)}
            className="w-3/5 border rounded-xl p-3 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
            >
              <option value="">Select Subject</option>
              {courses.map((course) => (
                <option 
                  key={course.id}
                  value = {course.name}
                  >{course.name}
                </option>
              ))}   
            </select>

            {/* selects grade for subject*/}
            <select
              value={predicted_grade.grade}
              onChange={(grade) => handleChange(index, "grade", grade.target.value)}
              className = "w-24 border rounded-xl p-3 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-center bg-white"
              >
                <option value="">Grade</option>
                <option value="A*">A*</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="U">U</option>
            </select>
          </div>
      ))}
        {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex items-center justify-center w-full max-w-3xl gap-20 mt-4">
        {/* Back button*/}
        <button
          onClick={Back}
          className="flex items-center justify-center rounded-full w-20 h-20 bg-blue-500 hover:bg-blue-600 shadow-xl text-4xl text-black font-bold"
          aria-label="Previous"
          >←
        </button>

        {/* Next button */}
        <button
          onClick={Next}
          disabled={predictedGrades.filter(pg => pg.subject.trim() && pg.grade.trim()).length < 3}
          className={`w-20 h-20 flex items-center justify-center rounded-full text-4xl text-black font-bold shadow-xl transition-colors duration-200 ${predictedGrades.filter(pg => pg.subject.trim() && pg.grade.trim()).length >= 3 ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
          aria-label="Next">
          →
        </button>
      </div>
    </div>
  )
}