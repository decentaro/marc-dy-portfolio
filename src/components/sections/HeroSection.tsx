"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";

const EditorialHero = dynamic(() => import("@/components/ui/EditorialHero"), { ssr: false });

interface User {
  name: string;
  title: string;
  bio: string;
}

interface Skill {
  category: string;
  items: string[];
}

interface HeroSectionProps {
  user: User;
  skills: Skill[];
}

const CYCLING_ITEMS = [
  "Web Apps", "CLI Tools", "Desktop Apps",
  "Hardware & IoT", "Discord Bots", "3D CAD Designs",
];

const CANVAS_TEXT =
  "I build things that run. " +
  "Started coding 3+ years ago and haven't stopped since. " +
  "ESP32 firmware at 2am. 3D-printed enclosures because off-the-shelf never fits. " +
  "Python TUIs for the tools I wish existed. " +
  "50+ people use something I built for fun — that still surprises me. " +
  "Full-stack by trade: React on the front, .NET or FastAPI or Django on the back, Postgres underneath. " +
  "AWS when it needs to scale, Docker when it needs to ship. " +
  "Gaming is where the ideas come from. Hardware is where they get real. " +
  "I like problems that are hard enough to be interesting and useful enough to matter. " +
  "Long-term: software that supports causes worth caring about. Animal welfare, specifically. " +
  "For now: shipping things, learning fast, and making the tools I'd actually want to use.";

export default function HeroSection({ user, skills }: HeroSectionProps) {
  const [cycleIndex, setCycleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const target = CYCLING_ITEMS[cycleIndex];
    if (typing) {
      if (displayed.length < target.length) {
        const id = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 60);
        return () => clearTimeout(id);
      } else {
        const id = setTimeout(() => setTyping(false), 1800);
        return () => clearTimeout(id);
      }
    } else {
      if (displayed.length > 0) {
        const id = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
        return () => clearTimeout(id);
      } else {
        setCycleIndex((i) => (i + 1) % CYCLING_ITEMS.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, cycleIndex]);

  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center pt-16">
      <div className="max-w-5xl mx-auto w-full px-6 lg:px-8 flex flex-col">

        {/* Canvas — tightly sized to content */}
        <div style={{ height: "260px" }}>
          <Suspense fallback={null}>
            <EditorialHero name={user.name} bio={CANVAS_TEXT} />
          </Suspense>
        </div>

        {/* Typewriter + status + CTA — all on one row, no gap */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="font-mono flex items-center gap-0">
            <span className="text-cyan-400 text-sm select-none">&gt; </span>
            <span className="text-cyan-300 text-sm font-semibold ml-1">building:</span>
            <span className="text-white text-sm font-medium ml-2">{displayed}</span>
            <span
              className="inline-block w-[2px] h-[0.9em] ml-[2px] align-middle bg-cyan-400"
              style={{ opacity: cursorOn ? 1 : 0, transition: "opacity 0.1s" }}
            />
          </div>
          <div className="sm:ml-auto flex items-center gap-5">
            <span className="text-xs text-slate-600 font-mono select-none hidden sm:flex items-center gap-3">
              <span>6 projects</span>
              <span className="text-slate-700">·</span>
              <span>50+ users</span>
              <span className="text-slate-700">·</span>
              <span className="text-green-600">● live</span>
            </span>
            <a href="#projects">
              <Button size="lg" variant="light">
                View My Work <ArrowRight className="inline-block ml-2" size={18} />
              </Button>
            </a>
          </div>
        </div>

        {/* Skills strip — right below, separated by a thin line */}
        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {skills.map((group) => (
              <div key={group.category} className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                  {group.category}
                </span>
                <div className="flex flex-wrap gap-1">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs text-slate-400 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
