import {Hero } from "@/components/LanderPage/Hero";
import {LogoAnimation } from "@/components/LanderPage/LogoAnimation";
import {Contact } from "@/components/LanderPage/Contact";
import {KeyMetrics } from "@/components/LanderPage/KeyMetrics";
import {Footer } from "@/components/LanderPage/Footer";
import {Suspense } from "react";

export default function Home()
{
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Hero/>
        <LogoAnimation/>
        <KeyMetrics/>
        <Contact/>
        <Footer/>
      </Suspense>
    </>
  )
}