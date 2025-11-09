"use client"

import {usePathname} from "next/navigation";
import { AuroraBackground } from "./ui/aurora-background";

export default function LayoutWrapper({children} : {children: React.ReactNode})
{
  const pathname = usePathname();
  const isHomePage = pathname ==="/";

  return isHomePage ? <>{children}</> : <AuroraBackground>{children}</AuroraBackground>;
}