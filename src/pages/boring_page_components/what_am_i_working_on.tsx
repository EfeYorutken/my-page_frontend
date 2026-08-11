import project_data from "../../data/project_data/current_projects_data.json";
import type { LanguageOptions, Project } from "../../types"
import ProjectLike from "./project_like_component";

const WhatIAmWorkingOn = (param : {lang : LanguageOptions, importants : string[]})=>{

  const projects : Project[] = param.lang == "tr" ?
    project_data.tr.data as Project[]:
    project_data.en.data as Project[];

  const title : string = param.lang == "tr" ?
    project_data.tr.title:
    project_data.en.title;

  return (
    <div className="current-projects">

    <ProjectLike  title={title} elements={projects} importants={param.importants} />

    </div>
  );


};

export default WhatIAmWorkingOn;
