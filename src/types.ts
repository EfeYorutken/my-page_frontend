export type SkillType = "fs" | "cyber" | "system" | "all";
export type LanguageOptions = "tr" | "en";
export type Language = {

  name : string,
  relation : SkillType[],
  detail : string[]

};
export type Education = {
  inst : string,
  details : string[]
};

export type Project = {
  title : string,
  techstack : string[],
  description : string,
  link? : string | null
};

export type WorkExperience = Education & {role : string, date : string[]};
export type Certificate = {
  name : string,
  instution : string,
  date : string,
  content : string[],
  image : string
};
export type Tool = Language;
export type OtherSkill = Language;

export type Skill = Language | Tool | OtherSkill;

export type Heirloom<T> = {
  title : string,
  data : T[]
};
