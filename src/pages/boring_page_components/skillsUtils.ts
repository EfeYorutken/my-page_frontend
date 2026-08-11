import type { SkillType, Skill } from "../../types";

const filter_skills = (skills : Skill[], relation : SkillType) : Skill[] =>{

  return skills.filter( s => {
    return s.relation.includes(relation) || relation == "all";
  } );

};

export default filter_skills;
