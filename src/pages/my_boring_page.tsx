import { useState, useEffect } from "react";
import type { LanguageOptions } from "../types";

import Education_BoringPage from "./boring_page_components/education";
import Skills from "./boring_page_components/skills";
import WorkExperienceComponent from "./boring_page_components/work_experience";
import Certificates from "./boring_page_components/certificates";
import Projects from "./boring_page_components/projects";
import WhatIAmWorkingOn from "./boring_page_components/what_am_i_working_on";
import WhatIWillWorkingOn from "./boring_page_components/what_will_i_work_on";
import MyReplica from "./boring_page_components/my_replica";

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

  return (
    <div >

    <div className="top_menu">

    <button onClick={ toggle_theme } >{ isLight ? '☾'.toString() : '☼' }</button>
    <button onClick={ toggle_lang } >{ current_lang }</button>

    </div>

    <div className="borderable-component">
    
    < Education_BoringPage lang={current_lang} importants={importants} />

    < Skills lang={current_lang} importants={importants} />

    <Projects lang={current_lang} importants={importants} />

    <WhatIAmWorkingOn lang={current_lang} importants={importants} />

    <WhatIWillWorkingOn lang={current_lang} importants={importants} />

    <WorkExperienceComponent lang={current_lang} importants={importants} />

    <Certificates lang={current_lang} importants={importants} />

    <MyReplica 
    lang={current_lang}
    importants={importants} />

    </div>

    </div>
  );
}

export default MyBoringPage;
