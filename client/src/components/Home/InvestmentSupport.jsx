import React, { useRef, useEffect } from 'react';

// Data for the investment support items
const items = [ 
  { 
    title: 'Evidence-Based Tools', 
    link: '/loremcreative', 
    text: `Guided by the latest psychology and neuroscience`, 
  }, 
  { 
    title: 'Safe & Anonymous', 
    link: '/loremconnect', 
    text: `No judgments, just safe conversations`, 
  }, 
  { 
    title: 'Real Human Support', 
    link: '/training', 
    text: `Kind empathetic listeners (AI-assisted for now)`, 
  }, 
  { 
    title: 'Easy Access', 
    link: '/training', 
    text: `Anytime, anywhere, at your pace`, 
  }, 
]; 

const InvestmentSupport = () => { 
  const wrapperRef = useRef(null); 

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            entry.target.classList.remove('hidden');
          } else {
            entry.target.classList.remove('active');
            // Optionally add 'hidden' back if you want it to hide when not intersecting
            // entry.target.classList.add('hidden'); 
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    const currentRef = wrapperRef.current;

    if (currentRef) {
      observer.observe(currentRef);
      // Set initial state: make it active and visible immediately
      currentRef.classList.add('active');
      currentRef.classList.remove('hidden');
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return ( 
    <section className="investment_support bg-white shadow-md border-b border-border/40 backdrop-blur-lg" style={{ backgroundColor: '#ffffff' }}> 
      <div className="container"> 
        <div className="wrapper" ref={wrapperRef}> 
          <div className="focus_block"> 
            <div className="focus_item"></div> 
            <div className="focus_item"></div> 
          </div> 
          <div className="row"> 
            {items.map((item, index) => ( 
              <div className="item col-md-6 col-sm-12 col-12" key={index}> 
                <div className="item_wrap"> 
                  <div className="head"> 
                    <h4><span>{item.title}</span></h4> 
                    <a href={item.link}> 
                      <img 
                        src="themes/custom/resibario/images/dark_arrow_right.svg" 
                        alt="" 
                      /> 
                    </a> 
                  </div> 
                  <div className="text"> 
                    <p>{item.text}</p> 
                  </div> 
                </div> 
              </div> 
            ))} 
          </div> 
        </div> 
      </div> 
    </section> 
  ); 
};

export default InvestmentSupport;