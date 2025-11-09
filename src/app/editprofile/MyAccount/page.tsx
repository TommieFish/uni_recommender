"use client"

import {useEffect, useState } from "react";
import SettingsTabs from "@/components/SettingsTabs";
import {getSupabase } from "@/lib/supabase/client";

export default function MyAccountPage()
{
  const [name, setName ] = useState("");
  const [ location, setLocation] = useState("");
  const [address, setAddress ] = useState("");
  const [ loading, setLoading] = useState(false);
  const [status, setStatus ] = useState("");

  useEffect(() => {
    //gets data and sets it to corresponding variables
    async function load()
    {
        const supabase = await getSupabase();
        const {data : { user }} = await supabase.auth.getUser();
      //uses MaybeSingle as possible array doesn't exist, but will only have max of 1 array
      const {data : personal_data, error } = await supabase
        .from("students")
        .select("name, location, address")
        .eq("user_id", user?.id)
        .maybeSingle()

      if (error || ! personal_data)
      {
        console.error("Error fetching data:", error?.message || "No user data.");
        return null;
      }
      else
      {
        setName(personal_data.name);
        setLocation(personal_data.location);
        setAddress(personal_data.address);
      }
    };
    load()
  }, []);

  async function update()
  {
    setLoading(true);

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
        .update({name, location, address, updated_at : new Date().toISOString(),})
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

  return (
    <div className="relative z-[1]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <SettingsTabs />  {/* inbuilt Navbar for editing profiles*/}

        <section  className="rounded-xl bg-white text-gray-500 p-6 space-y-6">
          <div> 
            <label className="text-sm text-gray-500 block">Full Name</label>
            <input className = "border w-full rounded px-4 py-2"
              value={name}
              onChange={entered_name => setName(entered_name.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 block">City</label>
            <input className = "border w-full rounded px-4 py-2"
              value={location}
              onChange={entered_city => setLocation(entered_city.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 block">Address</label>
            <input className = "border w-full rounded px-4 py-2"
              value={address}
              onChange={entered_address => setAddress(entered_address.target.value)}
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