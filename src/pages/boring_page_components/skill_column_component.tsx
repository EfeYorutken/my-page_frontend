import type { Skill } from "./../../types";
import HighlightComponent from "./highlihgting_component";

type Param = {

  title : string,
  list : Skill[],
  important_parts? : string[]
};

const SkillColumn = (param : Param)=>{

  let title = param.title;
  let list = param.list;

  return (

    <div className="skill-column">
    <h2><i>{title}</i></h2>
    <ul> { 
      list.map( skill => {
        return <li>
        <HighlightComponent content={skill.name} important_parts={param.important_parts} />

        <ul>
        {
          skill.detail.map( (det : string) => {
            return (
               <li> <HighlightComponent content={det} important_parts={param.important_parts} /> </li>
            )
          })
        }
        </ul>
        </li> 
      } ) } </ul>
      </div>

  );

}

export default SkillColumn;
