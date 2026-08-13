import type { Project } from "./../../types"
import ProjectComponent from "./project_component";
import SectionHeader from "./section_heading"

import { useKeenSlider } from "keen-slider/react";
import 'keen-slider/keen-slider.min.css'

const ProjectLike = (param : {title : string, elements : Project[], importants : string[]})=>{

  const projects : Project[] = param.elements;
  const [ sliderRef, instanceRef ] = useKeenSlider({
    loop : true,
    slideChanged() {
    }
  });


  return (
    <div className="project-wrapper">
    <SectionHeader title={param.title}/>

    <button onClick={ ()=>{instanceRef.current?.prev()} }className="prev_button">&larr;</button>

    <div className="slider-wrapper">
    <div ref={sliderRef} className="keen-slider">

    { projects.map(proj => {
        return (
          <div className="keen-slider__slide"> <ProjectComponent  project={proj} importants={param.importants} /> </div>
        );
      }) }

    </div>
    </div>


    <button onClick={ ()=>{instanceRef.current?.next()} } className="next_button">&rarr;</button>
    </div>
  );


};

export default ProjectLike;
