import React, { useEffect, useState, useRef } from "react";
import "../style/About.css";
import techImg from "../img/1.jpg"; // Texnologiya uchun rasm

const About = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className={`about-section ${isVisible ? "visible" : ""}`}>
      <div className="about-container">
        <div className="about-image">
          <img
            src={techImg}
            alt="Technology Solutions"
            className="tech-image"
          />
        </div>
        <div className="about-content">
          <h2 className={`about-title ${isVisible ? "visible" : ""}`}>
            We Offer Innovative Technology Solutions
          </h2>
          <p className={`about-desc ${isVisible ? "visible" : ""}`}>
            EceRaSystem is a full-service digital marketing agency with a long
            history of delivering great results for our clients. We take an
            individualized approach to every customer project. In some cases we
            may focus more on SEO, while in others we'll dig more into PPC,
            social media or conversion optimization.
          </p>
          <div className="skill-bar">
            <div className="skill">
              <span className={`skill-label ${isVisible ? "visible" : ""}`}>
                UI/UX Design (90%)
              </span>
              <div className="bar">
                <div
                  className={`progress ${isVisible ? "visible" : ""}`}
                  style={{ width: isVisible ? "90%" : "0%" }}
                ></div>
              </div>
            </div>
            <div className="skill">
              <span className={`skill-label ${isVisible ? "visible" : ""}`}>
                APP Development (85%)
              </span>
              <div className="bar">
                <div
                  className={`progress ${isVisible ? "visible" : ""}`}
                  style={{ width: isVisible ? "85%" : "0%" }}
                ></div>
              </div>
            </div>
            <div className="skill">
              <span className={`skill-label ${isVisible ? "visible" : ""}`}>
                WEB Development (70%)
              </span>
              <div className="bar">
                <div
                  className={`progress ${isVisible ? "visible" : ""}`}
                  style={{ width: isVisible ? "70%" : "0%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;