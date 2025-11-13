"use server"

import { redirect } from "next/navigation";
import {getSupabase } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

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
      console.log("Invalid login credentials or Invalid email or password")
      console.error("Invalid login credentials");
      return {success: false, message: signInError.message};
    }
    else //unknown errors
    {
      console.log("Unknown error:", signInError.message)
      redirect(`/error?message=${encodeURIComponent(signInError.message)}`);
    }
  }

  console.log("logged in user")
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
  const supabase = await getSupabase();

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
        console.log("Error signing up, Error:", signUpError);
        return { success: false, message: signUpError.message };
      }
    throw new Error(signUpError?.message);
  }

  console.log("signed in user")
  return {success : true};

}

export async function logout()
{
  const supabase = await getSupabase();
  await supabase.auth.signOut();
  redirect("/auth/signin");
}

export async function deleteAccount()
{
  //delete from student to remove all data (other than in auth table), so can delete properly
  const supabaseAdmin = await getSupabaseAdmin();
  const supabase  =await getSupabase(); //needed to get auth session (cookies)

  const { data: {user}, error: authenticationError} = await supabase.auth.getUser();

  if (authenticationError|| !user) 
  {
    console.error("Auth error:", authenticationError?.message || "No user found");
    return {success: false, error:authenticationError?.message};
  }

  const {data, error: deleteError} = await supabaseAdmin
  .from("students")
  .delete()
  .eq("user_id", user?.id)

  if (deleteError)
  {
    console.log("Error deleting student from student table");
    console.error("An error occurred");
    return {success: false, error:deleteError.message};
  }

  //delete account
  const {error: deleteAccountError} = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteAccountError)
  {
    console.log("Error deleting student from auth table");
    console.error("An error occurred");
    return {success: false, error:deleteAccountError.message};
  }

  return { success: true};

  //sign out (deleting user does not auto sign user out)
  await supabase.auth.signOut();
  redirect("/auth/signup");

}