import type { WorkExperience } from "../../types";
import HighlightComponent from "./highlihgting_component";

const WorkExperienceRow = (param : {wexp : WorkExperience, importants : string[]})=>{

  const wexp : WorkExperience = param.wexp;

  return (

    <div className="work-experinece">
    <b><u>{wexp.inst}</u> <HighlightComponent content={wexp.role} important_parts={param.importants} /></b>  <br />
    <i>
    { wexp.date.join(" - ") }
    </i><br />

    <ul>
    {

      wexp.details.map(det => {
        return ( <li><HighlightComponent content={det} important_parts={param.importants} /></li> );
      })

    }
    </ul>

    </div>

  );

};

export default WorkExperienceRow;
