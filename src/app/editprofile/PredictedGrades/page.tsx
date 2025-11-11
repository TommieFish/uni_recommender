"use client"

import {useEffect, useState } from "react";
import SettingsTabs from "@/components/SettingsTabs";
import {getSupabase } from "@/lib/supabase/client";

type Grade= {subject : string; grade:string}

export default function MyGradesPage()
{
  const [grades, setGrades ] = useState<Grade[]>([
    {subject: "", grade :""},
    {subject: "", grade :""},
    {subject: "", grade :""},
    {subject: "", grade :""},
  ]);
  const[loading,setLoading] = useState(false);
  const[ status, setStatus ] = useState("");
  const [hasProfile, setHasProfile] = useState(true);

  useEffect(() => {
    //gets data and sets it to corresponding variables
    async function load()
    {
        const supabase = await getSupabase();
        const {data : { user }} = await supabase.auth.getUser();
      //uses MaybeSingle as possible array doesn't exist, but will only have max of 1 array
      const {data : student_grades, error } = await supabase
        .from("students")
        .select("predicted_grades")
        .eq("user_id", user?.id)
        .maybeSingle()

      if (error || ! student_grades)
      {
        console.log("Error fetching predicted grades:", error?.message || "No user data.");
        setHasProfile(false);
        return null;
      }
      if (student_grades?.predicted_grades)
      {
        setGrades(student_grades.predicted_grades);
      }
    };
    load()
  }, []);

  //updates the value of grade or subject for a specific index of original grades field. field specifies grade/subject.
  const handleGradeSubjectChange = (index :number, field: keyof Grade, value : string) =>{
    setGrades(prev => {
      const updated =[...prev];
      updated[index]= { ...updated[index], [field] : value};
      return updated
    })
  }


  async function update()
  {
    setLoading(true);

     if(!hasProfile)
      { 
        setStatus("Failed. Your account does not exist in the database. Please delete your account and re sign up.");
        setLoading(false);
      }
    else
    {
      try
      {
        const supabase = await getSupabase();
        const {data : { user }, error : authError} = await supabase.auth.getUser();
        if (authError || !user)
        {
          console.error("Auth Error: ", authError?.message || "No user found!");
          alert("Auth failed. Log in again.");
          return null;
        }

        const { error : updateError} = await supabase
          .from("students")
          .update({predicted_grades:grades, updated_at : new Date().toISOString(),})
          .eq("user_id", user.id)
        

        if (updateError )
        {
          console.error("Error updating database: ", updateError)
          alert("Update failed. Try again.");
        }
        else
        {
          setStatus("Updated!");
          fetch("/api/generate-student-vector", {method: 'POST' })
            .then(() => {console.log("Student vector generation complete");})
            .catch((error) => {console.error("Student vector generation failed. :(", error);});
        }
      }
      
      catch (error)
      {
        console.error("Unknown error: ",error);
        alert("Something went wrong. Try again!");
      }
      finally { setLoading(false);}
    }
  }

  return (
    <div className="relative z-[1]">
      <div className="max-w-2xl mx-auto px-10 sm:px-15 py-6">
        <SettingsTabs />  {/* inbuilt Navbar for editing profiles*/}
        <section  className="rounded-xl bg-white text-gray-500 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">Predicted Grades</h2>
          <table className="bg-gray-100 text-left text-sm text-gray-600">
            <thead className="text-left text-sm bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Grade</th>
              </tr>
            </thead>



            <tbody>
              {grades.map((grade, index) =>(
                <tr key={index} className="border-t">
                  {/* subject*/}
                  <td className="px-4 py-2">
                    <input
                      value={grade.subject}
                      onChange={subject => handleGradeSubjectChange(index, "subject", subject.target.value)}
                      className="border rounded w-full px-2 py-1"
                    />
                  </td>

                  {/*grade */}
                  <td className="py-2 px-4">
                    <select
                      value={grade.grade}
                      onChange={chosen_grade => handleGradeSubjectChange(index, "grade", chosen_grade.target.value)}
                      className="border rounded w-full px-2 py-1"
                    >
                      <option value="">Select grade</option>
                      {["A*", "A", "B", "C", "D", "E", "F", "U"].map(g => (
                        <option
                          key={g}
                          value={g}>{g}
                        </option>
                      ))}
                    </select>
                  </td> 
                </tr>
              ))}
            </tbody>
          </table>

          {/* button*/}
          <div className="flex justify-end">
            <button
              onClick={update}
              disabled={loading}
              className= {`rounded font-semibold px-6 py-2 text-white ${ loading? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
              >{loading ?"Saving..." :"Update"}
            </button>
          </div>
          <div>
          {status &&( <p className="text-center text-sm text-gray-600">{status}</p>)} {/* Display status*/}
          </div>
        </section>
      </div>
    </div>
  )
}