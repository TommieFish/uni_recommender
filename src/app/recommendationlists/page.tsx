import {getSupabase } from "@/lib/supabase/server";
import { CreateRecommendationButton } from "@/components/CreateRecommendationButton";
import Link from "next/link";
import {Suspense } from "react";

type SingleRecommendationPerameter = {name: string; number?: string | {grade:string; subject:string}[] } //number could also be grades
type RecomemndationPerameters = SingleRecommendationPerameter[]; //array of perameters

export default async function RecommendationListsPage()
{
  const supabase = await getSupabase();
  const { data: {user}, error: authenticationError} = await supabase.auth.getUser();

  if (authenticationError || !user)
  {
    return <p className="text-center text-red-500 mt-8">Error: {authenticationError?.message || "You are not authenticated"}</p>
  }

  const { data:studentData, error :studentDataError } = await supabase
    .from("students")
    .select("user_id, name, location, email")
    .eq("user_id", user?.id)
    .maybeSingle();

  if (studentDataError || !studentData)
  {
    console.error("No data on student");
    return <p className="text-center text-red-500 mt-8">Error: {studentDataError?.message || "Data for you is not found"}</p>
  }

  const {data: rawRecommendations, error : recommendationError} = await supabase
    .from("student_recommendation")
    .select("id, date_recommended, parameters, name")
    .eq("user_id", user?.id)
    .order("date_recommended", {ascending: false})

  if (recommendationError || !rawRecommendations)
  {
    console.error("No data on student recommendations");
    return <p className="text-center text-red-500 mt-8">Error: {recommendationError?.message || "You have no recommendation lists yet."}</p>
  }

  const recommendationsList = rawRecommendations.map((recommendation : any) => (
    {
      id: recommendation.id,
      name: recommendation.name,
      date_recommended : recommendation.date_recommended,
      parameters: recommendation.parameters as RecomemndationPerameters
    }
  ))

  return (
    <Suspense>
      <div className="relative z-[1]">
        <div className="min-h-screen dark:text-white text-black px-4 py-20">
          <div className="max-w-5xl mx-auto mt-10">
            <h1 className="text-3xl mb-6 font-bold text-center sm:text-left">Welcome, {studentData.name}</h1>

            <div className="flex justify-center sm:justify-end mb-6"> <CreateRecommendationButton text="Create Recommendation List"/> </div>

            {recommendationsList.length === 0 ? (
              <p className=" text-black dark:text-gray-500 text-center sm:text-left">You have no recommendation lists. Click{" "}
              <span className= "font-semibold">Create New Recommendation</span>{" "} to get started!</p>
            )
            : 
            (
              <div className="space-y-6">
                {/* desktop heading*/}
                <div className="hidden md:grid md:grid-cols-3 md:gap-4 text-sm font-semibold text-gray-700 dark:text-gray-500 border-b pb-2">
                  <div>List Name</div>
                  <div>Created At</div>
                  <div>Parameters</div>
                </div>

                {/*layout for all devices*/}
                {recommendationsList.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-white dark:bg-[var(--bg-color)] text-gray-900 dark:text-[var(--text-color)] rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 md:grid md:grid-cols-3 md:gap-4"
                    aria-label={`Recommendation card: ${rec.name || "Untitled Recommendation"}`}
                    >
                    {/* List Name */}
                    <div className="mb-2 md:mb-0">
                      <h2
                        className="text-base font-semibold text-blue-600 truncate"
                        aria-label={`Recommendation list: ${rec.name || "Untitled Recommendation"}`}
                        title={rec.name || "Untitled Recommendation"}
                        >
                        <Link href={`/recommendationlists/${rec.id}`}>
                          {rec.name || "untitled recommendation"}  
                        </Link>
                      </h2>
                    </div>

                    {/* Created time*/}
                    <div className="text-sm text-gray-600 dark:text-gray-500 mb-2 md:mb-0">
                      {new Date(rec.date_recommended).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>

                    {/* Parameters */}
                    <div className="text-sm">
                      <ul className="list-disc pl-5 space-y-1">
                        {rec.parameters.map((param, index) => 
                        (
                          <li key={`param-${rec.id}-${index}`}>
                            <div className="font-medium">{param.name}</div>
                            {Array.isArray(param.number) ? (
                              <ul className="list-inside list-disc pl-4">
                                {param.number.map((entry, i) => (
                                  <li key={`grade-${i}`}>{entry.subject}: {entry.grade}</li>
                                ))}
                              </ul>
                            ) : param.number ? (
                              <div>{param.number}</div>
                            ) : (
                              <div className="text-gray-500 italic">Not specified</div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}