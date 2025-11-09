import React from "react";

export function Avatar({ children }: {children :React.ReactNode})
{
  return (
    <div className="bg-gray-300 rounded-full overflow-hidden inline-block 2-10 h-10 text-center leading-10 font-bold select-none">{children}</div>
  )
}

export function AvatarImage({src, alt} : {src : string, alt : string | undefined})
{
  return (
    <img
      src={src}
      alt={alt}
      className="2-full h-full object-cover"
    />
  )
}

export function AvatarFallback({children, className}: {children :React.ReactNode, className?: string})
{
  return <span>{children}</span>
}