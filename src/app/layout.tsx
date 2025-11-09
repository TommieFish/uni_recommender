import Navbar from "@/components/navbar";
import {Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type {Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout-wrapper";

const poppins = Poppins({ subsets: ["latin"], weight: ["100", "200", "400", "500", "600", "700", "900"]});

export const metadata: Metadata = {
  title: "Uni Recommender",
  description: "A personalised university recommendation engine",
  keywords: ["university", "recommendation", "education", "similarity", "student", "UK universities"], //SEO
  authors : [{name : "Thomas Fish", url: "https://unirecommender.uk"}],

  //Control how share link looks:
  openGraph:
  {
    title : "Uni Recommender",
    description: "A personalised university recommendation engine",
    url: "https://unirecommender.uk",
    siteName:"Uni Recommender",
    locale: "en_GB",
    type:"website",
  },
};

export default function RootLayout({ children, } : {children :React.ReactNode})
{
  return(
    <html lang="en">
      <body className={`${poppins.className} antialised`}>
        <Navbar />
        <LayoutWrapper>{children}</LayoutWrapper>
        <Analytics/>
        <SpeedInsights/>
        <Toaster/>
      </body>
    </html>
  );
}
