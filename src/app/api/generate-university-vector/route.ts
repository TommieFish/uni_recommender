import {NextResponse} from "next/server";
import { createUniversityVectors } from "@/lib/algorithms/buildUniversityVector";

export async function POST()
{
  try
  {
    await createUniversityVectors(); //runs algo on server side
    console.log("University vector creation completed. No errors");
    return NextResponse.json({success: true});
  }
  catch(error)
  {
    if (error  instanceof Error) //when using throw new Error()
    {
      console.error("Error generating university vectors. Error is as follows:", error.message);
      return NextResponse.json({success: false,error: error.message})
    }
    else //not thrown on purpose
    {
      console.error("An unknown error occured :(. The error is:", error);
      return NextResponse.json({success: false,error: "Unknown"})
    }
  }
}