import {NextResponse} from "next/server";
import { createStudentVector } from "@/lib/algorithms/buildStudentVector";

export async function POST()
{
  try
  {
    await createStudentVector(); //runs algo on server side
    console.log("student vector creation completed. No errors");
    return NextResponse.json({success: true});
  }
  catch(error)
  {
    if (error  instanceof Error) //when using throw new Error()
    {
      console.error("Error generating your vector. Error is:", error.message);
      return NextResponse.json({success: false,error: error.message})
    }
    else //errors not thrown on purpose
    {
      console.error("An unknown error occured :(. The error is:", error);
      return NextResponse.json({success: false,error: "Unknown"})
    }
  }
}