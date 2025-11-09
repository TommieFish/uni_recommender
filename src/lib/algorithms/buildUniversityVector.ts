import {normalise, NormalisationMethod} from "./normalisation"
import { getSupabase } from "../supabase/server";
import {sleep} from "../../utils/sleep";

type Grades = {grade: string; subject:string}[];

//grades to num scores
const gradeToScore : Record<string, number> =
{
  'A*' : 56,
  'A' : 48,
  'B': 40,
  'C' : 32,
  'D' : 24,
  'E': 16,
  'F' : 8,
  'U' : 0
};

//AHP weights. As an improvement: could be defined by the user

const ahpWeightsVector: number[] =
[
  0.175, //Avg predicteds
  0.2, //Tuition (9000) + living
  0.15, //distance
  0.1, //campus type
  0.1, //placement year
  0.05, //Clubs
  0.05, //entry requirement type
  0.075, //entrance test
  0.1 //padding (or num students for later if have time)
]

//normalisation methods
const normalisationConfig : NormalisationMethod[] =
[
  "none", //predicteds
  "log", //costs
  "none",  // Distance - AS THERE IS ONLY ONE DISTANCE, MINMAX WILL ALWAYS RETURN ZERO, so normalised in /vectorSimilarity
  "none", // campus type
  "none", //placement year
  "log", //clubs
  "none", //Entry Requirement Type
  "none", //entrance tests
  "none" //padding
]

export async function createUniversityVectors(): Promise<number[][]>
{
  const supabase = await getSupabase();

  //authed user?
  const{ data: {user}, error: authError} = await supabase.auth.getUser();

  if (authError || !user)
  {
    throw new Error(authError?.message || "User not authenticated."); //Error picked up and redirected in API call
  }



  //Uni data - makes sure all data is filled (so if being updated, won't matter)
  const { data: universitiesData, error: uniFetchError} = await supabase
    .from("university")
    .select("*")
    .not("club_count", "is", null)
    .not("campus_type", "is", null)
    .not("number_of_students", "is", null)
    .not("location", "is", null)
  
  if (uniFetchError || !universitiesData)
  {
    throw new Error(uniFetchError?.message || "Uni records not found.");
  }

  //Uni data - makes sure all data for similarity is filled (so if courses being added, won't matter). All needed for later, and null would break program
   const { data: courseData, error: courseFetchError} = await supabase
    .from("course_for_uni")
    .select("*")
    .not("uni_fees", "is", null)
    .not("entry_requirements_ucas_points", "is", null)
    .not("location", "is", null)
    .not("has_placement_or_gap_year", "is", null)
    .not("has_entrance_test", "is", null)
    .not("assessment_type", "is", null)
    .not("course_id", "is", null)
    .not("university_id", "is", null)
    .in("university_id", universitiesData.map(uni => uni.id))

  if (courseFetchError || !courseData)
  {
    throw new Error(courseFetchError?.message || "Course records not found.");
  }

  const vectors : number[][] = [];


  for (const uni of universitiesData)
  {
    console.log(uni.id, uni.name)
  } 
  console.log("\n\n");

  //get raw features
  const entryReqsList = courseData.map(course => course.entry_requirements_ucas_points / 3);
  const feesList = courseData.map(course => course.uni_fees);
  const distanceList = courseData.map(() => 0) //placeholder as done in Vector similarity so not uploading personalised data
  const campusTypeList = courseData.map(course=> {
    const uni = universitiesData.find(uni => uni.id === course.university_id);
    return uni?.campus_type === "City" ? 1: 0;
  });
  const placementList = courseData.map(course=> course.has_placement_or_gap_year === "TRUE" ? 1 : 0);
  const clubCountList = courseData.map(course=> {
    const uni = universitiesData.find(uni => uni.id === course.university_id);
    return uni?.club_count || 0;
  });
  const assessmentTypeList = courseData.map(course => course.assessment_type === "Exams" ? 1 : 0);
  const entranceTestList = courseData.map(course => course.has_entrance_test === "TRUE" ? 1 : 0);

  //normalisation across all vectors of each type
  const normalisedEntryReqs = normalise(entryReqsList, normalisationConfig[0]);
  const normalisedFeesList = normalise(feesList, normalisationConfig[1]);
  const normalisedDistanceList = normalise(distanceList, normalisationConfig[2]);
  const normalisedCampusTypeList = normalise(campusTypeList, normalisationConfig[3]);
  const normalisedPlacementList = normalise(placementList, normalisationConfig[4]);
  const normalisedClubCountList = normalise(clubCountList, normalisationConfig[5]);
  const normalisedAssessmentTypeList = normalise(assessmentTypeList, normalisationConfig[6]);
  const normlaisedEntranceTestList = normalise(entranceTestList, normalisationConfig[7]);

  for (let i = 0; i < courseData.length; i++)
  {
    const course = courseData[i];
    const uni = universitiesData.find(uni => uni.id === course.university_id);
    if (!uni)
    {
      continue;
    }

    //extracts normalised features for course[i]
    const rawVector =
    [
      normalisedEntryReqs[i],
      normalisedFeesList[i],
      normalisedDistanceList[i],
      normalisedCampusTypeList[i],
      normalisedPlacementList[i],
      normalisedClubCountList[i],
      normalisedAssessmentTypeList[i],
      normlaisedEntranceTestList[i],
      0
    ];

    //weights, apply before, as reflects priority
    const weightedVector = rawVector.map((value, index) => value * ahpWeightsVector[index]);

    //like insert, but if already exists (user_id is already in table), updates values
    const {error: uniUpsertError} = await supabase
      .from("university_vectors")
      .upsert({
        course_for_uni_id: course.course_for_uni_id,
        vector: weightedVector,
        course: course.course_name,
        location: uni.location
      },
      {
        onConflict: "course_for_uni_id"
      }
    );

    if (uniUpsertError)
    {
      throw new Error(`Failed to store student vecotr: ${uniUpsertError.message}`);
    }
  
    await sleep(100);

  }


  return vectors;


}