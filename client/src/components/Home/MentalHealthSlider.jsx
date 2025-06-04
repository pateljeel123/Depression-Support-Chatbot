import React, { useState, useEffect } from 'react';
import { FaSkull, FaVenusMars, FaChild, FaGlobeAmericas, FaBalanceScale, FaMobileAlt } from 'react-icons/fa';
import { GiBrain, GiMeditation, GiHeartBeats } from 'react-icons/gi';
import { MdOutlineElderly } from 'react-icons/md';
import { RiMentalHealthFill } from 'react-icons/ri';

const MentalHealthSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rotation, setRotation] = useState(0);

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
      icon: <FaSkull className="text-red-500" />
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
      icon: <FaVenusMars className="text-blue-500" />
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
      icon: <FaChild className="text-pink-500" />
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
      icon: <GiBrain className="text-yellow-500" />
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
      icon: <FaGlobeAmericas className="text-green-500" />
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
      icon: <MdOutlineElderly className="text-purple-500" />
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
      icon: <RiMentalHealthFill className="text-blue-400" />
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
      icon: <FaBalanceScale className="text-gray-600" />
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
      icon: <GiHeartBeats className="text-red-600" />
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
      icon: <FaMobileAlt className="text-indigo-500" />
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

  // Calculate rotation when currentSlide changes
  useEffect(() => {
    setRotation(-currentSlide * (360 / slides.length));
  }, [currentSlide, slides.length]);

  return (
    <div className="w-full mx-auto p-6 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-medium text-center mb-8 text-gray-800">
        <span className="text-xl mr-2">🧠</span> Mental Health Awareness
      </h1>
      
      {/* Circular Slider Container */}
      <div className="relative w-[500px] h-[500px] mb-8">
        {/* Center Content */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-[200px] h-[200px] rounded-full bg-white shadow-lg flex flex-col items-center justify-center text-center p-4 border-4 border-indigo-100">
          <div className="text-5xl mb-2">{slides[currentSlide].icon}</div>
          <h2 className="text-lg font-medium text-gray-800 leading-tight mb-2">{slides[currentSlide].title}</h2>
          <div className="text-xs text-gray-500">{currentSlide + 1} / {slides.length}</div>
        </div>
        
        {/* Circular Track */}
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-8 border-dashed border-gray-100"></div>
        
        {/* Slides positioned in a circle */}
        <div 
          className="absolute top-0 left-0 w-full h-full transition-transform duration-1000 ease-in-out" 
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {slides.map((slide, index) => {
            // Calculate position in the circle
            const angle = (index * 360) / slides.length;
            const radian = (angle * Math.PI) / 180;
            const radius = 220; // Distance from center
            
            // Calculate x and y coordinates
            const x = radius * Math.cos(radian);
            const y = radius * Math.sin(radian);
            
            return (
              <div 
                key={index}
                className={`absolute top-1/2 left-1/2 w-[100px] h-[100px] rounded-full shadow-md flex items-center justify-center transition-all duration-500 cursor-pointer ${currentSlide === index ? 'bg-indigo-100 scale-110 z-20' : 'bg-white hover:bg-gray-50'}`}
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${-rotation}deg)`,
                }}
                onClick={() => goToSlide(index)}
              >
                <div className="text-2xl">{slide.icon}</div>
              </div>
            );
          })}
        </div>
        
        {/* Navigation Controls */}
        <button 
          onClick={prevSlide}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-24 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl flex items-center justify-center text-white hover:scale-110 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 z-30 border-2 border-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-189 w-189 stroke-[2.5]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-24 w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl flex items-center justify-center text-white hover:scale-110 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 z-30 border-2 border-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 stroke-[2.5]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Current Slide Details */}
      <div className="w-full max-w-2xl bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex">
            <div className="w-1 bg-red-400 rounded-full mr-4 self-stretch"></div>
            <div className="flex-1">
              <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">Problem</p>
              <p className="text-gray-700">{slides[currentSlide].problem}</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="w-1 bg-blue-400 rounded-full mr-4 self-stretch"></div>
            <div className="flex-1">
              <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">Statistics</p>
              <p className="text-gray-700">{slides[currentSlide].stats}</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="w-1 bg-purple-400 rounded-full mr-4 self-stretch"></div>
            <div className="flex-1">
              <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">Taglines</p>
              <ul className="list-none space-y-2">
                {slides[currentSlide].taglines.map((tagline, index) => (
                  <li key={index} className="text-gray-700 italic">"{tagline}"</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthSlider;