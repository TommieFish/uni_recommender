export const dynamic = "force-dynamic";

import{Suspense } from "react";
import { getSupabase } from "@/lib/supabase/server";
import ProfileView from "./ProfileView";

export default async function ProfilePage()
{
  const supabase = await getSupabase();
  const {data : {user}, error : authenticationError} = await supabase.auth.getUser();


  if (authenticationError || !user)
  {
    console.error("Auth error : ", authenticationError?.message|| "User not found");
    return <p>Sign in to view profile.</p>
  }

  const {data : student, error} = await supabase
    .from("students")
    .select("user_id, name, email, location")
    .eq("user_id", user?.id)
    .maybeSingle();

  const { data :recommendations, error: recommendationError } = await supabase
    .from("student_recommendation" )
    .select("id, date_recommended, name")
    .eq("user_id",  user?.id)
    .order("date_recommended",{ ascending:false})

  if (error || student === null)
  {
    console.log("Error fetching student details: ", error?.message || "Student not found");
    return <p className="text-gray-700 dark:text-gray-400">Could not load student profile. Please delete your profile and sign up again. Otherwise, please contect UniRecommender.</p>
  }

  if (recommendationError || !recommendations)
  {
    console.error("Error fetching recommendation details: ", recommendationError?.message || "Recommendation list not found");
    return <p>{user?.id}: Could not load recommendations. - Error: {recommendationError?.message}</p>
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="relative z-[1]">
        <ProfileView 
          student={student}
          recommendations={recommendations } 
        />
      </div>
    </Suspense>
  )
  
}