import type { Education } from "./../../types";
import HighlightComponent from "./highlihgting_component";

const Instution = (param : {instution : Education, importants? : string[]})=>{

  const instution = param.instution;
  const importants = param.importants;

  return (
    <li>

      <b>{instution.inst}</b>
      <ul>
      {

        instution.details.map(det => {

          return (
          <li>
            <HighlightComponent content={det} important_parts={importants} />
          </li>
          );

        })

      }
      </ul>

    </li>
  );

};

export default Instution;
