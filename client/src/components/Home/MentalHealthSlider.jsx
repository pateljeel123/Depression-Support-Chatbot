import React, { useState } from 'react';

const MentalHealthSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Youth Suicide: A Silent Global Emergency",
      problem: "Suicide is the second leading cause of death among adolescents worldwide.",
      stats: "Over 700,000 people die by suicide every year — that's one every 40 seconds.",
      taglines: [
        "Their Future Shouldn't End at Fifteen.",
        "Hear the Silence. Stop the Suicide.",
        "One Every 40 Seconds — How Many More?"
      ],
      emoji: "🧨"
    },
    {
      title: "Girls Cry, Boys Die: The Gender Suicide Paradox",
      problem: "Women are 50% more likely to experience depression, but men are 3 to 4 times more likely to die by suicide.",
      stats: "77% of global suicides are by men — often due to social stigma and underdiagnoses.",
      taglines: [
        "Different Symptoms. Same Suffering.",
        "Masculinity Shouldn't Be a Death Sentence.",
        "He Was Strong. But Still Lost."
      ],
      emoji: "🚻"
    },
    {
      title: "Teen Girls in Crisis: Suicide Attempts Are Soaring",
      problem: "Suicide attempts among adolescent girls have nearly doubled in the past decade.",
      stats: "In the U.S., nearly 1 in 10 teen girls attempted suicide in the past year — a 51% increase since 2019.",
      taglines: [
        "They're Not Being Dramatic. They're Drowning.",
        "A Generation Crying for Help — Loudly.",
        "She Deserves to Grow, Not Just Survive."
      ],
      emoji: "👧"
    },
    {
      title: "The Anxiety Explosion: A Youth Epidemic",
      problem: "Between 1990 and 2021, anxiety disorders among youth surged by 52% globally.",
      stats: "In 2021 alone, 16 million new cases of youth anxiety were recorded.",
      taglines: [
        "This Is More Than Just Stress.",
        "We're Losing Our Calm — One Child at a Time.",
        "From Panic to Peace — With Help."
      ],
      emoji: "😰"
    },
    {
      title: "Global Depression: The Hidden Pandemic",
      problem: "Depression is the leading cause of disability worldwide, affecting every age group.",
      stats: "Over 280 million people live with depression globally, yet 60% receive no treatment.",
      taglines: [
        "Depression Isn't Just Sadness. It's Suffering.",
        "Invisible. Untreated. Everywhere.",
        "One in Twenty Is Drowning Right Now."
      ],
      emoji: "🌍"
    },
    {
      title: "Aging in Isolation: The Forgotten Mental Health Crisis",
      problem: "Elderly mental health is underdiagnosed due to stigma, isolation, and lack of screening.",
      stats: "Nearly 6% of older adults suffer from depression, often linked to loneliness and bereavement.",
      taglines: [
        "Mental Health Doesn't Expire at 65.",
        "They Gave Us Everything — Let's Not Forget Them.",
        "Loneliness Is a Disease Too."
      ],
      emoji: "👵"
    },
    {
      title: "Childhood Depression: Diagnosed Too Late, Too Often",
      problem: "Depression can begin as early as age 3, but most cases are missed or misunderstood.",
      stats: "1 in 100 children under 13 has depression — yet most go untreated.",
      taglines: [
        "Even Little Minds Can Break.",
        "Catch It Early. Heal for Life.",
        "Children Don't Always Say It. But They Feel It."
      ],
      emoji: "🧒"
    },
    {
      title: "Mental Health Inequality: A Global Disgrace",
      problem: "In many low-income nations, 3 out of 4 people receive no mental health treatment at all.",
      stats: "Mental health care receives less than 2% of health budgets in most countries.",
      taglines: [
        "Care Shouldn't Be a Luxury.",
        "Mental Health Is Not a Privilege — It's a Right.",
        "Geography Shouldn't Decide Who Gets to Heal."
      ],
      emoji: "⚖️"
    },
    {
      title: "Indigenous Youth: Suicide at Catastrophic Rates",
      problem: "American Indian and Alaska Native youth have suicide rates up to 3x higher than national averages.",
      stats: "Suicide is the leading cause of death among Indigenous youth in several regions.",
      taglines: [
        "This Is a Crisis of Culture and Care.",
        "They Deserve More Than Our Apologies.",
        "Revive Their Futures. Respect Their Roots."
      ],
      emoji: "🏹"
    },
    {
      title: "Social Media: The New Mental Health Battleground",
      problem: "Screen addiction, cyberbullying, and online comparison are fueling depression and anxiety — especially in teens.",
      stats: "Teen girls spending 5+ hours/day on social media are 3x more likely to have depression.",
      taglines: [
        "Swipe Less. Speak More.",
        "What They Post Isn't Who They Are — But It Hurts All the Same.",
        "Don't Let Likes Define Their Life."
      ],
      emoji: "📱"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="w-full mx-auto p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-xl">
      <h1 className="text-4xl font-bold text-center mb-10 text-indigo-800 drop-shadow-sm">
        🧠 <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">10 Alarming Mental Health Crises</span>
      </h1>
      
      <div className="relative overflow-hidden rounded-xl bg-white shadow-lg border border-indigo-100 hover:shadow-xl transition-shadow duration-300">
        {/* Slide */}
        <div className="p-8 transition-all duration-500 ease-in-out">
          <div className="flex items-center mb-6 border-b border-indigo-100 pb-4">
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <span className="text-5xl">{slides[currentSlide].emoji}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 leading-tight">{slides[currentSlide].title}</h2>
          </div>
          
          <div className="mb-8 space-y-6">
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <p className="text-lg font-semibold text-red-600 mb-2 flex items-center">
                <span className="mr-2">🧨</span> Problem:
              </p>
              <p className="text-gray-700 text-lg">{slides[currentSlide].problem}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-lg font-semibold text-blue-600 mb-2 flex items-center">
                <span className="mr-2">📊</span> Stats:
              </p>
              <p className="text-gray-700 text-lg">{slides[currentSlide].stats}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <p className="text-lg font-semibold text-purple-600 mb-2 flex items-center">
                <span className="mr-2">🔥</span> Taglines:
              </p>
              <ul className="list-none space-y-2">
                {slides[currentSlide].taglines.map((tagline, index) => (
                  <li key={index} className="text-gray-700 italic pl-4 border-l-2 border-purple-300 py-1">"{tagline}"</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-100">
          <button 
            onClick={prevSlide}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition shadow-md hover:shadow-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Previous
          </button>
          
          <div className="flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-gradient-to-r from-indigo-600 to-purple-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            onClick={nextSlide}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition shadow-md hover:shadow-lg flex items-center"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">🔎 Mental Health Crisis Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-indigo-100 transform hover:-translate-y-1">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center">
                <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
                  <span className="text-3xl">{slide.emoji}</span>
                </div>
                <h4 className="font-bold text-lg truncate">{slide.title}</h4>
              </div>
              <div className="p-5">
                <div className="mb-4 bg-indigo-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-indigo-700 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                    Statistical Snapshot:
                  </p>
                  <p className="text-gray-700 text-sm">{slide.stats.split('—')[0].trim()}</p>
                </div>
                
                {slide.stats.includes('—') && (
                  <div className="mb-4 bg-red-50 p-3 rounded-lg">
                    <p className="text-sm font-semibold text-red-600 mb-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Time-Based Urgency:
                    </p>
                    <p className="text-gray-700 text-sm">{slide.stats.split('—')[1].trim()}</p>
                  </div>
                )}
                
                <div className="bg-purple-50 p-3 rounded-lg">
                   <p className="text-sm font-semibold text-purple-600 mb-1 flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                     </svg>
                     Key Tagline:
                   </p>
                   <p className="text-gray-700 text-sm italic">"{slide.taglines[0]}"</p>
                 </div>
                 
                 <button 
                   onClick={() => goToSlide(index)}
                   className="mt-5 w-full py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-300 text-sm font-medium flex items-center justify-center shadow-sm hover:shadow-md"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                     <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                     <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                   </svg>
                   View Details
                 </button>
               </div>
             </div>
           ))}
         </div>
       </div>
     </div>
    );
};

export default MentalHealthSlider;