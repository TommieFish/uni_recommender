"use client"

import {useEffect, useState } from "react";
import SettingsTabs from "@/components/SettingsTabs";
import {getSupabase } from "@/lib/supabase/client";

export default function MyAccountPage()
{
   // one form with fields for easier access and updates (as have many fields)
  const [form, setForm ] = useState({
    preferred_campus_type : "",
    preferred_assessment_type:"" ,
    course_for_uni : "",
    accommodationBudget:0,
    wanted_club_count : 0,
    distance_from_home: 0,
    has_entrance_test : false,
    placement_or_abroad_year: false,
  });
  const [courseOptions,setCourseOptions] = useState<string[]>([]);
    
  const [ loading, setLoading] = useState(false);
  const [status, setStatus ] = useState("");
  const [hasProfile, setHasProfile] = useState(true);

  useEffect(() => {
    //gets data and sets it to corresponding variables
    async function load()
    {
        try
        {
            const supabase = await getSupabase();
            const {data : { user }} = await supabase.auth.getUser();
            //uses MaybeSingle as possible array doesn't exist, but will only have max of 1 array
            const {data : personal_data, error } = await supabase
                .from("students")
                .select("*")
                .eq("user_id", user?.id)
                .maybeSingle()

            if (error || ! personal_data)
            {
              setHasProfile(false);
              console.log("Error fetching data:", error?.message || "No user data.");
              return null;
            }  
        
            const {data : course_names, error : courseError } = await supabase
                .from("course")
                .select("name")
                .eq("currently_available", true)

            if (error || ! personal_data)
            {
                console.error("Error fetching course names:", courseError?.message || "No user data.");
                return null;
            }

            if(personal_data)
            {
                setForm({
                    preferred_campus_type: personal_data.preferred_campus_type || "",
                    preferred_assessment_type : personal_data.preferred_assessment_type || false,
                    course_for_uni: personal_data.course_for_uni || "",
                    accommodationBudget : personal_data.wanted_budget || 0 ,
                    wanted_club_count : personal_data.wanted_club_count || 0,  
                    distance_from_home : personal_data.distance_from_home || 0,
                    has_entrance_test:personal_data.has_entrance_test || false,
                    placement_or_abroad_year: personal_data.placement_or_abroad_year || false,
                });
            }
            if(course_names)
            {
                setCourseOptions(course_names.map(names => names.name));
            }
        }
        catch(error)
        {
            console.error("Unknown error when updating  variables: ", error);
            alert("Something went wrong.");
        }
    };
    load()
  }, []);

  function handleChange(field : keyof typeof form, value : any)
  {
    setForm(prev => ({ ...prev , [field]:value}));
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
          .update({
              preferred_campus_type : form.preferred_campus_type,
              preferred_assessment_type :form.preferred_assessment_type,
              course_for_uni : form.course_for_uni,
              wanted_budget: form.accommodationBudget + 9000,
              wanted_club_count :form.wanted_club_count,
              distance_from_home: form.distance_from_home,
              has_entrance_test: form.has_entrance_test,
              placement_or_abroad_year : form.placement_or_abroad_year,
              updated_at : new Date().toISOString(),
          })
          .eq("user_id", user.id)
        

        if  (updateError )
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <SettingsTabs />  {/* inbuilt Navbar for editing profiles*/}

        {/*Campus */}
        <section  className="rounded-xl bg-white text-gray-500 p-6 space-y-6">
          <div> 
            <label className="text-sm text-gray-500 block">Preferred Campus</label>
            <select className = "border w-full rounded px-4 py-2"
              value={form.preferred_campus_type}
              onChange={entered_campus_type => handleChange("preferred_campus_type", entered_campus_type.target.value)}
              >
                <option disabled value="">Select One</option>
                <option value="Campus">Campus</option>
                <option value="City">City</option>
            </select>
          </div>

        {/*Assessment*/}
        <div> 
            <label className="text-sm text-gray-500 block">Assessment Style (Exams or Coursework)</label>
            <select className = "border w-full rounded px-4 py-2"
              value={form.preferred_assessment_type ? "Exams" : "Coursework"}
              onChange={entered_assessment_type => handleChange("preferred_assessment_type", entered_assessment_type.target.value === "Exams")}
              >
                <option value="Exams">Exams</option>
                <option value="Coursework">Coursework</option>
              </select>
          </div>

        {/* Course*/}
        <div> 
        <label className="text-sm text-gray-500 block">Preferred Course</label>
        <select className = "border w-full rounded px-4 py-2"
            value={form.course_for_uni}
            onChange={entered_course => handleChange("course_for_uni", entered_course.target.value)}
            >
            <option disabled value="">Select a course</option>
            {courseOptions.map(course => (
                <option
                    key={course}
                    value={course}
                    >{course}
                </option>
            ))}
        </select>
        </div>

        {/*Budget */}
        <div> 
            <label className="text-sm text-gray-500 block">Accommodation Budget</label>
            <input className = "border w-full rounded px-4 py-2"
              type="number"
              value={form.accommodationBudget}
              onChange={entered_budget => handleChange("accommodationBudget", +entered_budget.target.value)}
            />
        </div>

        {/*Clubs */}
        <div> 
            <label className="text-sm text-gray-500 block">Total Wanted Club Count</label>
            <input className = "border w-full rounded px-4 py-2"
              value={form.wanted_club_count}
              onChange={entered_club_count => handleChange("wanted_club_count", +entered_club_count.target.value)}
            />
        </div>

        {/*Entrance Test */}
        <div> 
            <label className="text-sm text-gray-500 block">Do you mind if there is an entrance test?</label>
            <select className = "border w-full rounded px-4 py-2"
              value={form.has_entrance_test ? "Yes" :"No"}
              onChange={entrance_test => handleChange("has_entrance_test", entrance_test.target.value ==="Yes")}
            >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>
        </div>

        {/* Placement & Abroad Years*/}
        <div> 
            <label className="text-sm text-gray-500 block">Placement or Abroad Year Preferred?</label>
            <select className = "border w-full rounded px-4 py-2"
              value={form.placement_or_abroad_year ? "Yes": "No"}
              onChange={year => handleChange("placement_or_abroad_year", year.target.value)}
            >
                <option value= "Yes">Yes</option>
                <option value="No">No</option>
            </select>
        </div>

        {/* Distance */}
        <div> 
            <label className="text-sm text-gray-500 block">Average Wanted Distance from Home</label>
            <input className = "border w-full rounded px-4 py-2"
              value={form.distance_from_home}
              onChange={distance => handleChange("distance_from_home", +distance.target.value)}
            />
        </div>      

        <div className="flex justify-end">
            <button
              onClick={update}
              disabled={loading}
              className= {`rounded font-semibold px-6 py-2 text-white ${ loading? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
              >{loading ?"Saving..." :"Update"}
            </button>
          </div>
          {status &&( <p className="text-center text-sm text-gray-600">{status}</p>)} {/* Display status*/}
        </section>
      </div>
    </div>
  )
}