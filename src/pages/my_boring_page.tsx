import { useState, useEffect, useLayoutEffect, useRef } from "react";
import type { LanguageOptions } from "../types";

import Education_BoringPage from "./boring_page_components/education";
import Skills from "./boring_page_components/skills";
import WorkExperienceComponent from "./boring_page_components/work_experience";
import Certificates from "./boring_page_components/certificates";
import Projects from "./boring_page_components/projects";
import WhatIAmWorkingOn from "./boring_page_components/what_am_i_working_on";
import WhatIWillWorkingOn from "./boring_page_components/what_will_i_work_on";
import MyReplica from "./boring_page_components/my_replica";

const rowTop = (d : number, activeH : number) : string => {
  if (d <= 0) return `${(d + 2) * 12}vh`;
  return `calc(24vh + ${activeH}px + 2px + ${(d - 1) * 12}vh)`;
};

const DEFAULT_ACTIVE_H = () => window.innerHeight * 0.52;

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

  const [heights, mutHeights] = useState<number[]>([]);
  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);

  const sections = [
    <Education_BoringPage lang={current_lang} importants={importants} />,
    <Skills lang={current_lang} importants={importants} />,
    <Projects lang={current_lang} importants={importants} />,
    <WhatIAmWorkingOn lang={current_lang} importants={importants} />,
    <WhatIWillWorkingOn lang={current_lang} importants={importants} />,
    <WorkExperienceComponent lang={current_lang} importants={importants} />,
    <Certificates lang={current_lang} importants={importants} targetHeight={heights[5]} />,
    <MyReplica lang={current_lang} importants={importants} />,
  ];

  const section_count = sections.length;

  useLayoutEffect(() => {
    mutHeights(prev => {
      const next = [...prev];
      measureRefs.current.forEach((el, i) => {
        if (el) next[i] = el.offsetHeight;
      });
      return next;
    });
  }, []);

  useEffect(() => {
    const observers: ResizeObserver[] = [];

    measureRefs.current.forEach((el, i) => {
      if (!el) return;

      const observer = new ResizeObserver(() => {
        mutHeights(prev => {
          const h = el.offsetHeight;
          if (prev[i] === h) return prev;
          const next = [...prev];
          next[i] = h;
          return next;
        });
      });

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

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
        const activeH = heights[active] || DEFAULT_ACTIVE_H();

        return (
          <div key={i} className={"wheel-segment" + (d === 0 ? " active" : "")} style={{ top: rowTop(d, activeH), height: d === 0 ? `calc(${activeH}px + 2px)` : "12vh" }}>
            <div ref={(el) => { measureRefs.current[i] = el; }}>{section}</div>
          </div>
        );
      })
    }

    </div>
  );
}

export default MyBoringPage;
