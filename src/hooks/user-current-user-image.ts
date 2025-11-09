import {getSupabase } from "@/lib/supabase/client";
import {useEffect, useState} from "react";

export function useCurrentUserImage()
{
  const[image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserImage = async() => {
      const {data, error} = await getSupabase().auth.getSession();
      if(error)
      {
        console.error("An erro has occured: ",error);
      }
      setImage(data.session?.user.user_metadata.avatar_url ?? null);
    }
    fetchUserImage();
  },[])
  return image;
}