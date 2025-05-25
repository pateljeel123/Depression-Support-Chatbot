import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/react.svg'; // Updated to use react.svg as logo.svg was not found
import {
  FaHeart,
  FaComments,
  FaUserFriends,
  FaBookOpen,
  FaLightbulb,
  FaShieldAlt,
  FaBed,
  FaUtensils,
  FaRunning,
  FaUsersSlash,
  FaBrain,
  FaBriefcase,
  FaStethoscope,
  FaQuestionCircle,
  FaCheckCircle,
  FaUserMd,
  FaTools,
  FaUsers,
  FaChartLine,
  FaCalendarCheck,
  FaJournalWhills,
  FaPhoneAlt,
  FaCommentDots,
  FaArrowRight,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaRocket,
  FaInfoCircle
} from 'react-icons/fa';



const Home = () => {
  const navigate = useNavigate();

  // Helper function for CTA buttons
  const CTAButton = ({ children, primary = false, onClick, className = '', icon }) => (
    <button
      onClick={onClick}
      className={`group inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${className} ${primary
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl focus:ring-pink-500 dark:focus:ring-pink-400'
          : 'bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 text-white backdrop-blur-sm border border-white/30 hover:border-white/50 focus:ring-white/70 dark:focus:ring-white/50'
        }`}
    >
      {icon && <span className="mr-2 group-hover:animate-pulse">{icon}</span>}
      {children}
    </button>
  );

  const commonProblems = [
    { icon: <FaBed/>, title: "Sleep Issues", description: "Trouble falling asleep, oversleeping, or feeling tired all day", bgColor: "bg-blue-100 dark:bg-blue-900/50", textColor: "text-blue-600 dark:text-blue-400", borderColor: "hover:border-blue-300 dark:hover:border-blue-600", shadowColor: "hover:shadow-blue-500/30 dark:hover:shadow-blue-400/20" },
    { icon: <FaUtensils/>, title: "Changes in Appetite", description: "Eating too much or too little, without enjoyment", bgColor: "bg-green-100 dark:bg-green-900/50", textColor: "text-green-600 dark:text-green-400", borderColor: "hover:border-green-300 dark:hover:border-green-600", shadowColor: "hover:shadow-green-500/30 dark:hover:shadow-green-400/20" },
    { icon: <FaRunning/>, title: "Low Energy & Motivation", description: "Difficulty getting out of bed or starting daily tasks", bgColor: "bg-yellow-100 dark:bg-yellow-900/50", textColor: "text-yellow-600 dark:text-yellow-400", borderColor: "hover:border-yellow-300 dark:hover:border-yellow-600", shadowColor: "hover:shadow-yellow-500/30 dark:hover:shadow-yellow-400/20" },
    { icon: <FaUsersSlash/>, title: "Isolation", description: "Pulling away from friends, family, and social activities", bgColor: "bg-red-100 dark:bg-red-900/50", textColor: "text-red-600 dark:text-red-400", borderColor: "hover:border-red-300 dark:hover:border-red-600", shadowColor: "hover:shadow-red-500/30 dark:hover:shadow-red-400/20" },
    { icon: <FaBrain/>, title: "Negative Thoughts", description: "Feeling worthless, hopeless, or excessively guilty", bgColor: "bg-purple-100 dark:bg-purple-900/50", textColor: "text-purple-600 dark:text-purple-400", borderColor: "hover:border-purple-300 dark:hover:border-purple-600", shadowColor: "hover:shadow-purple-500/30 dark:hover:shadow-purple-400/20" },
    { icon: <FaBriefcase/>, title: "Work/School Struggles", description: "Poor focus, memory issues, or lack of interest in tasks", bgColor: "bg-orange-100 dark:bg-orange-900/50", textColor: "text-orange-600 dark:text-orange-400", borderColor: "hover:border-orange-300 dark:hover:border-orange-600", shadowColor: "hover:shadow-orange-500/30 dark:hover:shadow-orange-400/20" },
    { icon: <FaStethoscope/>, title: "Physical Aches", description: "Unexplained pain or discomfort in the body", bgColor: "bg-teal-100 dark:bg-teal-900/50", textColor: "text-teal-600 dark:text-teal-400", borderColor: "hover:border-teal-300 dark:hover:border-teal-600", shadowColor: "hover:shadow-teal-500/30 dark:hover:shadow-teal-400/20" },
    { icon: <FaCommentDots/>, title: "Suicidal Thoughts", description: "Feeling like life isn’t worth living", bgColor: "bg-pink-100 dark:bg-pink-900/50", textColor: "text-pink-600 dark:text-pink-400", borderColor: "hover:border-pink-300 dark:hover:border-pink-600", shadowColor: "hover:shadow-pink-500/30 dark:hover:shadow-pink-400/20" },
  ];

  const platformBenefits = [
    { 
      icon: <FaBrain />,
      title: "Evidence-Based Tools", 
      description: "Guided by the latest psychology and neuroscience",
      bgColor: "bg-purple-100 dark:bg-purple-900/50",
      textColor: "text-purple-600 dark:text-purple-400",
      borderColor: "hover:border-purple-300 dark:hover:border-purple-600",
      shadowColor: "hover:shadow-purple-500/30 dark:hover:shadow-purple-400/20"
    },
    { 
      icon: <FaShieldAlt />,
      title: "Private & Confidential", 
      description: "No judgments, just safe conversations",
      bgColor: "bg-green-100 dark:bg-green-900/50",
      textColor: "text-green-600 dark:text-green-400",
      borderColor: "hover:border-green-300 dark:hover:border-green-600",
      shadowColor: "hover:shadow-green-500/30 dark:hover:shadow-green-400/20"
    },
    { 
      icon: <FaUserFriends />,
      title: "Real Human Support", 
      description: "From trained therapists and empathetic listeners (feature coming soon)",
      bgColor: "bg-blue-100 dark:bg-blue-900/50",
      textColor: "text-blue-600 dark:text-blue-400",
      borderColor: "hover:border-blue-300 dark:hover:border-blue-600",
      shadowColor: "hover:shadow-blue-500/30 dark:hover:shadow-blue-400/20"
    },
    { 
      icon: <FaLightbulb />,
      title: "Easy Access", 
      description: "Anytime, anywhere, at your pace",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/50",
      textColor: "text-yellow-600 dark:text-yellow-400",
      borderColor: "hover:border-yellow-300 dark:hover:border-yellow-600",
      shadowColor: "hover:shadow-yellow-500/30 dark:hover:shadow-yellow-400/20"
    },
  ];

  const whatYouCanDo = [
    { icon: <FaUserMd />, title: "Chat with our AI Assistant", description: "Get immediate support and guidance (therapist chat coming soon).", bgColor: "bg-red-100 dark:bg-red-900/50", textColor: "text-red-600 dark:text-red-400", borderColor: "hover:border-red-300 dark:hover:border-red-600", shadowColor: "hover:shadow-red-500/30 dark:hover:shadow-red-400/20" },
    { icon: <FaBookOpen />, title: "Access Self-Help Workbooks", description: "Explore guided exercises and resources.", bgColor: "bg-purple-100 dark:bg-purple-900/50", textColor: "text-purple-600 dark:text-purple-400", borderColor: "hover:border-purple-300 dark:hover:border-purple-600", shadowColor: "hover:shadow-purple-500/30 dark:hover:shadow-purple-400/20" },
    { icon: <FaUsers />, title: "Join Anonymous Peer Groups", description: "Connect with others who understand (feature coming soon).", bgColor: "bg-orange-100 dark:bg-orange-900/50", textColor: "text-orange-600 dark:text-orange-400", borderColor: "hover:border-orange-300 dark:hover:border-orange-600", shadowColor: "hover:shadow-orange-500/30 dark:hover:shadow-orange-400/20" },
    { icon: <FaChartLine />, title: "Track Your Mood & Progress", description: "Monitor your well-being over time.", bgColor: "bg-teal-100 dark:bg-teal-900/50", textColor: "text-teal-600 dark:text-teal-400", borderColor: "hover:border-teal-300 dark:hover:border-teal-600", shadowColor: "hover:shadow-teal-500/30 dark:hover:shadow-teal-400/20" },
    { icon: <FaQuestionCircle />, title: "Understand Your Symptoms", description: "Learn more about depression and its effects.", bgColor: "bg-pink-100 dark:bg-pink-900/50", textColor: "text-pink-600 dark:text-pink-400", borderColor: "hover:border-pink-300 dark:hover:border-pink-600", shadowColor: "hover:shadow-pink-500/30 dark:hover:shadow-pink-400/20" },
    { icon: <FaHeart />, title: "Get Tips for Family Support", description: "Help your loved ones understand and support you.", bgColor: "bg-green-100 dark:bg-green-900/50", textColor: "text-green-600 dark:text-green-400", borderColor: "hover:border-green-300 dark:hover:border-green-600", shadowColor: "hover:shadow-green-500/30 dark:hover:shadow-green-400/20" },
  ];

  const visualFeatures = [
    { icon: <FaChartLine />, name: "Mood Tracker", bgColor: "bg-sky-100 dark:bg-sky-900/50", textColor: "text-sky-600 dark:text-sky-400", borderColor: "hover:border-sky-300 dark:hover:border-sky-600", shadowColor: "hover:shadow-sky-500/30 dark:hover:shadow-sky-400/20" },
    { icon: <FaCalendarCheck />, name: "Daily Affirmation Wall", bgColor: "bg-lime-100 dark:bg-lime-900/50", textColor: "text-lime-600 dark:text-lime-400", borderColor: "hover:border-lime-300 dark:hover:border-lime-600", shadowColor: "hover:shadow-lime-500/30 dark:hover:shadow-lime-400/20" },
    { icon: <FaJournalWhills />, name: "Journal Space", bgColor: "bg-fuchsia-100 dark:bg-fuchsia-900/50", textColor: "text-fuchsia-600 dark:text-fuchsia-400", borderColor: "hover:border-fuchsia-300 dark:hover:border-fuchsia-600", shadowColor: "hover:shadow-fuchsia-500/30 dark:hover:shadow-fuchsia-400/20" },
    { icon: <FaPhoneAlt />, name: "Crisis Helpline Directory", bgColor: "bg-rose-100 dark:bg-rose-900/50", textColor: "text-rose-600 dark:text-rose-400", borderColor: "hover:border-rose-300 dark:hover:border-rose-600", shadowColor: "hover:shadow-rose-500/30 dark:hover:shadow-rose-400/20" },
    { icon: <FaComments />, name: "Therapist Chat Portal", description: "(Coming Soon)", bgColor: "bg-cyan-100 dark:bg-cyan-900/50", textColor: "text-cyan-600 dark:text-cyan-400", borderColor: "hover:border-cyan-300 dark:hover:border-cyan-600", shadowColor: "hover:shadow-cyan-500/30 dark:hover:shadow-cyan-400/20" },
  ];
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans leading-relaxed">
      {/* Section 1: Hero Banner */}
      <section className="relative h-[90vh] min-h-[650px] md:h-screen flex items-center justify-center text-white overflow-hidden">
        <img 
          src="https://cdn.prod.website-files.com/62ab7d5ccc9f587bce83c183/62e54e7732c44c5f842541c4_ezgif.com-gif-maker%20(14).gif" 
          alt="Hero background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-slate-800/50 to-black/70"></div>
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-gray-900 dark:from-black to-transparent"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-0">
          <motion.h1 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight text-shadow-lg"
          >
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400">Path to Peace</span>, <br className="sm:hidden"/>One Step at a Time
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="text-xl sm:text-2xl text-gray-200 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed text-shadow-md"
          >
            You're not alone. Our AI-powered platform offers a safe space to explore your feelings, learn coping strategies, and find support on your journey to mental wellness.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.8, type: "spring", stiffness: 120 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-5 md:gap-6"
          >
            <CTAButton primary onClick={() => navigate('/chat')} className="w-full sm:w-auto text-lg shadow-xl" icon={<FaRocket />}>
              Start Your Journey
            </CTAButton>
            <CTAButton onClick={() => document.getElementById('learn-more-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto text-lg shadow-lg" icon={<FaInfoCircle />}>
              Discover More
            </CTAButton>
          </motion.div>
        </div>
      </section> 

      {/* Section 2: Common Problems People Face Because of Depression */}
      <section className="py-20 md:py-28 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-5 tracking-tight">
              Depression Isn’t Just Sadness. It Affects <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">Every Corner</span> Of Your Life.
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Understanding common challenges is the first step towards healing. Many experience these issues:</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {commonProblems.map((problem, index) => (
              <div 
                key={index} 
                className={`group bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 border border-gray-200 dark:border-gray-700 ${problem.borderColor} ${problem.shadowColor} flex flex-col items-center text-center`}
              >
                <div className={`text-4xl mb-5 p-4 rounded-full ${problem.bgColor} ${problem.textColor} transition-colors duration-300`}>
                  {problem.icon}
                </div>
                <h3 className={`text-xl font-semibold text-gray-800 dark:text-white mb-2 group-hover:${problem.textColor} transition-colors duration-300`}>{problem.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">{problem.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 sm:mt-16">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">Not sure if what you're feeling is depression?</p>
            <button 
              onClick={() => navigate('/screening-quiz')}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline text-lg flex items-center justify-center gap-2 mx-auto"
            >
              Take the Depression Self-Screening Quiz <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Section 3: Why This Platform? */}
      {/* Section 3: Why This Platform? */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white mb-5 tracking-tight">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">MindCare</span>?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">We're passionately committed to providing a supportive and effective environment for your mental well-being journey.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {platformBenefits.map((benefit, index) => (
              <div 
                key={index} 
                className={`group bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 ${benefit.borderColor} ${benefit.shadowColor}`}
              >
                <div className={`flex items-center mb-6`}>
                  <div className={`text-4xl p-4 rounded-full ${benefit.bgColor} ${benefit.textColor} mr-5 transition-colors duration-300`}>
                    {benefit.icon}
                  </div>
                  <h3 className={`text-2xl font-bold text-gray-800 dark:text-white group-hover:${benefit.textColor} transition-colors duration-300`}>{benefit.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: What You Can Do Here */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white mb-5 tracking-tight">
              What You Can <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600 dark:from-rose-400 dark:to-orange-400">Do Here</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">Our platform offers a range of tools and resources designed to empower you on your path to better mental health.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {whatYouCanDo.map((action, index) => (
              <div 
                key={index} 
                className={`group bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 ${action.borderColor} ${action.shadowColor} flex flex-col items-center text-center`}
              >
                <div className={`text-4xl mb-5 p-4 rounded-full ${action.bgColor} ${action.textColor} transition-colors duration-300`}>
                  {action.icon}
                </div>
                <h3 className={`text-2xl font-bold text-gray-800 dark:text-white mb-3 group-hover:${action.textColor} transition-colors duration-300`}>{action.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{action.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Tools to Support Your Journey */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white mb-5 tracking-tight">
              Tools to <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-600 dark:from-sky-400 dark:to-cyan-500">Support Your Journey</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">Explore a variety of features designed to help you navigate your path to mental well-being and track your progress effectively.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
            {visualFeatures.map((feature, index) => (
              <div 
                key={index} 
                className={`group bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 border border-gray-200 dark:border-gray-700 ${feature.borderColor} ${feature.shadowColor} flex flex-col items-center text-center`}
              >
                <div className={`text-5xl mb-4 p-4 rounded-full ${feature.bgColor} ${feature.textColor} transition-colors duration-300`}>
                  {feature.icon}
                </div>
                <h3 className={`text-lg font-semibold text-gray-700 dark:text-gray-200 group-hover:${feature.textColor} transition-colors duration-300`}>{feature.name}</h3>
                {feature.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{feature.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center space-x-3 mb-6">
                <img src={logo} alt="MindWell Logo" className="h-10 w-auto" />
                <span className="text-2xl font-bold text-gray-800 dark:text-white">MindCare</span>
              </Link>
              <p className="text-sm leading-relaxed mb-6">Your compassionate companion for mental wellness. We're here to support you, anytime, anywhere.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-300"><FaFacebook size={22} /></a>
                <a href="#" className="text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-300"><FaTwitter size={22} /></a>
                <a href="#" className="text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-300"><FaInstagram size={22} /></a>
                <a href="#" className="text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-300"><FaLinkedin size={22} /></a>
              </div>
            </div>
            <div>
              <h5 className="text-lg font-semibold text-gray-700 dark:text-white mb-5">Quick Links</h5>
              <ul className="space-y-3 text-sm">
                <li><Link to="/chat" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-300">Chat with Bot</Link></li>
                <li><Link to="/resources" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-300">Resources</Link></li>
                <li><Link to="/about" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-300">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-300">Contact</Link></li>
                <li><Link to="/faq" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-300">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold text-gray-700 dark:text-white mb-5">Support</h5>
              <ul className="space-y-3 text-sm">
                <li><Link to="/privacy" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-300">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-300">Terms of Service</Link></li>
                <li><Link to="/community-guidelines" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-300">Community Guidelines</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold text-gray-700 dark:text-white mb-5">Stay Updated</h5>
              <p className="text-sm mb-4">Subscribe to our newsletter for the latest updates and mental wellness tips.</p>
              <form className="flex">
                <input type="email" placeholder="your.email@example.com" className="w-full px-4 py-2.5 rounded-l-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-sm placeholder-gray-400 dark:placeholder-gray-500" />
                <button type="submit" className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-r-lg font-semibold text-sm transition-colors duration-300 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 focus:ring-purple-500 dark:focus:ring-purple-400">Subscribe</button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-300 dark:border-slate-700 pt-8 md:pt-10 text-center">
            <p className="text-xs leading-relaxed mb-5 max-w-3xl mx-auto">
              <span className="font-semibold text-gray-700 dark:text-white">Important Disclaimer:</span> MindCare is an AI-powered support tool and not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read or experienced on this platform.
            </p>
            <p className="text-xs leading-relaxed max-w-3xl mx-auto">
              If you are in a Crisis or any other person may be in danger, do not use this site. These resources can provide you with immediate help. Call or text <a href="tel:988" className="font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 underline transition-colors duration-300">988</a> in the US & Canada, or call <a href="tel:111" className="font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 underline transition-colors duration-300">111</a> in the UK.
            </p>
            <p className="text-sm mt-8 text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} MindCare. All rights reserved. Crafted with <FaHeart className="inline text-pink-500 animate-pulse" /> for better mental health.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;