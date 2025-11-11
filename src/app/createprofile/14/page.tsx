"use client"

import {useProfileForm } from "../context/ProfileFormContext";
import { useRouter } from "next/navigation";
import {useState } from "react";
import {getSupabase } from "@/lib/supabase/client";

export default function display()
{
  //values
  
  const 
  {
    name,
    location,
    address,
    predictedGrades,
    preferredCampus,
    preferredCourse,
    preferredAssessment,
    accommodationBudget,
    wantedClubCount,
    entranceTest,
    placementOrAbroadYear,
    distanceFromHome,
    wantedStudentCount
  } = useProfileForm();

  console.log("Name", name);

  const router = useRouter();
  const[loading,setLoading ] = useState(false);
  const [ submitted, setSubmitted] = useState(false);

  async function Submit()
  {
    /*
    if (
      !name ||
      !location ||
      !predictedGrades?.length ||
      !preferredCourse ||
      !preferredAssessment ||
      accommodationBudget === null ||
      wantedClubCount === null ||
      entranceTest === null ||
      placementOrAbroadYear === null ||
      distanceFromHome === null ||
      wantedStudentCount === null
    )
    {
      alert("Please complete all fields before submitting");
      setLoading(false);
      return;
    }
      */


    setLoading(true);
    const supabase = await getSupabase();

    const { data: {user}, error : authError} = await supabase.auth.getUser();

    if (authError || !user)
    {
      console.error("Authentication error. Error:", authError?.message || "No user found");
      return null;
    }

    const studentID = user.id;
    console.log(studentID);
    console.log("text")
    
    //update student preferences
    try {
      const { error : updateError } = await supabase
        .from("students")
        .update({
          name,
          location,
          address,
          predicted_grades: predictedGrades,
          preferred_campus_type: preferredCampus,
          preferred_assessment_type: preferredAssessment,
          course_for_uni: preferredCourse,
          wanted_club_count: wantedClubCount,
          has_entrance_test: entranceTest,
          wanted_budget: accommodationBudget + 9000,
          placement_or_abroad_year: placementOrAbroadYear,
          distance_from_home: distanceFromHome,
          updated_at: new Date().toISOString(),
          wanted_num_students: wantedStudentCount
        })
        .eq("user_id", studentID);
      if (updateError)
      {
        console.error("Error updating your profile", updateError?.message);
        alert("Update failed. Try again. ");
      }
      else setSubmitted(true);
    } 
    catch (error)
    {
      console.error("Unknown error", error);
      alert("Something went wrong!");
    }
    finally
    {
      setLoading(false);
      fetch('/api/generate-student-vector', {method: 'POST'})
        .then(() => {
          console.log("student Vector Creation completed");
        })
        .catch((error) => {
          console.error("Student vector generation failed!", error)
        })
    }
  };

  function Back()
  {
    router.push("/createprofile/13");
  }
  const totalBudget = accommodationBudget + 9000; //forPrint 

  if(submitted)
  {
    return (
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-green-600">Profile Created!</h1>
        <p className="text-gray-700">Thank you, {name}. Your preferences have been saved.</p>
        <button
          onClick={() => router.push("/profile")}
          className="w-full max-w-md bg-blue-600 text-white py-3 px-5 rounded-xl font-semibold shadow-md hover:bg-indigo-500 transition-colors duration-300"
          >Return to Profile
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <h1 className="text-3xl font-bold text-blue-700 px-4 py-3">Review your profile</h1>
      <div className="text-left w-full max-w-md space-y-3 text-sm text-gray-700">
        <div><strong>Name: </strong> {name}</div>
        <div><strong>Location: </strong> {location}</div>
        <div><strong>Address: </strong> {address}</div>
        <div><strong>Predicted Grades: </strong>
          <ul className="list-disc ml-5">
            {predictedGrades
              .filter(predicted_grade => predicted_grade.subject && predicted_grade.grade)
              .map((predicted_grade, index) => (
                <li key = {index}>{predicted_grade.subject} : {predicted_grade.grade}</li>
              ))}
          </ul>
        </div>
        <div><strong>Preferred Campus: </strong> {preferredCampus}</div>
        <div><strong>Preferred Assessment Style: </strong> {preferredAssessment}</div>
        <div><strong>Course: </strong> {preferredCourse}</div>
        <div><strong>Total Number Clubs wanted: </strong>{wantedClubCount}</div>
        <div><strong>Minds Entrance Test: </strong>{entranceTest ? "Yes" : "No"}</div>
        <div className="pt-4">
          <strong>Total Yearly Budget: </strong>£{totalBudget.toLocaleString()}
          <ul className="list-disc ml-5 mt-1 text-gray-600">
            <li>Accommodation: £{accommodationBudget.toLocaleString()}</li>
            <li>Tuition Fees: £9000</li>
          </ul>
        </div>
        <div><strong>Wanted num students:</strong> {wantedStudentCount}</div>
      </div>

        <div className="flex items-center w-full max-w-3xl gap-20 justify-center">
          {/* Back*/}
          <button
            onClick={Back}
            className="flex items-center justify-center rounded-full w-20 h-20 bg-blue-500 hover:bg-blue-600 shadow=xl text-4xl text-black font-bold"
            aria-label="Previous"
          >←</button>

        {/*Submit */}
        <button
          onClick={Submit}
          disabled={loading}
          className= {`flex items-center justify-center rounded-full text-4xl w-20 h-20 text-4xl text-black font-bold shadow-xl transition-colors duration-200 ${!loading ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
          aria-label="Submit"
          >{loading ? "..." : "✓"}
        </button>
      </div>
    </div>
  );
}