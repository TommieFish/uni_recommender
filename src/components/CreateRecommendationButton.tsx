"use client"

import {useRouter } from "next/navigation";
import {getSupabase} from "@/lib/supabase/client";
import {toast } from "sonner";

type CreateRecommendationButtonProps=
{
  classNameInput?:string
  text:string
}

export function CreateRecommendationButton({classNameInput = "!bg-blue-600 !text-white hover:!bg-blue-700 px-4 py-2 rounded", text} : CreateRecommendationButtonProps) //so I can change button for navbar
{
  const supabase = getSupabase()
  const router = useRouter();

  async function Click()
  {
    const { data: {user}, error:authError, } = await supabase.auth.getUser();

    if (authError || !user)
    {
      console.log("No authenticated user");
      router.push("/auth/signup");
      toast.warning("Please make sure you are signed in.");
      return;
    }

    const { data:studentData, error:studentError} = await supabase
      .from("students")
      .select("user_id, name, location, email")
      .eq("user_id", user?.id)
      .maybeSingle()

    if(!studentData || studentError )
    {
      console.error("Error when fetch student data", studentError?.message || "Student not found");
      router.push("/createprofile"); 
      return;
    }

    const hasMissingFields = Object.values(studentData).some((value) => value ===null || value===""); //puts all values into array and checks if at least one value is null or empty str

    if (hasMissingFields)
    {
      toast.warning("Please complete your profile before creating a recommendation list.");
      router.push("/createprofile");
    }
    else
    {
      router.push("/recommendationlists/create");
    }
  }

  return(
    <button
      onClick={Click}
      className={classNameInput}
      >{text}
    </button>
  )
}