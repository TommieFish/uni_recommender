'use client'

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase/client"


//hook function that filters courses such that only ones that are in course_for_uni can be used (filtered by for_course_for_uni)
export function useCourses() {
  const [courses, setCourses] = useState<string[]>([])
  const supabase = getSupabase()

  useEffect(() => {
    const fetchCourses = async () => {
    const { data : courses, error : courseFetchError} = await supabase
    .from("course")
    .select("name")
    .eq("currently_available", true)
  
    if (courseFetchError)
    {
      console.error("Error fetching courses: ", courseFetchError.message);
      return
    }
      setCourses(courses.map((course : any) => course.name))
    }

    fetchCourses()
  }, [supabase])

  return courses
}
