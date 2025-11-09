"use server"

import { redirect } from "next/navigation";
import {getSupabase } from "@/lib/supabase/server";

export async function login (formData : FormData)
{
  const supabase = await getSupabase();
  const signInDetails= {email : formData.get("email") as string, password :formData.get("password") as string}; //inputs
  const { error : signInError } = await supabase.auth.signInWithPassword(signInDetails);

  if (signInError)
  {
    //no redirect, allow for retry
    if(signInError.message.includes("Invalid login credentials") || signInError.message.includes("Invalid email or password"))
    {
      return {success: false, message: signInError.message};
    }
    else //unknown errors
    {
      redirect(`/error?message=${encodeURIComponent(signInError.message)}`);
    }
  }

  return {success :true} //passed all failure tests

}

export async function deleteList(id: string)
{
  const supabase = await getSupabase();

  const { data: {user}, error: authenticationError} = await supabase.auth.getUser();

  if (authenticationError|| !user) 
  {
    console.error("Auth error:", authenticationError?.message || "No user found");
  }

  const {data: recommendations, error: deleteError} = await supabase
  .from("student_recommendation")
  .delete()
  .eq("id", id)
  .eq("user_id", user?.id)

  if (deleteError)
  {
    console.error(`Error deleting reccommendation of id ${id}:`, deleteError);
    return {success: false, error:deleteError.message};
  }

  return {success:true, recommendations };
}


export async function signup(formData : FormData)
{
  const supabase = await getSupabase()

  const signUpDetails = 
  {
    email: formData.get("email") as string,
    password : formData.get("password") as string
  }

  const {error :signUpError} = await supabase.auth.signUp(signUpDetails);

  if (signUpError)
  {
    if ( signUpError.message.includes('User already registered') || signUpError.message.includes('Invalid email') || signUpError.message.includes('Password should be at least'))
      {
        return { success: false, message: signUpError.message };
      }
    throw new Error(signUpError?.message);
  }

  return {success : true};

}

export async function logout()
{
  const supabase = await getSupabase();
  await supabase.auth.signOut();
  redirect("/auth/signin");
}