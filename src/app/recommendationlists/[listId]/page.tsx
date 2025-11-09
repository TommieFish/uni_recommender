export const dynamic = "force-dynamic"

import { notFound } from "next/navigation";
import {getSupabase } from "@/lib/supabase/server";
import { Suspense} from "react";

//description not currently used. Later used to describe why specific recommendation? delete if not used.
type RecommendationList = 
{
  id: number,
  title : string
  description : string
  date_recommended :string
  recommendation_list :{
    cosine : number,
    euclidean: number,
    gradeSurplus : number,
    topsis: number,
    hybrid :number,
    course_for_uni_id: number,
  }[];
};

export default async function RecommendationListPage({params} : {params: Promise<{listId : string}>}) //params for slug page
{
  const {listId} = await params;
  const numericListId = Number(listId);
  if (isNaN(numericListId))
  {
    console.log("List not found");
    return notFound();
  }

  const supabase = await getSupabase();
  const {data : {user}, error : authenticationError} = await supabase.auth.getUser();

  if (authenticationError || !user)
  {
    console.log("No authenticated user");
    return notFound();
  }

  const { data : rawList, error} = await supabase
    .from("student_recommendation")
    .select("id, user_id, date_recommended, name, description, recommendation_list")
    .eq("id", listId)
    .maybeSingle()

  if (error ||!rawList || rawList.user_id !== user.id)
  {
    console.log("Unauth access / no list found");
    return notFound();
  }

  //all items to display
  const list : RecommendationList = 
  {
    id : rawList.id,
    title : rawList.name?? "Untitled List",
    description: rawList.description ?? "No description provided",
    date_recommended: rawList.date_recommended,
    recommendation_list :Array.isArray(rawList.recommendation_list) ? rawList.recommendation_list : [],
  }

  //course IDS to array
  const courseIDs = list.recommendation_list.map(item => item.course_for_uni_id);

  const { data : courses, error: courseError} = await supabase
    .from("course_for_uni")
    .select("course_for_uni_id, university: university_id(name)")
    .in("course_for_uni_id", courseIDs)
  
  if (courseError ||!courses)
  {
    console.log("Course for uni fetch error");
    return notFound();
  }

  const { data : course_link, error: courseLinkError} = await supabase
    .from("course_for_uni")
    .select("course_for_uni_id, link_to_website")
    .in("course_for_uni_id", courseIDs)
  
  if (courseLinkError ||!course_link)
  {
    console.log("Course link for uni fetch error");
    return notFound();
  }

  //doesnt use .map as am not changing any data
  const courseLinkMap = new Map<number, string>();
  course_link.forEach(course => {
    courseLinkMap.set(course.course_for_uni_id, course.link_to_website);
  })

  const courseMap = new Map<number,string>();
  courses.forEach(course => {
    const uniData = Array.isArray(course.university) ? course.university[0] : course.university; //so will run if is array or not
    const name = uniData?.name ??"Unknown Uni";
    courseMap.set(course.course_for_uni_id, name);
  });

  return (
    <Suspense>
      <div className="relative z-[1]">
        <main className="max-w-4xl mx-auto p-6">
          {/* headers*/}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-black dark:text-gray-200 mt-1">{list.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Recommended on{" "}
              {new Date(list.date_recommended).toLocaleDateString(undefined, {year:"numeric", month : "long", day: "numeric"})} {/* full format control for good ui*/}
            </p>
          </header>

          {/* List reccommendations*/}
          <section className="mb-8">
            <h2 className = "text-2xl text-black dark:text-gray-200 font-semibold">Recommended Universities</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{list.recommendation_list.length} / 8 universities recommended to you</p>
            {list.recommendation_list.length > 0 ? (
              <ul className="space-y-4">
                {list.recommendation_list.map((recommendation, index) => (
                  <li
                    key={index}
                    className="border-b border-gray-200 pb-4">
                    <h3 className= "text-black dark:text-gray-400 text-lg font-semibold">{courseMap.get(recommendation.course_for_uni_id) ?? "Unknown university"}</h3>
                    <p className="text-black dark:text-gray-400 text-sm">Similarity Score: {recommendation.hybrid.toFixed(6)}</p>
                    <button
                      className="rounded-full px-4 py-2 text-black dark:text-white bg-blue-400 hover:bg-blue-500 hover:text-white transition-colors duration-300">
                      <a href= {courseLinkMap.get(recommendation.course_for_uni_id) ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >Visit Course Page for {courseMap.get(recommendation.course_for_uni_id) ?? "Unknown university"}
                        </a>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (<p>Recommendation not found.</p>)}
          </section>

          {/* Description (not currently used so delete if not used by sunday)*/}
          <section className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl text-black font-semibold mb-4">Why this recommendation?</h2>
            <p className="text-gray-700 leading-relaxed">{list.description}</p>
          </section>
        </main>
      </div>
    </Suspense>
  )
}