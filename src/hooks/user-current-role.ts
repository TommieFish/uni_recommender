'use client'

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase/client"


//hook function that gets role
export function useRole()
{
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchRole = async() =>
    {
        const supabase = await getSupabase();
        const { data: {user}, error: authenticationError} = await supabase.auth.getUser();

        if (authenticationError || !user)
        {
            console.log("Authentication error:", authenticationError?.message)
            return "";
        }

        const { data : student, error : roleFetchError} = await supabase
            .from("students")
            .select("role")
            .eq("user_id", user?.id)
            .maybeSingle()
    
        if (roleFetchError)
        {
            console.error("Error fetching courses: ", roleFetchError.message);
            return;
        }
        if(student?.role)
        {
            setRole(student.role);
        }
    }

    fetchRole();
  }, []);

  return role;
}
