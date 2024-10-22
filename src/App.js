import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [isTeacher, setIsTeacher] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [questions, setQuestions] = useState([
    // פרק 1
    { text: 'תאר את המקום האהוב עליך', section: 1 },
    { text: 'מה דעתך על למידה מרחוק?', section: 1 },
    { text: 'ספר על חוויה מעניינת שהייתה לך לאחרונה', section: 1 },
    { text: 'איך אתה מתכונן למבחנים?', section: 1 },
    { text: 'מה התחביב האהוב עליך ולמה?', section: 1 },
    { text: 'תאר את היום המושלם מבחינתך', section: 1 },
    // פרק 2
    { text: 'מה דעתך על שימוש בטלפונים ניידים בכיתה?', section: 2 },
    { text: 'איך לדעתך יראה העתיד בעוד 50 שנה?', section: 2 },
    { text: 'האם לדעתך צריך לבטל את שיעורי הבית? למה?', section: 2 },
    { text: 'מה היית משנה בבית הספר אם היית יכול?', section: 2 },
    { text: 'איך לדעתך ניתן לשפר את מערכת החינוך?', section: 2 },
    { text: 'מה דעתך על למידה מקוונת לעומת למידה פרונטלית?', section: 2 },
    // פרק 3 (עם סרטון)
    { text: 'צפה בסרטון וענה: מה המסר העיקרי?', section: 3, video: 'https://www.youtube.com/watch?v=jwpygjVPoAI' },
    { text: 'איך הסרטון מתקשר לחיי היומיום שלך?', section: 3 },
    { text: 'מה דעתך על הרעיון המוצג בסרטון?', section: 3 }
  ]);
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedSection, setSelectedSection] = useState(1);
  const [timeLeft, setTimeLeft] = useState(50);
  const [feedback, setFeedback] = useState('');
  const [answers, setAnswers] = useState([]);
  const mediaRecorder = useRef(null);
  const timerRef = useRef(null);

  const [criteria, setCriteria] = useState([
    { name: 'שטף דיבור', weight: 0.3 },
    { name: 'דיוק לשוני', weight: 0.3 },
    { name: 'תוכן התשובה', weight: 0.4 }
  ]);

  useEffect(() => {
    if (timeLeft === 0) {
      stopRecording();
    }
  }, [timeLeft]);

  const getYouTubeEmbedUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.start();
        setRecording(true);
        setTimeLeft(50);
        timerRef.current = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        const audioChunks = [];
        mediaRecorder.current.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        mediaRecorder.current.addEventListener("stop", () => {
          clearInterval(timerRef.current);
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioURL(audioUrl);
          setAnswers([...answers, { question: questions[currentQuestion].text, audio: audioUrl }]);
        });
      });
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      setRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAudioURL('');
      setTimeLeft(50);
      setFeedback('');
    }
  };

  const addQuestion = () => {
    if (newQuestion.trim() !== '') {
      const sectionQuestions = questions.filter(q => q.section === selectedSection);
      if (sectionQuestions.length < (selectedSection === 3 ? 3 : 9)) {
        setQuestions([...questions, { text: newQuestion, section: selectedSection }]);
        setNewQuestion('');
      } else {
        alert('הגעת למספר המקסימלי של שאלות בפרק זה');
      }
    }
  };

  const editQuestion = (index, newText) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = newText;
    setQuestions(updatedQuestions);
  };

  const generateFeedback = () => {
    let feedbackText = "";
    let totalScore = 0;
    
    criteria.forEach(criterion => {
      const randomScore = Math.floor(Math.random() * 4) + 1;
      feedbackText += `${criterion.name}: ${randomScore}/4\n`;
      totalScore += randomScore * criterion.weight;
    });
    
    const finalScore = (totalScore / criteria.length).toFixed(2);
    feedbackText = `ציון כולל: ${finalScore}/4\n\n` + feedbackText;
    
    setFeedback(feedbackText);
  };

  const sendAnswersToTeacher = () => {
    localStorage.setItem('studentAnswers', JSON.stringify(answers));
    alert('התשובות נשמרו בהצלחה');
  };

  return (
    <div className="App">
      <h1>אפליקציית בחינה בעל פה בעברית</h1>
      <button onClick={() => setIsTeacher(!isTeacher)}>
        {isTeacher ? 'מעבר לממשק תלמיד' : 'מעבר לממשק מורה'}
      </button>
      
      {isTeacher ? (
        <div>
          <h2>ממשק מורה</h2>
          <div>
            <input 
              type="text" 
              value={newQuestion} 
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="הכנס שאלה חדשה"
            />
            <select value={selectedSection} onChange={(e) => setSelectedSection(Number(e.target.value))}>
              <option value={1}>פרק 1</option>
              <option value={2}>פרק 2</option>
              <option value={3}>פרק 3 (סרטון)</option>
            </select>
            <button onClick={addQuestion}>הוסף שאלה</button>
          </div>
          <h3>שאלות קיימות:</h3>
          {[1, 2, 3].map(section => (
            <div key={section}>
              <h4>פרק {section}</h4>
              <ul>
                {questions.filter(q => q.section === section).map((q, index) => (
                  <li key={index}>
                    <input 
                      type="text" 
                      value={q.text} 
                      onChange={(e) => editQuestion(questions.indexOf(q), e.target.value)} 
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <h3>קריטריונים למשוב:</h3>
          <ul>
            {criteria.map((criterion, index) => (
              <li key={index}>
                {criterion.name} - משקל: {criterion.weight}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h2>שאלה {currentQuestion + 1} (פרק {questions[currentQuestion].section})</h2>
          <p className="question">{questions[currentQuestion].text}</p>
          {questions[currentQuestion].video && (
            <div className="video-container">
              <iframe
                width="560"
                height="315"
                src={getYouTubeEmbedUrl(questions[currentQuestion].video)}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Embedded youtube"
              />
            </div>
          )}
          <div className="timer">זמן נותר: {timeLeft} שניות</div>
          <button onClick={recording ? stopRecording : startRecording}>
            {recording ? 'עצור הקלטה' : 'התחל הקלטה'}
          </button>
          {audioURL && <audio src={audioURL} controls />}
          <button onClick={nextQuestion}>שאלה הבאה</button>
          <button onClick={generateFeedback}>קבל משוב</button>
          {feedback && (
            <div className="feedback">
              <h3>משוב:</h3>
              <pre>{feedback}</pre>
            </div>
          )}
          <button onClick={sendAnswersToTeacher}>שמור תשובות</button>
        </div>
      )}
    </div>
  );
}

export default App;