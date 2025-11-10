"use client"

//use hooks to keep component reactive (if user changes state, no need to reload page)
import { useCurrentUserImage} from "@/hooks/user-current-user-image";
import { useCurrentUserName } from "@/hooks/use-current-user-name";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export function CurrentUserAvatar()
{
  const profileImage = useCurrentUserImage();
  const name = useCurrentUserName();
  console.log(name);

  //generate initials from namee
  const initials = name ? name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
  :"?"
  

  //Returns profile pic (only works with OAuth, or initials of name)
  return (
    <Avatar>
      {profileImage ? (<AvatarImage src={profileImage} alt={`?`}/>) : <AvatarFallback>{initials}</AvatarFallback>} 
    </Avatar>
  )
}