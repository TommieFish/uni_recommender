export const dynamic= "force-dynamic";

import{Suspense } from "react";
import { getSupabase } from "@/lib/supabase/server";
import ProfileView from "./ProfileView";

export default async function ProfilePage()
{
  const supabase =await getSupabase();
  const{data:{user}, error:authenticationError} = await supabase.auth.getUser();

  if (authenticationError || !user)
  {
    console.error("User not found");
    console.log("Auth error:", authenticationError?.message);
    return <p>Sign in to view your profile</p>
  }


  const {data: studentData, error} = await supabase
    .from("students")
    .select("user_id, name, email, location")
    .eq("user_id", user?.id)
    .maybeSingle()

  const { data :recommendations,error: recommendationError } = await supabase
    .from("student_recommendation" )
    .select("id, date_recommended, name")
    .eq("user_id",  user?.id)
    .order("date_recommended",{ ascending:false})

  if (error || !studentData)
  {
    console.log("Error fetching student details: ", error?.message || "Student not found");
    return <p className="text-gray-700 dark:text-gray-500">Could not load your profile. Please delete your account and sign up again. If this doesnt work, please contact Uni Recommender</p>
  }

  if (recommendationError || !recommendations)
  {
    console.log("Error fetching student details: ", recommendationError?.message || "Recommendation List not found");
    return <p className="text-gray-700 dark:text-gray-500">Your recommendations could not be loaded. Please refresh the page or sign out and sign back in again if this does not work.</p>
  }

  return (
    <Suspense fallback = {<div className= "text-gray-800 dark:text-gray-300  text-2xl text-bold">Loading Profile</div>}>
      <div className="relative z-[1]">
        <ProfileView
          student ={studentData }
          recommendations= {recommendations}
        />
      </div>
    </Suspense>
  )
}