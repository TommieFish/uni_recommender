"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from "react"
import Image from "next/image"
import {useMotionTemplate, useMotionValue, motion, animate} from "framer-motion"
import { FiArrowRight } from "react-icons/fi"

const COLORS_TOP = ["rgba(19, 255, 170, 1)", "rgba(30, 103, 198, 1)", "rgba(206, 132, 207, 1)", "rgba(221, 51, 92, 1)", "rgba(102, 27, 136, 1)"] //colours for gradient change

export const Hero = () => {
  const router = useRouter()
  const color = useMotionValue(COLORS_TOP[0]) //first colour used

  useEffect(() => { //gradient switching
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 15,
      repeat: Infinity,
      repeatType: "mirror",
    })
  }, [])

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #000 50%, ${color})` //start with black, transition with gradient radiate down from top center (50%, 0%) and has fade effect (125%, 125%)
  const border = useMotionTemplate`1px solid ${color}` //updating border
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}` //updating box shadow

  return (
    <motion.section
      style={{ backgroundImage }}
      className="relative grid min-h-screen place-content-center overflow-hidden sm:py-36 md:py-32 py-20 px-4 text-gray-200"
    >
      <div className="z-10 flex flex-col items-center">
        <h1 className="text-white/80 text-4xl sm:text-6xl md:text-7xl lg:text-7xl font-black">Uni Recommender</h1>
        <h1 className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text font-black leading-tight text-transparent text-4xl md:text-6xl md:text-7xl lg:text-7xl text-center">
          for Thomas Fish's NEA (AQA CS)
        </h1>

        <div className="mt-6">
          <Image
            src="/images/UniRecommenderLogo.png"
            alt="profile pic"
            width={250}
            height={250}
          />
        </div>

        <div className="flex flex-wrap justify-center items-center gap-2 bg-white/10 shadow-xl p-3 rounded-3xl mb-4 mt-6">
          <Image
            src="/images/cap.png"
            alt="student cap"
            width={40}
            height={40}
            className="rounded-2xl mx-auto"
          />
          <Image
            src="/images/cap.png"
            alt="student cap"
            width={40}
            height={40}
            className="rounded-2xl mx-auto"
          />
          <Image
            src="/images/cap.png"
            alt="student cap"
            width={40}
            height={40}
            className="rounded-2xl mx-auto"
          />
          <p className="font-large">Built by a student, for students</p>
        </div>

        <p className="my-6 max-w-2xl text-center">
          UniRecommender is built with students in mind — to shorten research time and allow for more study
        </p>

        <motion.button
          style={{ border, boxShadow }}
          whileHover={{ scale: 1.115 }}
          whileTap={{ scale: 0.885 }}
          className="flex w-fit items-center gap-2 border rounded-full px-4 py-2"
          onClick={() => router.push('/auth/signup')}
        >Start Your Discovery Now
          <FiArrowRight />
        </motion.button>
      </div>

      <div className= "bg-circle-container">
        <div className = "bg-circle-background"></div>
        <div className="bg-circle"></div>
      </div>
    </motion.section>
  )
}
