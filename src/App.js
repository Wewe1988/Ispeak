import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// קומפוננטת שעון המבחן
const ExamTimer = ({ initialMinutes = 30 }) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          alert('זמן המבחן הסתיים!');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="exam-timer">
      <div className="timer-display">
        זמן נותר למבחן: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </div>
    </div>
  );
};

// קומפוננטת מסך פתיחה
const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <h1>Ispeak – עברית שפה דבורה</h1>
        <div className="welcome-text">
          <p className="greeting">שלום תלמיד/ה יקר/ה,</p>
          <p>כאן צוות העברית בבית ספר תיכון בית ג'ן.</p>
          <p><strong>ברוכים הבאים לַ-Ispeak – עברית שפה דבורה</strong>.</p>
          
          <div className="instructions">
            <h2>מבנה המבחן והנחיות:</h2>
            <p>המבחן כולל שלושה פרקים:</p>
            <ul>
              <li>בפרק הראשון תתבקשו לדבר על עצמכם בזיקה לנושא מסוים</li>
              <li>בפרק השני תציגו את עמדתכם בנושא מסוים</li>
              <li>בַפרק השלישי תצפו בְּסרטון ותענו על שאלות</li>
            </ul>

            <div className="scoring-system">
              <h3>מבנה הניקוד:</h3>
              <table className="score-table">
                <tbody>
                  <tr>
                    <td>פרק ראשון - הצגה עצמית / היכרות</td>
                    <td className="score">35 נקודות</td>
                  </tr>
                  <tr>
                    <td>פרק שני - הצגת נושא</td>
                    <td className="score">35 נקודות</td>
                  </tr>
                  <tr>
                    <td>פרק שלישי - סרטון</td>
                    <td className="score">30 נקודות</td>
                  </tr>
                  <tr className="total">
                    <td>סה"כ</td>
                    <td className="score">100 נקודות</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>הנחיות להקלטה:</h3>
            <ul>
              <li>לַחֲצו על הכפתור "הקלטה" להתחלת ההקלטה</li>
              <li>לַחֲצו על הכפתור "עצור" בסיום ההקלטה</li>
              <li>תוכלו לשמוע את ההקלטה שלכם ובמידת הצורך להקליט מחדש</li>
            </ul>

            <div className="important-note">
              <p><strong>שימו לב:</strong></p>
              <ul>
                <li>יש לכם רק שני ניסיונות הקלטה לכל תשובה</li>
                <li>ניתן להקליט עד שני מקטעים</li>
                <li>הַקפידו על תשובות מלאות ועל שפה ברורה</li>
                <li>משך המבחן 30 דקות</li>
              </ul>
            </div>
          </div>

          <div className="start-section">
            <p>אנחנו מאמינים בכם!</p>
            <button onClick={onStart} className="start-button">
              להתחלת המבחן
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// קומפוננטת מסך הכניסה
const LoginScreen = ({ onSubmit, onTeacherLogin }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    className: '',
    teacherName: ''
  });
  const [isTeacherLogin, setIsTeacherLogin] = useState(false);
  const [teacherPassword, setTeacherPassword] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isTeacherLogin) {
      if (teacherPassword === '123456') {
        onTeacherLogin();
      } else {
        alert('סיסמה שגויה');
      }
    } else {
      if (formData.studentName && formData.className && formData.teacherName) {
        setShowWelcome(true);
      } else {
        alert('נא למלא את כל השדות');
      }
    }
  };

  if (showWelcome) {
    return (
      <WelcomeScreen 
        onStart={() => onSubmit(formData)}
      />
    );
  }

  return (
    <div className="login-screen">
      <h1>Ispeak - עברית שפה דבורה</h1>
      <div className="login-form">
        <div className="login-type-selector">
          <button 
            className={!isTeacherLogin ? 'active' : ''} 
            onClick={() => setIsTeacherLogin(false)}
          >
            תלמיד/ה
          </button>
          <button 
            className={isTeacherLogin ? 'active' : ''} 
            onClick={() => setIsTeacherLogin(true)}
          >
            מורה
          </button>
        </div>

[המשך בחלק הבא...]{isTeacherLogin ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>סיסמת מורה:</label>
              <input
                type="password"
                value={teacherPassword}
                onChange={(e) => setTeacherPassword(e.target.value)}
                placeholder="הכנס/י סיסמה"
              />
            </div>
            <button type="submit" className="submit-button">כניסה</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>שם התלמיד/ה:</label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                placeholder="הכנס/י את שמך"
              />
            </div>
            <div className="form-group">
              <label>כיתה:</label>
              <input
                type="text"
                value={formData.className}
                onChange={(e) => setFormData({...formData, className: e.target.value})}
                placeholder="לדוגמה: ח׳2"
              />
            </div>
            <div className="form-group">
              <label>שם המורה:</label>
              <input
                type="text"
                value={formData.teacherName}
                onChange={(e) => setFormData({...formData, teacherName: e.target.value})}
                placeholder="שם המורה המלמד/ת"
              />
            </div>
            <button type="submit" className="submit-button">המשך</button>
          </form>
        )}
      </div>
    </div>
  );
};

// הקומפוננטה הראשית
function App() {
  const [isTeacher, setIsTeacher] = useState(false);
  const [isLoginScreen, setIsLoginScreen] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordingSegments, setRecordingSegments] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(100);

  const [questions, setQuestions] = useState([
    // פרק 1 - 35 נקודות
    { text: 'תאר את המקום האהוב עליך', section: 1, points: 6 },
    { text: 'מה דעתך על למידה מרחוק?', section: 1, points: 6 },
    { text: 'ספר על חוויה מעניינת שהייתה לך לאחרונה', section: 1, points: 6 },
    { text: 'איך אתה מתכונן למבחנים?', section: 1, points: 6 },
    { text: 'מה התחביב האהוב עליך ולמה?', section: 1, points: 6 },
    { text: 'תאר את היום המושלם מבחינתך', section: 1, points: 5 },
    
    // פרק 2 - 35 נקודות
    { text: 'מה דעתך על שימוש בטלפונים ניידים בכיתה?', section: 2, points: 6 },
    { text: 'איך לדעתך יראה העתיד בעוד 50 שנה?', section: 2, points: 6 },
    { text: 'האם לדעתך צריך לבטל את שיעורי הבית? למה?', section: 2, points: 6 },
    { text: 'מה היית משנה בבית הספר אם היית יכול?', section: 2, points: 6 },
    { text: 'איך לדעתך ניתן לשפר את מערכת החינוך?', section: 2, points: 6 },
    { text: 'מה דעתך על למידה מקוונת לעומת למידה פרונטלית?', section: 2, points: 5 },
    
    // פרק 3 - 30 נקודות
    { text: 'צפה בסרטון וענה: מה המסר העיקרי?', section: 3, points: 10, video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { text: 'איך הסרטון מתקשר לחיי היומיום שלך?', section: 3, points: 10, video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { text: 'מה דעתך על הרעיון המוצג בסרטון?', section: 3, points: 10, video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
  ]);

  const [criteria] = useState([
    { name: 'שטף דיבור', weight: 0.3 },
    { name: 'דיוק לשוני', weight: 0.3 },
    { name: 'תוכן התשובה', weight: 0.4 }
  ]);

// המשך הקוד מהחלק הקודם...

const calculateSectionScore = (sectionNumber, criteriaScores) => {
  const sectionQuestions = questions.filter(q => q.section === sectionNumber);
  const totalSectionPoints = sectionQuestions.reduce((sum, q) => sum + q.points, 0);
  const averageCriteriaScore = Object.values(criteriaScores).reduce((a, b) => a + b, 0) / Object.values(criteriaScores).length;
  return (averageCriteriaScore * totalSectionPoints) / 4;
};

const generateFeedback = () => {
  let feedbackText = "פירוט ציונים:\n\n";
  const criteriaScores = {};
  
  criteria.forEach(criterion => {
    const score = Math.floor(Math.random() * 4) + 1;
    criteriaScores[criterion.name] = score;
    feedbackText += `${criterion.name}: ${score}/4\n`;
  });
  
  feedbackText += "\nציוני הפרקים:\n";
  
  const section1Score = calculateSectionScore(1, criteriaScores);
  const section2Score = calculateSectionScore(2, criteriaScores);
  const section3Score = calculateSectionScore(3, criteriaScores);
  
  feedbackText += `פרק ראשון - הצגה עצמית / היכרות: ${section1Score.toFixed(1)}/35 נקודות\n`;
  feedbackText += `פרק שני - הצגת נושא: ${section2Score.toFixed(1)}/35 נקודות\n`;
  feedbackText += `פרק שלישי - סרטון: ${section3Score.toFixed(1)}/30 נקודות\n`;
  feedbackText += "----------\n";
  
  const totalScore = section1Score + section2Score + section3Score;
  feedbackText += `ציון סופי: ${totalScore.toFixed(1)}/100 נקודות`;
  
  setFeedback(feedbackText);
};

const startRecording = () => {
  if (recordingSegments >= 2) {
    alert('הגעת למספר המקסימלי של מקטעי הקלטה (2)');
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.start();
      setRecording(true);
      
      const chunks = [];
      mediaRecorder.current.addEventListener("dataavailable", event => {
        chunks.push(event.data);
      });

      mediaRecorder.current.addEventListener("stop", () => {
        setAudioChunks(prevChunks => [...prevChunks, ...chunks]);
        const newSegments = recordingSegments + 1;
        setRecordingSegments(newSegments);
        
        const allChunks = [...audioChunks, ...chunks];
        const finalBlob = new Blob(allChunks, { type: 'audio/wav' });
        const finalAudioUrl = URL.createObjectURL(finalBlob);
        setAudioURL(finalAudioUrl);

        if (newSegments === 2) {
          const answerData = {
            studentName: userDetails?.studentName || 'אנונימי',
            className: userDetails?.className || 'לא צוין',
            teacherName: userDetails?.teacherName || 'לא צוין',
            question: questions[currentQuestion].text,
            section: questions[currentQuestion].section,
            audio: finalAudioUrl,
            timestamp: new Date().toISOString()
          };
          setAnswers(prev => [...prev, answerData]);
        }

        stream.getTracks().forEach(track => track.stop());
      });
    });
};

return (
  <div className="App">
    {isLoginScreen ? (
      <LoginScreen 
        onSubmit={(details) => {
          setUserDetails(details);
          setIsLoginScreen(false);
        }}
        onTeacherLogin={() => {
          setIsTeacher(true);
          setIsLoginScreen(false);
        }}
      />
    ) : (
      <div className="exam-container">
        <ExamTimer />
        {isTeacher ? (
          <TeacherView 
            questions={questions}
            setQuestions={setQuestions}
            onLogout={() => {
              setIsLoginScreen(true);
              setIsTeacher(false);
            }}
          />
        ) : (
          <StudentView
            userDetails={userDetails}
            currentQuestion={currentQuestion}
            questions={questions}
            recording={recording}
            audioURL={audioURL}
            recordingSegments={recordingSegments}
            timeLeft={totalTimeLeft}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onDeleteRecording={deleteRecording}
            onNextQuestion={nextQuestion}
            onGenerateFeedback={generateFeedback}
            feedback={feedback}
            onSaveAnswers={sendAnswersToTeacher}
            onLogout={() => setIsLoginScreen(true)}
          />
        )}
      </div>
    )}
  </div>
);
}

export default App;