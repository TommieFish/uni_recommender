import {getSupabase } from "@/lib/supabase/client";
import {useEffect, useState} from "react";

export function useCurrentUserImage()
{
  const[image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserImage = async() => {
      const {data, error} = await getSupabase().auth.getUser();
      if(error)
      {
        console.log("An erro has occured: ",error);
      }

      const profilePic = data.user?.user_metadata.avatar_url;

      setImage(profilePic ?? "/images/profile.png");
    }
    fetchUserImage();

  },[])
  return image;
}