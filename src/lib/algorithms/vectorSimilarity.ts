import {getSupabase} from "@/lib/supabase/server";
import {cosineSimilarity, euclideanDistance, gradeSimilarity} from "@/lib/algorithms/similarity";
import { getCityDistance } from "@/components/getCityDistance";
import {normalise } from "./normalisation";

export async function RankedRecommendations(name: string)
{
  console.log("Similarity search called with name:",name);
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

  function delay1Sec()
  {
    return new Promise(resolve => setTimeout(resolve, 100))
  }

  //
  const hybridWeights = 
  {
    cosine: 0.6, //matches nuanced preferences well (like assessment style and campus type) (0.75 - 0.99)
    euclidean: 0.75, //highest as important to minimise mismatches, also gives more varied than cosine (as cosine angles will be fairly similar)
    gradeSurplus: 0.5 //lower than others as its a bonus weight, not a primary driver (courses already been filtered)
  };

  type CourseRequiredGrades = {grade:string; subject:string}
  const supabase = await getSupabase();

  const { data: {user}, error: authError} = await supabase.auth.getUser();

  if (authError || !user)
  {
    console.log(authError?.message ? `Auth error: ${authError?.message}` : "User not authenticated");
    throw new Error(authError?.message || "User not authenticated")
  }

  const studentID = user?.id;

  //get student record
  const {data: student, error:studentError} = await supabase
    .from("students")
    .select("*")
    .eq("user_id", studentID)
    .single()
  if (studentError || !student)
  {
    console.log(studentError?.message ? `Auth error: ${studentError?.message}` : "User not authenticated");
    throw new Error(studentError?.message || "User not authenticated")
  }
  else if (student.course_name === null)
  {
    console.log("Preferred course not entered");
    throw new Error("Preferred course not entered");
  }

  const {data: student_vector, error: studentVectorError} = await supabase
    .from("student_vectors")
    .select("vector")
    .eq("user_id", studentID)
    .single()

  if (studentVectorError || !student_vector)
  {
    console.log(studentVectorError?.message ? `Auth error: ${studentVectorError?.message}` : "User not authenticated");
    throw new Error(studentVectorError?.message || "User not authenticated")
  }

  const studentVector = Array.isArray(student_vector?.vector) ?(student_vector.vector as number[]) : []; //checks to see if student vector is empty

  const studentGrades= Array.isArray(student.predicted_grades) ? student.predicted_grades : [];

  const studentTop3UcasScore = student.predicted_grades.map((entry: {grade: string; subject: string}) => {
    const stringified = typeof entry?.grade === "string" ? entry.grade.toUpperCase().trim() : '';
    return gradeToScore[stringified] ?? 0;
  }).sort((a: number, b: number) => b - a).slice(0,3); //takes 2 values next to each other, compares and sorts them ascendingly. Like a bubble sort

  const studentTop3UcasScoreSum = studentTop3UcasScore.reduce((sum:number, grade : number) => sum + grade, 0); //sums top 3 grades, starts from 0
  console.log("Student's top 3 UCAS score:", studentTop3UcasScoreSum);

  //get courses
  const {data: courses} = await supabase
    .from("course_for_uni")
    .select("course_for_uni_id, entry_requirements_ucas_points, course_name, required_grade")


  console.log("Num courses fetched: ", courses?.length ?? 0);


  //filter eligible courses (allows for empty arr)
  const eligibleCourseIds = (courses ?? []).filter( course => {
    const courseUcasPoints = course.entry_requirements_ucas_points;
    const requiredGrades: CourseRequiredGrades[] | null = course.required_grade;

    const meetsUcas = studentTop3UcasScoreSum >= courseUcasPoints; //does user have enough ucas points (over 3 subjects)?
    const matchesCourse = course.course_name === student.course_for_uni //does course match user's chosen course?

    let requiredScore: number =0;
    let studentGradeScore: number = 0;

    //make sure require grades are met
    const meetsNecessaryGrades = !requiredGrades || requiredGrades.every(reqGrade => {
      const reqGradeForCheck = reqGrade.grade.toUpperCase().trim();
      if (reqGradeForCheck == "REQUIRED") //no specific grade, but subject is required
      {
        const studentHasSubject = studentGrades.find((g: { subject: string; grade: string }) => g.subject === reqGrade.subject);
        if (studentHasSubject === false)
        {
          return false;
        }
        else
        {
          return true;
        }
      }
      else
      {
        requiredScore = gradeToScore[reqGradeForCheck] ?? 0; //get needed grade for subject
        const studentScore = studentGrades.find((g: { subject: string; grade: string }) => g.subject === reqGrade.subject); //only checks grade for stated subjects
        studentGradeScore = gradeToScore[(studentScore?.grade ?? '').toUpperCase().trim()] ?? 0; //gets student's grade. Defaults to zero as edge case check
        return studentGradeScore >= requiredScore; //check for grade >= required
      }
    });
    return meetsUcas && matchesCourse && meetsNecessaryGrades; //all conditions must be true for user to be able to do course
  }).map(course => course.course_for_uni_id);

  if(eligibleCourseIds.length === 0)
  {
    console.warn("No eligible courses found for student based on predicted grades");
    const error = new Error("No eligible courses found for student based on predicted grades");
    throw (error as any).status = 404;
  }

  //get uni vectors
  const { data: universityVectors, error: vectorError } = await supabase
    .from('university_vectors')
    .select('course_for_uni_id, vector, location')
    .in('course_for_uni_id', eligibleCourseIds);

  if (vectorError) throw new Error('Failed to fetch university vectors');
  const weights = [0.175, 0.2, 0.15, 0.1, 0.1, 0.05, 0.05, 0.075, 0.1];

  //update location (personalised distance between user and unis)
  const distances = await Promise.all((universityVectors ?? []).map(async (uni) => {
    console.log(`Calculating distance between student at ${student.location} and university at ${uni.location}...`);
    const distance = await getCityDistance(student.location, uni.location); //calculates distance using geolib
    console.log(`Distance to ${uni.location}: ${distance} km`);
    delay1Sec(); //delays a sec as external API has a rate limit of 1 per second - avoid rate limits
    console.log("delay by 1 sec")
    return distance
  }));
  console.log("Finished distances");

  const normalisedDistancesUnis = normalise(distances, "minmax");
  console.log("Normalized distances:", normalisedDistancesUnis);

  //Updates distance in each uni vector (but not in database)
  (universityVectors ?? []).forEach((uni_vector, index) => //instead of a foreach, using .foreach allows for me to also keep an index
  {
    if (Array.isArray(uni_vector.vector))
    {
      uni_vector.vector[2] = normalisedDistancesUnis[index] * weights[2];
      console.log(`Updated ${universityVectors[index].location} distance → ${uni_vector.vector[2]} (weighted)`);
    }
    else
    {
      console.warn(`Skipping uni_vector[${index}] because vector is not an array`);
    }
  });

  //normalise student distance with same factor as uni distance
  const studentDistance = [...distances, student.distance_from_home];
  const normalisedStudentDistance = normalise(studentDistance, "minmax_student")[0] * weights[2];
  studentVector[2] = normalisedStudentDistance;
  console.log(`Updated student distance → ${studentVector[2]} (weighted)`);

    //Validate vectors
  const validVectors = (universityVectors ?? []).filter(
    (uni): uni is typeof uni & { vector: number[] } => Array.isArray(uni.vector) && uni.vector.length === weights.length //checks that uni vector is correct len and it is in format of uni vector so it can treat it as such without worrying for errors
  );

  if (!studentVector || studentVector.length !== weights.length) {
    throw new Error("Student vector is missing or malformed.");
  }

  if (validVectors.length === 0) {
    throw new Error("No valid university vectors found for similarity search.");
  }

  //Combine scores
  const ranked = validVectors.map((uni, i) => {
    const trimmedStudent = studentVector.slice(1); //removes predicteds
    const trimmedUni = uni.vector.slice(1); //removes predicteds

    const cosine = cosineSimilarity(trimmedStudent, trimmedUni); //angle between vectors
    const euclidean = euclideanDistance(trimmedStudent, trimmedUni); //distance between vectors
    const gradeSurplusScore = gradeSimilarity(studentVector, uni.vector, weights[0]); //postive rewards for harder unis and grades scoree

    // Hybrid score
    const hybridScore =
      hybridWeights.cosine * cosine +
      hybridWeights.euclidean * euclidean +
      hybridWeights.gradeSurplus * gradeSurplusScore;

    return {
      ...uni,
      cosine,
      euclidean,
      gradeSurplus: gradeSurplusScore,
      hybrid: hybridScore
    };
  }).sort((a,b) => b.hybrid - a.hybrid);

  console.log("Total number of universities ranked:", ranked.length);

    const vectorLabels = 
    [
    "Predicted Grades",
    "Tuition + Accommodation Costs",
    "Wanted Distance",
    "Campus Type",
    "Placement Year",
    "Clubs",
    "Preferred Assessment Type",
    "Minds an Entrance Test",
  ];

  const vectorValues = 
  [
    student.predicted_grades,
    student.wanted_budget,
    student.distance_from_home,
    student.preferred_campus_type,
    student.placement_or_abroad_year,
    student.wanted_club_count,
    student.preferred_assessment_type,
    student.has_entrance_test ? "Yes" : "No",
  ];

  const parameters = vectorValues.map((number : any, index : number) => ({name: vectorLabels[index], number}));

  const top8_for_list = ranked.slice(0,8).map(({hybrid, course_for_uni_id}) => ({hybrid, course_for_uni_id}));

  //check for errors
  const newRecommendation = {
    user_id: studentID,
    name: name,
    date_recommended: new Date().toISOString(),
    recommendation_list: top8_for_list,
    parameters: parameters,
  };
  console.log("Inserting recommendation:", newRecommendation);

  //insert
  const {data, error} = await supabase
    .from("student_recommendation")
    .insert(newRecommendation)

  console.log("Inserted data: ", data);
  if (error)
  {
    console.error("Insert error", error);
    throw new Error(error?.message || "Database error.");
  }

  console.log("The top 8 universities:", ranked.slice(0, 8), "have been saved to the database.");

  return ranked.slice(0,8);
  
}