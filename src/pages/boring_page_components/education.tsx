import type { Education, LanguageOptions } from "../../types";
import Instution from "./education_instution_component";
import education_data from "../../data/education_data.json";
import SectionHeader from "./section_heading";

function Education_BoringPage( param : {lang : LanguageOptions, importants : string[]} ){

  const lang = param.lang;

  const education : Education[] = lang == "tr" ? education_data.tr.data : education_data.en.data;

  const title : string = param.lang == "tr" ?
    education_data.tr.title :
    education_data.en.title;

  return (

    <div className="education-section">

    <SectionHeader title={title} />

    <ul>

    {

      education.map(edu => {

        return (
          <Instution instution={edu} importants={param.importants} />
        );

      })

    }

    </ul>

    </div>

  );


}

export default Education_BoringPage;
