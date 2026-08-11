import language_skills from "../../data/skills_data/language_skills.json";
import tool_skills from "../../data/skills_data/tool_skill.json";
import other_skill from "../../data/skills_data/other_skill.json";
import skills2names from "../../data/skills_data/short_to_long_skill_names.json";

import type { SkillType, Language, Tool, OtherSkill, LanguageOptions } from "../../types"; 
import filter_skills from "./skillsUtils";
import { useState } from "react";
import SkillColumn from "./skill_column_component";
import SectionHeader from "./section_heading";



function Skills( param : {lang : LanguageOptions, importants : string[]} ){

  const skillmap = skills2names as Record<string, string>;

  let other_skill_title = param.lang == "tr" ?
    other_skill.tr.title :
    other_skill.en.title;
  let other_skills = param.lang == "tr" ?
    other_skill.tr.data as OtherSkill[]:
    other_skill.en.data as OtherSkill[];

  let language_skills_title = param.lang == "tr" ?
    language_skills.title.tr : 
    language_skills.title.en;
  let langs = language_skills.data as Language[];

  const tools_title = param.lang == "tr" ?
    tool_skills.title.tr :
    tool_skills.title.en;
  const tools : Tool[] = tool_skills.data as Tool[];

  const skillset : SkillType[] = [
    ... new Set( langs.map( l => l.relation ).flat() )
  ];
  skillset.push("all");

  let [ selected_skill_set, mut_skill_set ] = useState("fs" as SkillType);
  let [ selected_language,  mut_language  ] = useState(filter_skills(langs, selected_skill_set));
  let [ selected_tools,     mut_tools     ] = useState(filter_skills(tools, selected_skill_set));

  const selected_other_skills = filter_skills(other_skills, selected_skill_set);

  const skills_title : string = param.lang == "tr" ?
    "Beceriler" :
    "Skills";

  const select_on_change = (new_ss_e : React.ChangeEvent<HTMLSelectElement> )=>{

      const new_ss : SkillType = new_ss_e.target.value as SkillType;

      mut_skill_set(new_ss);
      mut_language(filter_skills(langs, new_ss));
      mut_tools(filter_skills(tools, new_ss));

    }

  return (

    <div className="skill-column-wrapper">

    <SectionHeader title={skills_title}/>

    <select onChange={select_on_change}>

    {
      skillset.map((ss : string) => {

        const skill_name : string = skillmap[ss];

        return (
          <option className={ss} value={ss}>{skill_name}</option>
        )
      })
    }

    </select>

    <br />

    <SkillColumn title={language_skills_title} list={selected_language} important_parts={[
      "C++20",
      "Rust",
      "TypeScript"
    ]} />
    <SkillColumn title={tools_title} list={selected_tools} important_parts={[
      "Linux",
      "Git",
      "NodeJs"
    ]}
    />
    <SkillColumn title={other_skill_title} list={selected_other_skills} />

    </div>

  );
}

export default Skills;
