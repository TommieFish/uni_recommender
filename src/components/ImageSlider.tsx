"use client"

import {useState, useEffect } from "react";
import styles from "./ImageSlider.module.css";

const images =
[
  "/images/Highlights/slide1.jpg",
  "/images/Highlights/slide2.jpg",
  "/images/Highlights/slide3.jpg",
]

export default function ImageSlider()
{
  const[ currentIndex, setCurrentIndex] = useState(0);

  useEffect(() =>{
    const interval = setInterval(()=> {
      setCurrentIndex((prevIndex) => prevIndex === images.length-1 ? 0 : prevIndex + 1);
      console.log("Switching to image index.");
    }, 10000) //repeats every 10 seconds

  return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.slider}>
      <img
        key={currentIndex}
        src={images[currentIndex]}
        alt={`Slide ${currentIndex +1}`}
        className={styles.image}
      />
    </div>
  )

}