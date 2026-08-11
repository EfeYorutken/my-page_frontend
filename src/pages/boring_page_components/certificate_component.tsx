import type { Certificate } from "./../../types";
import HighlightComponent from "./highlihgting_component";

const CertificateComponent = (param : {certificate : Certificate, importants : string[]})=>{

  const certificate = param.certificate;

  return (
    <div className="certificate">

    <div className="certificate-body">

    <div className="certificate-info">

    <h4>
      <HighlightComponent content={certificate.name} important_parts={param.importants} />
    </h4>

    <i>
      <HighlightComponent content={certificate.instution} important_parts={param.importants} />
    </i>
    <br />
    <i>
      { certificate.date }
    </i>

    <ul>
    {
      certificate.content.map(item => {
        return ( <li><HighlightComponent content={item} important_parts={param.importants} /></li> );
      })
    }
    </ul>

    </div>

    <div className="image-section">
    <img src={certificate.image}/>
    </div>

    </div>

    </div>
  );

};

export default CertificateComponent;
