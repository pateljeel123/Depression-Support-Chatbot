import { useState } from 'react';
import './PHQ9Assessment.css';
const PHQ9Assessment = () => {
  const [answers, setAnswers] = useState(Array(9).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // PHQ-9 questions
  const questions = [
    'Little interest or pleasure in doing things',
    'Feeling down, depressed, or hopeless',
    'Trouble falling or staying asleep, or sleeping too much',
    'Feeling tired or having little energy',
    'Poor appetite or overeating',
    'Feeling bad about yourself - or that you are a failure or have let yourself or your family down',
    'Trouble concentrating on things, such as reading the newspaper or watching television',
    'Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
    'Thoughts that you would be better off dead, or of hurting yourself in some way'
  ];

  // Answer options
  const options = [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ];

  // Handle answer selection
  const handleAnswerSelect = (questionIndex, value) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
  };

  // Calculate total score
  const calculateScore = () => {
    return answers.reduce((sum, answer) => sum + (answer || 0), 0);
  };

  // Get severity level based on score
  const getSeverityLevel = (score) => {
    if (score >= 20) return { level: 'Severe depression', color: '#d32f2f' };
    if (score >= 15) return { level: 'Moderately severe depression', color: '#f44336' };
    if (score >= 10) return { level: 'Moderate depression', color: '#ff9800' };
    if (score >= 5) return { level: 'Mild depression', color: '#ffc107' };
    return { level: 'Minimal or no depression', color: '#4caf50' };
  };

  // Get recommendations based on severity
  const getRecommendations = (score) => {
    if (score >= 20) {
      return [
        'Please consider seeking immediate professional help.',
        'Contact a mental health professional or your doctor as soon as possible.',
        'If you have thoughts of harming yourself, please call a crisis helpline immediately.'
      ];
    } else if (score >= 15) {
      return [
        'Consider consulting with a mental health professional.',
        'Therapy and/or medication may be beneficial.',
        'Regular self-care and support from loved ones is important.'
      ];
    } else if (score >= 10) {
      return [
        'Consider talking to a healthcare provider about your symptoms.',
        'Engage in regular physical activity and maintain social connections.',
        'Practice stress-reduction techniques like meditation or deep breathing.'
      ];
    } else if (score >= 5) {
      return [
        'Monitor your mood and practice self-care regularly.',
        'Maintain healthy sleep habits and physical activity.',
        'Reach out to friends or family when you need support.'
      ];
    } else {
      return [
        'Continue monitoring your mental health.',
        'Practice regular self-care and stress management.',
        'Reach out for support if you notice changes in your mood or behavior.'
      ];
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    // Check if all questions are answered
    if (answers.some(answer => answer === null)) {
      alert('Please answer all questions before submitting.');
      return;
    }
    
    setShowResults(true);
    setSubmitted(true);
    
    // In a real app, you might want to save this assessment to the user's profile
    const assessmentData = {
      date: new Date().toISOString(),
      score: calculateScore(),
      answers: [...answers]
    };
    
    // For now, just log to console
    console.log('Assessment submitted:', assessmentData);
    
    // TODO: Send to backend API
  };

  // Handle starting a new assessment
  const handleStartNew = () => {
    setAnswers(Array(9).fill(null));
    setShowResults(false);
    setSubmitted(false);
  };

  // Get the score and severity
  const score = calculateScore();
  const severity = getSeverityLevel(score);
  const recommendations = getRecommendations(score);

  return (
    <div className="phq9-container">
      <div className="phq9-header">
        <h2>Depression Screening (PHQ-9)</h2>
        <p>
          Over the last 2 weeks, how often have you been bothered by any of the following problems?
        </p>
      </div>
      
      {!showResults ? (
        <div className="phq9-questionnaire">
          {questions.map((question, index) => (
            <div key={index} className="question-item">
              <p className="question-text">{index + 1}. {question}</p>
              <div className="answer-options">
                {options.map((option) => (
                  <label key={option.value} className="answer-option">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option.value}
                      checked={answers[index] === option.value}
                      onChange={() => handleAnswerSelect(index, option.value)}
                    />
                    <span className="option-text">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          
          <button 
            className="submit-btn"
            onClick={handleSubmit}
            disabled={answers.some(answer => answer === null)}
          >
            Submit Assessment
          </button>
        </div>
      ) : (
        <div className="phq9-results">
          <div className="score-display">
            <h3>Your PHQ-9 Score</h3>
            <div className="score-circle" style={{ backgroundColor: severity.color }}>
              {score}
            </div>
            <p className="severity-level">{severity.level}</p>
          </div>
          
          <div className="recommendations">
            <h3>Recommendations</h3>
            <ul>
              {recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
          
          {/* Emergency Resources for high scores */}
          {score >= 15 && (
            <div className="emergency-resources">
              <h3>Emergency Resources</h3>
              <p>
                If you're experiencing thoughts of suicide or need immediate support, 
                please reach out to one of these resources:
              </p>
              <ul>
                <li>National Suicide Prevention Lifeline: <strong>988</strong> or <strong>1-800-273-8255</strong></li>
                <li>Crisis Text Line: Text <strong>HOME</strong> to <strong>741741</strong></li>
                <li>Or go to your nearest emergency room</li>
              </ul>
            </div>
          )}
          
          <div className="action-buttons">
            <button className="primary-btn" onClick={handleStartNew}>
              Take Assessment Again
            </button>
            {/* In a real app, you might have a button to talk to a counselor */}
            {score >= 10 && (
              <button className="secondary-btn">
                Talk to a Support Professional
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="phq9-disclaimer">
        <p>
          <strong>Disclaimer:</strong> This screening tool is not a diagnostic instrument and is not designed 
          to replace a professional diagnosis. A mental health professional should be consulted for diagnosis 
          and treatment of any mental health condition.
        </p>
      </div>
    </div>
  );
};

export default PHQ9Assessment;