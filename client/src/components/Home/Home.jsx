import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHeart, FaComments, FaChartLine, FaClipboardCheck,
  FaMoon, FaSignInAlt, FaUserPlus, FaArrowRight,
  FaQuoteLeft, FaChevronDown, FaChevronUp, FaLeaf
} from 'react-icons/fa';
import { GiBrain, GiMeditation, GiHeartBeats } from 'react-icons/gi';
import { IoMdHappy, IoMdSad } from 'react-icons/io';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { session, signOut } = useAuth();
  const [showMore, setShowMore] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();

  const testimonials = [
    {
      quote: "This app has been a lifeline during my darkest moments. Having someone to talk to anytime, without judgment, has made all the difference.",
      author: "Sarah K.",
      role: "User since 2022"
    },
    {
      quote: "The mood tracking feature helped me identify patterns I never noticed before. Now I can take proactive steps when I see warning signs.",
      author: "Michael T.",
      role: "User since 2021"
    },
    {
      quote: "As someone who was hesitant about therapy, this app provided the perfect bridge to understanding my emotions better.",
      author: "Jamie L.",
      role: "User since 2023"
    }
  ];

  const features = [
    {
      icon: <FaComments className="h-6 w-6 text-white" />,
      title: "AI Chat Support",
      description: "Talk to our compassionate AI companion anytime. Get immediate support in a safe, judgment-free space with responses tailored to your needs."
    },
    {
      icon: <FaChartLine className="h-6 w-6 text-white" />,
      title: "Mood Tracking",
      description: "Visualize your emotional patterns with our intuitive mood tracker. Gain insights to better understand your mental health journey."
    },
    {
      icon: <FaClipboardCheck className="h-6 w-6 text-white" />,
      title: "PHQ-9 Assessment",
      description: "Professional-grade depression screening with personalized feedback and progress tracking over time."
    },
    {
      icon: <GiHeartBeats className="h-6 w-6 text-white" />,
      title: "Personalized Support",
      description: "Receive customized recommendations including exercises, articles, and coping strategies based on your unique needs."
    },
    {
      icon: <GiMeditation className="h-6 w-6 text-white" />,
      title: "Mindfulness Tools",
      description: "Access guided meditations, breathing exercises, and relaxation techniques to reduce stress and anxiety."
    },
    {
      icon: <GiBrain className="h-6 w-6 text-white" />,
      title: "Cognitive Exercises",
      description: "Interactive activities designed to challenge negative thought patterns and build resilience."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 font-sans">
      {/* NavBar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <FaLeaf className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">MindCare</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <button
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </button>
                <button
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Features
                </button>
                <button
                  onClick={() => document.getElementById('testimonials').scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Stories
                </button>
                <button
                  onClick={() => document.getElementById('resources').scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Resources
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!session ? (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center px-4 py-2 border border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none transition duration-150 ease-in-out"
                  >
                    <FaSignInAlt className="mr-2 h-4 w-4" />
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                  >
                    Sign Up
                    <FaUserPlus className="ml-2 h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/chat')}
                    className="inline-flex items-center px-4 py-2 border border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none transition duration-150 ease-in-out"
                  >
                    Go to Chat
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      navigate('/');
                    }}
                    className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-20"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              <span className="block">Your Mental Health</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100">Matters to Us</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-indigo-100">
              A compassionate space where technology meets empathy. We're here to support you 24/7 with personalized care and evidence-based tools.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => session ? navigate('/chat') : navigate('/login')}
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-lg text-indigo-700 bg-yellow-400 hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105"
              >
                {session ? 'Continue Your Journey' : 'Start Healing Today'}
                <FaArrowRight className="ml-2" />
              </button>
              <button
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center px-8 py-4 border-2 hover:text-[#7E11DF] border-white text-lg font-medium rounded-full text-white hover:bg-white hover:bg-opacity-10 transition-all duration-300"
              >
                Learn How It Works
                <FaChevronDown className="ml-2 animate-bounce" />
              </button>
            </div>
          </div>
          <div className="mt-16 flex justify-center">
            <div className="relative w-full max-w-4xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-indigo-600 rounded-2xl blur opacity-75"></div>
              <div className="relative bg-white rounded-2xl p-1">
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <div className="flex justify-center space-x-4 mb-6">
                    <IoMdHappy className="h-10 w-10 text-green-500" />
                    <IoMdSad className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">How are you feeling today?</h3>
                  <p className="mt-2 text-gray-600">Our AI companion is ready to listen whenever you need support.</p>
                  <button
                    onClick={() => session ? navigate('/chat') : navigate('/login')}
                    className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Share Your Thoughts
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full mb-4">
              How We Help
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Comprehensive Mental Health Support
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
              Our platform combines AI technology with scientifically validated techniques to provide personalized support.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="pt-6 group">
                  <div className="flow-root bg-gray-50 rounded-xl px-6 pb-8 h-full transform transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg group-hover:rotate-6 transition-transform duration-300">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-semibold text-gray-900 tracking-tight">{feature.title}</h3>
                      <p className="mt-5 text-base text-gray-600">
                        {feature.description}
                      </p>
                      <div className="mt-6">
                        <button
                          onClick={() => session ? navigate('/chat') : navigate('/login')}
                          className="text-indigo-600 hover:text-indigo-500 font-medium inline-flex items-center"
                        >
                          Try it now
                          <FaArrowRight className="ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-5xl font-extrabold mb-2">24/7</div>
              <div className="text-xl font-medium">Availability</div>
              <p className="mt-2 text-indigo-100">Support whenever you need it</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold mb-2">95%</div>
              <div className="text-xl font-medium">User Satisfaction</div>
              <p className="mt-2 text-indigo-100">Report feeling better after use</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold mb-2">10K+</div>
              <div className="text-xl font-medium">Active Users</div>
              <p className="mt-2 text-indigo-100">Trusting our platform daily</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full mb-4">
              Real Stories
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Voices of Healing
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Discover how our community is finding hope and support.
            </p>
          </div>

          <div className="mt-12 relative">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="p-8">
                <FaQuoteLeft className="text-indigo-100 text-4xl absolute top-8 left-8" />
                <div className="relative pl-12">
                  <p className="text-xl text-gray-700 italic">
                    {testimonials[activeTestimonial].quote}
                  </p>
                  <div className="mt-6">
                    <p className="text-lg font-semibold text-indigo-600">
                      {testimonials[activeTestimonial].author}
                    </p>
                    <p className="text-gray-500">
                      {testimonials[activeTestimonial].role}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center pb-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`mx-1 w-3 h-3 rounded-full ${activeTestimonial === index ? 'bg-indigo-600' : 'bg-gray-300'}`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full mb-4">
              Knowledge Base
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Helpful Resources
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Educational materials and additional support options.
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Crisis Support Card */}
              <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl border border-red-100 transform transition-all duration-300 hover:shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FaHeart className="text-red-500 mr-2" />
                  Crisis Support
                </h3>
                <p className="mt-3 text-gray-600">
                  Immediate help is available if you're in distress:
                </p>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span className="text-gray-700"><strong>988</strong> Suicide & Crisis Lifeline</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span className="text-gray-700"><strong>Text HOME to 741741</strong> Crisis Text Line</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span className="text-gray-700"><strong>911</strong> Emergency Services</span>
                  </li>
                </ul>
              </div>

              {/* Articles Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 transform transition-all duration-300 hover:shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FaClipboardCheck className="text-blue-500 mr-2" />
                  Educational Articles
                </h3>
                <p className="mt-3 text-gray-600">
                  Learn about mental health and coping strategies:
                </p>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-700">Understanding Depression & Anxiety</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-700">Cognitive Behavioral Techniques</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-700">Mindfulness & Meditation Guides</span>
                  </li>
                  {showMore ? (
                    <>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="text-gray-700">Building Healthy Relationships</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="text-gray-700">Managing Stress at Work</span>
                      </li>
                      <button
                        onClick={() => setShowMore(false)}
                        className="text-blue-600 hover:text-blue-500 font-medium inline-flex items-center mt-2"
                      >
                        Show less
                        <FaChevronUp className="ml-1" />
                      </button>
                    </>
                  ) : (
                    <li>
                      <button
                        onClick={() => setShowMore(true)}
                        className="text-blue-600 hover:text-blue-500 font-medium inline-flex items-center"
                      >
                        Show more articles
                        <FaChevronDown className="ml-1" />
                      </button>
                    </li>
                  )}
                </ul>
              </div>

              {/* Community Card */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl border border-green-100 transform transition-all duration-300 hover:shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FaComments className="text-green-500 mr-2" />
                  Community Support
                </h3>
                <p className="mt-3 text-gray-600">
                  Connect with others who understand your journey:
                </p>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700">Anonymous Support Groups</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700">Peer-to-Peer Chat Rooms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700">Local Therapist Directory</span>
                  </li>
                </ul>
                <button
                  onClick={() => session ? navigate('/chat') : navigate('/login')}
                  className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  Join Our Community
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Ready to prioritize your mental health?
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-indigo-100">
            Join thousands who have found support and understanding through our platform.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => session ? navigate('/chat') : navigate('/login')}
              className="inline-flex items-center justify-center px-8 py-4 border bg-white border-transparent text-lg font-medium rounded-full shadow-lg text-indigo-600"
            >
              {session ? 'Continue Your Journey' : 'Get Started Now'}
              <FaArrowRight className="ml-2" />
            </button>
            <button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center px-8 py-4 border-2 hover:text-[#7E11DF] border-white text-lg font-medium rounded-full text-white hover:bg-white hover:bg-opacity-10 transition-all duration-300"
            >
              Learn More First
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full mb-4">
              Have Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-12 space-y-6 max-w-3xl mx-auto">
            {[
              {
                question: "Is this service a replacement for therapy?",
                answer: "While our platform provides valuable support, it's not a replacement for professional therapy. We're designed to complement mental health care and provide immediate support between sessions."
              },
              {
                question: "How does the AI chat maintain privacy?",
                answer: "All conversations are encrypted and we never store personally identifiable information. You can chat anonymously without creating an account."
              },
              {
                question: "Is there a cost to use this service?",
                answer: "Our basic features are completely free. We offer premium options for those who want additional personalized support and advanced features."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center">
                <FaLeaf className="h-8 w-8 text-indigo-400" />
                <span className="ml-2 text-xl font-bold">MindCare</span>
              </div>
              <p className="mt-4 text-gray-400">
                Compassionate mental health support powered by AI and human understanding.
              </p>
              <div className="mt-6 flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <button
                    onClick={() => document.getElementById('resources').scrollIntoView({ behavior: 'smooth' })}
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">
                    Safety Information
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">
                    Community Guidelines
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">
                    Our Mission
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                Legal
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-white">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-gray-400">
              © {new Date().getFullYear()} MindCare. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-400">
                Made with <span className="text-red-500">❤</span> for mental health awareness
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
