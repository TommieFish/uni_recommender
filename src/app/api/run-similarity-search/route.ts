import {NextResponse} from "next/server";
import { RankedRecommendations } from "@/lib/algorithms/vectorSimilarity";

export async function POST(request: Request) //has a json request parsed into the post as body. Contains name
{
  try
  {
    const body = await request.json();
    const name = body.name;
    await RankedRecommendations(name); //runs algo on server side
    console.log("Similarity Search completed. No errors");
    return NextResponse.json({success: true});
  }
  catch(error)
  {
    if (error  instanceof Error) //when using throw new Error()
    {
      console.error("Error running similarity search. Error is:", error.message);
      if((error as any).status === 500 && (error as any).message ==="Invalid City") return  NextResponse.json({success: false,error: error.message},{status:500});
      if((error as any).status ===404) return NextResponse.json({success: false,error: error.message},{status:404});
      else return NextResponse.json({success: false,error: error.message})

    }
    else //not thrown on purpose
    {
      console.error("An unknown error occured :(. The error is:", error);
      return NextResponse.json({success: false,error: "Unknown"})
    }
  }
}