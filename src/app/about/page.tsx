"use client"

import ImageSlider from "@/components/ImageSlider"

export default function AboutPage()
{
  return (
  <div className="relative z-[1]"> {/*Content above background*/}
    <div className="max-w-4xl mx-auto px-4 py-12 dark:text-gray-200 text-black mt-20">
      <h1 className="text-4xl font-bold text-center mb-8">About Uni Recommender</h1>
      <section className="mb-12">
        <h2 className="text-2xl mb-2 font-semibold dark:text-white text-black">About Me</h2>
        <p>I am also a student who struggled to find the right university for me. It took a lot of research and time to discover a uni that truly fit what I wanted. The journey inspired me to create Uni Recommender - a platform that simplifies the university search process.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl mb-2 font-semibold dark:text-white text-black">The Aim</h2>
        <p>Uni Recommender helps students discover universities based on interests, grades and preferences about unis. My aim is to allow students to spend more time studying and enjoying their lives, not researching universities. </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl mb-2 font-semibold dark:text-white text-black">How it works</h2>
        <p>By collecting data about both unis in general and course specifics, a vector unique to each course can be created. A student vector is also created, which can then be compared to each university vector. Each course vector is then ranked based on its closeness and angle. The closest matches are given to you, the user. </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl mb-2 font-semibold">Highlights</h2>
        <ImageSlider />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl mb-2 font-semibold">Contact Me</h2>
        <p>Have any suggestions? Please reach out so I can improve the site at: {" "}
          <a href="mailto:support@unirecommender.uk" className="text-blue-600 hover:text-blue-800 underline">
            support@unirecommender.uk
          </a>
        </p>
      </section>
    </div>
  </div>
  )
}