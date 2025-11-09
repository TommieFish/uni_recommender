import {normalise, NormalisationMethod} from "./normalisation"
import { getSupabase } from "../supabase/server";

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

//AHP weights
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

export async function createStudentVector(): Promise<number[]>
{
  const supabase = await getSupabase();

  //authed user?
  const{ data: {user}, error: authError} = await supabase.auth.getUser();

  if (authError || !user)
  {
    throw new Error(authError?.message || "Student record not found"); //Error picked up and redirected in API call
  }

  //get student details
  const {data: student , error: studentFetchError} = await supabase
    .from("students")
    .select("*")
    .eq("user_id", user?.id)
    .single()

  if (studentFetchError || !student)
  {
    throw new Error(studentFetchError?.message || "Student record not found.");
  }

  const predictedGrades = (student.predicted_grades as Grades) || [];
  const numericGrades : number[] = [];

  for (const entry of predictedGrades )
  {
    const rawGrade = entry?.grade?.trim();
    const uppercaseGrade = typeof rawGrade === "string" ? rawGrade.toLocaleUpperCase() : "" //makes sure is actually a string and converts to uppercase
    const score= gradeToScore[uppercaseGrade];
    numericGrades.push(score);
  }

  //avg grade score
  let total = 0;

  if (numericGrades.length > 0)
  {
    const sortedGrades : number[] =[...numericGrades].sort((a,b) => b - a); //sorts descending
    const top3Grades : number[] = sortedGrades.slice(0,3); // only takes avg of top 3 grades to comp with unis, otherwise skews avg in favour of student
    const extras : number[] = sortedGrades.slice(3);
    const bonusPointsExtras : number[] = extras.map(g => g * 1.5);

    total = [...top3Grades, ...bonusPointsExtras].reduce((sum, current) => sum + current, 0);
  }

  const avgUcasScore = total / (numericGrades.length || 1); //fallback to 1 if len is 0 (so no error)

  //raw features
  const rawFeatures: number[]= 
  [
    avgUcasScore,
    student.wanted_budget,
    student.distance_from_home,
    student.preferred_campus_type === 'City' ? 1 : 0,
    student.placement_or_gap_year ==="TRUE" ? 1: 0,
    student.wanted_club_count || 0,
    student.preferred_assessment_type === 'Exams' ? 1: 0,
    student.has_entrance_test === "TRUE" ? 1 : 0,
    0,
  ];

  //Normalise
  const normalisedFeatures = rawFeatures.map((value, index) => {
    const method = normalisationConfig[index] ?? "none";
    return normalise([value], method)[0]; //returns a vector, so get it as a number
  })

  console.log("Normalised data for student vector.");

  //apply AHP weights before, as then reflects priority (as all values will be close to each other (from 0 to around 10) - a higher AHP weight will mean it stretches the geometry of the space.
  const weightedVector = normalisedFeatures.map((value, index) => value * ahpWeightsVector[index]);

  console.log(`Upserting vector for : ${student.name}`, 
    {
      user_id : user.id,
      course_name: student.course_for_uni,
      vector : weightedVector
    }
  )

  //like insert, but if already exists (user_id is already in table), updates values
  const {error: upsertError} = await supabase
    .from("student_vectors")
    .upsert({
      user_id : user.id,
      course_name: student.course_for_uni,
      name: student.name,
      vector : weightedVector
    },
    {
      onConflict: "user_id"
    }
  );

    if (upsertError)
    {
      throw new Error(`Failed to store student vecotr: ${upsertError.message}`);
    }

    return weightedVector;

}