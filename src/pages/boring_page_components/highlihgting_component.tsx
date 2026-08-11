type Param = {
 content : string;
 important_parts? : string[];
}

const HighlightComponent = ({ content, important_parts } : Param) => {

  const importants : Set<string> = new Set(important_parts);
  let properly_splitted = content.split(" ");
  let parts : string[] = [];

  if(important_parts !=  undefined){

    parts = important_parts.map(ip => {
      return ip.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    });

    const regex = new RegExp(`(${parts.join("|")})`, "g");

    properly_splitted = content.split(regex);

  }

  return (
    <>
    {
      properly_splitted.map( c => {
        if(importants.has(c)){
          return <span className="important-item">{c+" "}</span>
        }
        else{
          return c+" "
        }
      } )
    }
    </>
  );

};

export default HighlightComponent;
