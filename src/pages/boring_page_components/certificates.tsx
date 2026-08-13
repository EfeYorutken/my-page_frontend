import { useLayoutEffect, useRef, useState } from "react";
import type { LanguageOptions, Certificate } from "./../../types"
import certifications_data from "../../data/certifications.json";
import CertificateComponent from "./certificate_component";
import SectionHeader from "./section_heading";

import { useKeenSlider } from "keen-slider/react";
import 'keen-slider/keen-slider.min.css'

const Certificates = (param : {lang : LanguageOptions, importants : string[], targetHeight? : number})=>{

  const certificates : Certificate[] = param.lang == "tr" ?
    certifications_data.data.tr as Certificate[]:
    certifications_data.data.en as Certificate[];

  const title : string = param.lang == "tr" ?
    certifications_data.title.tr:
    certifications_data.title.en;

  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, mutHeaderHeight] = useState(0);

  useLayoutEffect(() => {
    mutHeaderHeight(headerRef.current?.offsetHeight ?? 0);
  }, []);

  const cardMinHeight = Math.max(0, (param.targetHeight ?? 0) - headerHeight);

  const [ sliderRef, instanceRef ] = useKeenSlider({
    loop : true,
    slideChanged() {
    }
  });

  return (
    <div className="project-wrapper">

    <div ref={headerRef}>
    <SectionHeader title={title}/>
    </div>

    <button onClick={ ()=>{instanceRef.current?.prev()} }className="prev_button">&larr;</button>

    <div className="slider-wrapper">
    <div ref={sliderRef} className="keen-slider">

    { certificates.map(cert => {
        return (
          <div className="keen-slider__slide"> <CertificateComponent certificate={cert} importants={param.importants} minHeight={cardMinHeight} /> </div>
        );
      }) }

    </div>
    </div>

    <button onClick={ ()=>{instanceRef.current?.next()} } className="next_button">&rarr;</button>
    </div>
  );

};

export default Certificates;
