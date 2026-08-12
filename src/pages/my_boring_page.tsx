import { useState, useEffect, useRef } from "react";
import type { LanguageOptions } from "../types";

import Education_BoringPage from "./boring_page_components/education";
import Skills from "./boring_page_components/skills";
import WorkExperienceComponent from "./boring_page_components/work_experience";
import Certificates from "./boring_page_components/certificates";
import Projects from "./boring_page_components/projects";
import WhatIAmWorkingOn from "./boring_page_components/what_am_i_working_on";
import WhatIWillWorkingOn from "./boring_page_components/what_will_i_work_on";
import MyReplica from "./boring_page_components/my_replica";

const rowTop = (d : number) : string => {
  if (d > 2) return `${88 + (d - 2) * 12}vh`;
  if (d < -2) return `${(d + 2) * 12}vh`;
  const tops = [0, 12, 24, 76, 88];
  return `${tops[d + 2]}vh`;
};

type SwitchParam = {
  left: React.ReactNode;
  right: React.ReactNode;
  thumb: "left" | "right";
  onClick: () => void;
};

const Switch = ({ left, right, thumb, onClick }: SwitchParam) => (
  <button className={"switch" + (thumb === "right" ? " thumb-right" : "")} onClick={onClick}>
    <span className="switch-option">{left}</span>
    <span className="switch-thumb" />
    <span className="switch-option">{right}</span>
  </button>
);

function MyBoringPage(){

  const importants = [
    "Computer Engineering",
    "Bilgisayar Mühendisliği",
    "CyberTEDU",
    "Secondary Field",
    "Yan Dal",
    "High Level",
    "Yüksek seviye",
    "Fullstack Developer",
    "Developer Advocate",
    "Typescript",
    "Rust",
    "C++",
    "C++20",
  ];

  let [ current_lang, change_lang2 ] = useState<LanguageOptions>("en");
  let [isLight, mut_theme] = useState(false);

  const [active, mutActive] = useState(0);
  const accRef = useRef(0);
  const cooldownRef = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    if (isLight) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isLight]);

  const toggle_theme = ()=>{ mut_theme(!isLight) }

  const toggle_lang = ()=>{

    const lang2 : LanguageOptions = localStorage.getItem("lang") == "en" ? "tr" : "en";

    change_lang2(lang2);
    localStorage.setItem("lang", lang2);
  }

  const sections = [
    <Education_BoringPage lang={current_lang} importants={importants} />,
    <Skills lang={current_lang} importants={importants} />,
    <Projects lang={current_lang} importants={importants} />,
    <WhatIAmWorkingOn lang={current_lang} importants={importants} />,
    <WhatIWillWorkingOn lang={current_lang} importants={importants} />,
    <WorkExperienceComponent lang={current_lang} importants={importants} />,
    <Certificates lang={current_lang} importants={importants} />,
    <MyReplica lang={current_lang} importants={importants} />,
  ];

  const section_count = sections.length;

  const step = (dir : number) => {
    mutActive(prev => Math.min(section_count - 1, Math.max(0, prev + dir)));
  };

  const onWheel = (e : React.WheelEvent) => {
    accRef.current += e.deltaY;

    const now = Date.now();
    if (now - cooldownRef.current < 250) return;
    if (Math.abs(accRef.current) >= 48) {
      step(accRef.current > 0 ? 1 : -1);
      accRef.current = 0;
      cooldownRef.current = now;
    }
  };

  const onTouchStart = (e : React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    accRef.current = 0;
  };

  const onTouchMove = (e : React.TouchEvent) => {
    const dy = e.touches[0].clientY - touchStartY.current;
    accRef.current = dy;

    const now = Date.now();
    if (now - cooldownRef.current < 250) return;
    if (Math.abs(accRef.current) >= 48) {
      step(accRef.current < 0 ? 1 : -1);
      touchStartY.current = e.touches[0].clientY;
      accRef.current = 0;
      cooldownRef.current = now;
    }
  };

  return (
    <div className="wheel-viewport" onWheel={onWheel} onTouchStart={onTouchStart} onTouchMove={onTouchMove}>

    <div className="top_menu">

    <Switch left="☼" right="☾" thumb={isLight ? "right" : "left"} onClick={toggle_theme} />
    <Switch left="en" right="tr" thumb={current_lang === "en" ? "right" : "left"} onClick={toggle_lang} />

    </div>

    {
      sections.map( (section, i) => {

        const d = i - active;

        return (
          <div key={i} className={"wheel-segment" + (d === 0 ? " active" : "")} style={{ top: rowTop(d), height: d === 0 ? "52vh" : "12vh" }}>
            {section}
          </div>
        );
      })
    }

    { active < 2 ? <div className="wheel-segment ghost" style={{ top: "0", height: "12vh" }} /> : null }
    { active === 0 ? <div className="wheel-segment ghost" style={{ top: "12vh", height: "12vh" }} /> : null }

    { active >= section_count - 1 ? <div className="wheel-segment ghost" style={{ top: "76vh", height: "12vh" }} /> : null }
    { active >= section_count - 2 ? <div className="wheel-segment ghost" style={{ top: "88vh", height: "12vh" }} /> : null }

    </div>
  );
}

export default MyBoringPage;
