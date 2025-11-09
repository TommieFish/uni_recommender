"use client"

import Image from "next/image";
import { motion } from "framer-motion";

import CambridgeLogo from "../../assets/CambridgeLogo.png"
import OxfordLogo from "../../assets/OxfordLogo.png";
import RussellGroupLogo from "../../assets/RusselGroup.png";
import UniversitiesUKLogo from "../../assets/universitiesUK.png";
import UniversityAllianceLogo from "../../assets/UniversityAlliance.png";

const logos =
[
  { src : CambridgeLogo, alt :"Cambridge Uni Logo"},
  { src : OxfordLogo, alt :"Oxford Uni Logo"},
  { src : RussellGroupLogo, alt :"Russel Group Logo"},
  { src : UniversitiesUKLogo, alt :"Universities UK Logo"},
  { src : UniversityAllianceLogo, alt :"University Alliance Logo"},
]

//Repeat logos so no gaps, no matter size of screen
const images = [...logos, ...logos,...logos, ...logos];

export function LogoAnimation()
{
  return (
    <div className="py-8 bg-purple-200/10">
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,_transparent,_black_25%,_black_75%,_transparent)]" //fade effect for sides (0% -> 25% and same for opposite side)
      >
        <motion.div
          animate={{translateX: '-50%' }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop',
          }}
          className="flex flex-none pr-14 space-x-32"
        >{images.map((image, index) =>(
          <div 
            key={index}
            className="relative w-[140px] h-[70px] flex-shrink-0">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="140px"
                className="object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
              />
            </div>
        ))}
        </motion.div>

      </div>
    </div>
  )
}