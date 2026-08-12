import type { LanguageOptions } from "../../types";
import SectionHeader from "./section_heading";
import replica_data from "../../data/replica_data.json";
import HighlightComponent from "./highlihgting_component";

import { useKeenSlider } from "keen-slider/react";
import 'keen-slider/keen-slider.min.css'
import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";

enum emotions {
  happy = 'comics/my_comic_happy.jpg',
    neutral = 'comics/my_comic_neutral.jpg',
    sad = 'comics/my_comic_sad.png',
    thinking = 'comics/my_comic_thinking.png',
    very_happy = 'comics/my_comic_very_happy.jpg'
};


type AnswerChunk = {
  content : string,
  emotion : emotions
};

const MyReplica = ( param : {lang : LanguageOptions, importants : string[]} )=>{

  let [ai_answer, mut_ai_answer] = useState<AnswerChunk[]>([]);
  const [display_answer, mut_display_answer] = useState(ai_answer);
  let [ comic_location, mut_comic_location ] = useState(emotions.neutral);

  const aiRef = useRef(ai_answer);
  const probeRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [ sliderRef, instanceRef ] = useKeenSlider({
    loop : true,
    slideChanged() {
    },
    slides : { perView : 1 }
  });

  useEffect(()=>{
    aiRef.current = ai_answer;
  }, [ai_answer]);

  useEffect(()=>{

    if(instanceRef){
      instanceRef.current?.update();
    }

  }, [display_answer, instanceRef]);

  const fits = useCallback((text: string): boolean => {
    const probe = probeRef.current;
    if (!probe) return true;
    if (probe.clientHeight === 0) return true;
    probe.textContent = text;
    return probe.scrollHeight <= probe.clientHeight;
  }, []);

  const chunkText = useCallback((text: string): string[] => {
    const pieces: string[] = [];
    let remaining = text;

    while (remaining.length > 0) {
      if (fits(remaining)) {
        pieces.push(remaining);
        break;
      }

      let lo = 1;
      let hi = remaining.length;

      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        if (fits(remaining.slice(0, mid))) {
          lo = mid;
        } else {
          hi = mid - 1;
        }
      }

      let cut = lo;
      const lastSpace = remaining.lastIndexOf(" ", cut);
      if (lastSpace > 0) cut = lastSpace;
      if (cut < 1) cut = 1;

      pieces.push(remaining.slice(0, cut));
      remaining = remaining.slice(cut).replace(/^\s+/, "");
    }

    return pieces;
  }, [fits]);

  const recompute = useCallback((raw: AnswerChunk[]): void => {
    const probe = probeRef.current;
    if (!probe || probe.clientHeight === 0) return;

    const next: AnswerChunk[] = raw.flatMap(chunk => {
      return chunkText(chunk.content).map(content => {
        return { content, emotion: chunk.emotion };
      });
    });

    mut_display_answer(prev => {
      return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
    });
  }, [chunkText]);

  useLayoutEffect(()=>{
    recompute(ai_answer);
  }, [ai_answer, recompute]);

  useEffect(()=>{
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new ResizeObserver(() => {
      recompute(aiRef.current);
    });
    observer.observe(wrapper);

    return () => observer.disconnect();
  }, [recompute]);

  const ask = async () => {
    console.log('starting');
    mut_ai_answer([]);

    const textareaElement = document.getElementById("textarea") as HTMLTextAreaElement;
    const question: string = textareaElement ? textareaElement.value : "";

    const payload = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: question, language: param.lang })
    };

    console.log(`asking '${question}' for lang ${param.lang}`);
    const responce = await fetch("https://my-page-backend-1.onrender.com/query", payload);

    if (!responce.ok) {
      mut_ai_answer([{ content: "I am sleeping apparently, try again later", emotion: emotions.neutral }]);
      return;
    }

    if (responce.body == null) {
      console.error('[ERR] responce.body is null');
      return;
    }

    try {


      const decoder = new TextDecoder("utf-8");
      let temp = '';
      const emotion_finder = new RegExp('\\[(happy|sad|very_happy|thinking|neutral)\\]','i');

      for await (const chunk of responce.body) {
        temp += decoder.decode(chunk);

        if(temp.match(emotion_finder)){
          const [ pre, emotion, post ] = temp.split(emotion_finder)

          console.log(`${pre} => ${emotion} => ${post}`);

          let chunks_emotion : emotions = emotions.neutral;

          switch(emotion.toLowerCase()){
              case 'happy':
                chunks_emotion = emotions.happy;
                break;
              case 'neutral':
                chunks_emotion = emotions.neutral;
                break;
              case 'sad':
                chunks_emotion = emotions.sad;
                break;
              case 'thinking':
                chunks_emotion = emotions.thinking;
                break;
              case 'very_happy':
                chunks_emotion = emotions.very_happy;
                break;
              default:
                console.warn(`unknown emotion ${emotion}`);
                chunks_emotion = emotions.neutral;
          }

            mut_ai_answer((prev: AnswerChunk[]) => {
              return [...prev, { content: pre, emotion: chunks_emotion }];
            });
            temp = post;

        }

        if (temp.length >= 400) {
          const stableSnapshot = temp;
          temp = '';

          mut_ai_answer((prev: AnswerChunk[]) => {
            return [...prev, { content: stableSnapshot, emotion: emotions.neutral }];
          });
        }
      }

      if (temp.trim().length > 0) {
        const finalSnapshot = temp;
        temp = '';

        mut_ai_answer((prev: AnswerChunk[]) => {
          return [...prev, { content: finalSnapshot, emotion: emotions.neutral }];
        });
      }

    } catch (err) {
      console.error(`[ERR] somehow the response cant be read ${err}`);
    }


    console.log('done');
  };

  let title = param.lang == "tr" ? replica_data.tr.title :
    replica_data.en.title;

  let submit_text = param.lang == "tr" ? replica_data.tr.submit_text :
    replica_data.en.submit_text;

  let textarea_text = param.lang == "tr" ? replica_data.tr.textarea_text :
    replica_data.en.textarea_text;

  let textarea_placeholder = textarea_text + " ✎";

  return (
    <div className="replica-wrapper">

    <SectionHeader title={title} />

    <div className="comic-me">
    <img src={comic_location}/>
    </div>


    <div className="replica-content-wrapper">

    <div className="messaging">

    <div id="answer">

    <div className="response-section">

    <button className="prev_button" onClick={()=>{
      instanceRef.current?.prev();
      const index = instanceRef.current?.track.details.rel as number - 1;
      mut_comic_location( display_answer.at(index)?.emotion as emotions );
    }}>&larr;</button>

    <button className="next_button" onClick={()=>{
      instanceRef.current?.next()
      const index = instanceRef.current?.track.details.rel as number - 1;
      mut_comic_location( display_answer.at(index)?.emotion as emotions );
    }
    }>&rarr;</button>

    <div className="slider-wrapper" ref={wrapperRef}>
    <div ref={probeRef} className="fit-probe"></div>

    <div ref={sliderRef} className="keen-slider">

    { display_answer.map(ans =>   {

      return (
        <p className="keen-slider__slide"> <HighlightComponent  content={ans.content} important_parts={param.importants} /> </p>
      );
    }) }

    </div>
    </div>

    </div>

    </div>

    <textarea id="textarea" placeholder={textarea_placeholder} /> <button onClick={ask}>{submit_text}</button>

    </div>

    </div>

    </div>
  );

};

export default MyReplica;
