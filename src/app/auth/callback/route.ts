import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";


export async function GET(request : Request)
{
  const supabase = await getSupabase();
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  
  if (!code)
  {
    return NextResponse.redirect(`${origin}/error?message=${encodeURIComponent("No code provided")}`) //encodeURIComponent is encoding it so it can be part of a URL
  }

  //check auth session OK:
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error)
  {
    const message = error.message ?? "Unknown error occurred.";
    return NextResponse.redirect(`${origin}/error?message=${encodeURIComponent(message)}`);
  }

  const {
    data : { user },
    error : authError,
  } = await supabase.auth.getUser();

  if (authError || !user )
  {
    return NextResponse.redirect(`${origin}/error?message=${encodeURIComponent("Authentication Failed")}`);
  }

  const { data : student, error : studentError } = await supabase
    .from("students")
    .select("*")
    .eq("user_id", user.id)
    .single();
  
  //Makes sure that user has filled in all preferences so that no error is created
  if (studentError || !student)
  {
    return NextResponse.redirect(`${origin}/createprofile?toast=${encodeURIComponent("Please fill in your details to create a recommendation list.")}`);
  }

  //Check required fields for redirect
  const requiredFields =
  [
    "location",
    "email",
    "preferred_assessment_type",
    "preferred_campus_type",
    "created_at",
    "name",
    "course_for_uni",
    "predicted_grades",
    "wanted_budget",
    "wanted_club_count",
    "has_entrance_test",
    "placement_or_abroad_year",
    "distance_from_home"
  ];

  const isFilled = requiredFields.every((field) =>
  {
    const value = student[field];
    return value !== null && value !== undefined && value !== "";
  });

  if (isFilled || (student.created_at && Date.now() - new Date(student.created_at).getTime() <= 60_000))
  {
    return NextResponse.redirect(`${origin}/profile`);
  }
  else
  {
    return NextResponse.redirect(`${origin}/createprofile?toast=${encodeURIComponent("Please complete all sections to generate recommendations.")}`);
  }
}