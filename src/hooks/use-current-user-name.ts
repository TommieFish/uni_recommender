import {getSupabase} from "@/lib/supabase/client";
import {useEffect, useState} from "react";

export function useCurrentUserName()
{
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileName = async() => {
      const {data, error} = await getSupabase().auth.getUser();
      if (error)
      {
        console.log(error);
      }
      setName(data.user?.user_metadata.full_name ?? "?")
    }

    fetchProfileName();
  },[])
  return name || "?";
}