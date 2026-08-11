import wexp from "../../data/work_experience.json";
import type { WorkExperience, LanguageOptions } from "../../types"
import WorkExperienceRow from "./work_experience_row";
import SectionHeader from "./section_heading";

const WorkExperienceComponent = (param : {lang : LanguageOptions, importants : string[]}) => {

  const { title, data } = param.lang == "tr"?
  wexp.tr:
    wexp.en;

  return (
    <div className="work-experince-wrapper">

    <SectionHeader title={title}/>

    <ul>

    {

      data.map( (wxp : WorkExperience) => {

        return (

          <li>
          <WorkExperienceRow wexp={wxp} importants={param.importants} />
          </li>

        );

      } )

    }
    </ul>

    </div>
  );

};

export default WorkExperienceComponent;
