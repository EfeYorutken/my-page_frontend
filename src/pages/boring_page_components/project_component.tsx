import type { Project } from "./../../types";
import HighlightComponent from "./highlihgting_component";

const ProjectComponent = (param : {project : Project | undefined, importants : string[] })=>{

  const project = param.project;

  if(param.project ==  undefined){

    return (
   <div className="project">

   <p>
   could not find projects
   </p>

   </div>
    );

  }
  else{
    return (

      <div className="project">

      {
        project?.link == null ? (<h4>{project?.title}</h4>)
          : (<a href={project?.link}><h4>{project?.title}</h4></a>)
      }


      <i> <HighlightComponent 
      content={ project!.techstack.join(", ") } 
      important_parts={param.importants}  /> </i>

      <p> <HighlightComponent
      content={ project!.description }
      important_parts={param.importants} /> </p>

      </div>

    );
  }

};

export default ProjectComponent;
