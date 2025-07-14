import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, Target, Calendar, Award, CheckCircle2, PlayCircle, RefreshCw, ArrowRight } from 'lucide-react';

const BarReviewSystem = () => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentSubject, setCurrentSubject] = useState('Political Law');
  const [currentSession, setCurrentSession] = useState('study');
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [sessionScore, setSessionScore] = useState(null);
  const [weeklyProgress, setWeeklyProgress] = useState({
    1: { subject: 'Political Law', completed: 0, total: 7 },
    2: { subject: 'Commercial Law', completed: 0, total: 7 },
    3: { subjects: ['Political Law', 'Commercial Law'], completed: 0, total: 7 },
    4: { subjects: ['Civil Law', 'Labor Law'], completed: 0, total: 7 },
    5: { subjects: ['Criminal Law', 'Remedial Law'], completed: 0, total: 7 }
  });

  const examSchedule = [
    { date: 'Sept 7, 2025', subjects: ['Political Law (15%)', 'Commercial Law (20%)'] },
    { date: 'Sept 10, 2025', subjects: ['Civil Law (20%)', 'Labor Law (10%)'] },
    { date: 'Sept 14, 2025', subjects: ['Criminal Law (10%)', 'Remedial Law (25%)'] }
  ];

  const amyJavierReminders = [
    "No surprise questions; questions will be short and focused based on the syllabus",
    "Follow the one question-one answer policy. No sub-questions",
    "Never begin an answer with 'It depends'",
    "Answers must be direct to the point",
    "Use the four-sentence format: categorical answer, legal basis, application, and conclusion",
    "Master codal provisions",
    "SPJI questions will appear in all six subjects",
    "Never leave any question unanswered—a chance missed is a chance lost forever"
  ];

  const politicalLawQuestions = [
    {
      id: 1,
      question: "Can the President exercise emergency powers without congressional authorization during a national emergency?",
      topic: "Executive Powers",
      difficulty: "Medium",
      points: 5,
      guidance: "Apply the four-sentence format: categorical answer, legal basis (Constitutional provision), application to scenario, conclusion."
    },
    {
      id: 2,
      question: "A naturalized Filipino citizen wants to run for Senator. Is he eligible?",
      topic: "Citizenship and Elections",
      difficulty: "Easy",
      points: 5,
      guidance: "Remember: direct answer first, then cite Constitutional qualifications for Senator."
    },
    {
      id: 3,
      question: "Can a private school invoke academic freedom to refuse admission to students based on their religious beliefs?",
      topic: "Bill of Rights - Education",
      difficulty: "Hard",
      points: 5,
      guidance: "Balance academic freedom vs. equal protection. Apply strict scrutiny test."
    },
    {
      id: 4,
      question: "Under the SPJI (Strategic Plan for Judicial Innovations), what is the primary purpose of the Electronic Court of Appeals (e-CA)?",
      topic: "SPJI Innovations",
      difficulty: "Medium",
      points: 5,
      guidance: "Justice Amy emphasized SPJI appears in all subjects. Focus on modernization goals."
    },
    {
      id: 5,
      question: "Can Congress delegate its legislative power to the President to fix tariff rates?",
      topic: "Legislative Powers - Delegation",
      difficulty: "Medium",
      points: 5,
      guidance: "Discuss completeness of law test and sufficient standard principle."
    },
    {
      id: 6,
      question: "Is warrantless arrest of a person caught in flagrante delicto constitutional?",
      topic: "Bill of Rights - Arrests",
      difficulty: "Easy",
      points: 5,
      guidance: "Categorical answer about constitutional validity, cite specific exception to warrant requirement."
    },
    {
      id: 7,
      question: "Can a local government unit exercise eminent domain over private property for a mall development by a private corporation?",
      topic: "Eminent Domain - Public Use",
      difficulty: "Hard",
      points: 5,
      guidance: "Analyze public use requirement and whether economic development qualifies."
    },
    {
      id: 8,
      question: "Under the 2022-2027 SPJI, what is the key innovation in case management for trial courts?",
      topic: "SPJI Innovations",
      difficulty: "Medium",
      points: 5,
      guidance: "Focus on digitalization and efficiency improvements Justice Amy emphasized."
    },
    {
      id: 9,
      question: "Can the Ombudsman prosecute a sitting President for graft and corruption?",
      topic: "Public Officers - Accountability",
      difficulty: "Hard",
      points: 5,
      guidance: "Consider presidential immunity vs. Ombudsman jurisdiction. Apply constitutional provisions."
    },
    {
      id: 10,
      question: "Is a law requiring all public assemblies to secure permits 72 hours in advance constitutional?",
      topic: "Bill of Rights - Freedom of Assembly",
      difficulty: "Medium",
      points: 5,
      guidance: "Balance police power vs. fundamental right. Apply time, place, manner restriction test."
    },
    {
      id: 11,
      question: "Can Congress create a law retroactively criminalizing an act that was legal when committed?",
      topic: "Ex Post Facto Laws",
      difficulty: "Easy",
      points: 5,
      guidance: "Direct answer on constitutional prohibition, cite specific constitutional provision."
    },
    {
      id: 12,
      question: "Under the SPJI digital transformation, are electronic signatures on court documents valid?",
      topic: "SPJI Innovations",
      difficulty: "Easy",
      points: 5,
      guidance: "Reference both SPJI guidelines and Electronic Commerce Act provisions."
    },
    {
      id: 13,
      question: "Can a naturalized citizen lose Filipino citizenship by working for a foreign government?",
      topic: "Citizenship - Loss and Reacquisition",
      difficulty: "Medium",
      points: 5,
      guidance: "Distinguish between express renunciation and acts showing intention to renounce."
    },
    {
      id: 14,
      question: "Is a municipal ordinance banning all forms of public protests constitutional?",
      topic: "Local Government - Police Power vs. Bill of Rights",
      difficulty: "Hard",
      points: 5,
      guidance: "Apply overbreadth doctrine and strict scrutiny test for content-based restrictions."
    },
    {
      id: 15,
      question: "Can the Supreme Court's administrative supervision over lower courts include budget allocation?",
      topic: "Judicial Department - Fiscal Autonomy",
      difficulty: "Medium",
      points: 5,
      guidance: "Discuss constitutional fiscal autonomy and separation of powers."
    },
    {
      id: 16,
      question: "Under SPJI, what is the purpose of the Judiciary's Quality Management System?",
      topic: "SPJI Innovations",
      difficulty: "Medium",
      points: 5,
      guidance: "Focus on continuous improvement and service delivery enhancement."
    },
    {
      id: 17,
      question: "Can Congress delegate to the President the power to declare martial law?",
      topic: "Legislative Powers - Non-Delegable Powers",
      difficulty: "Hard",
      points: 5,
      guidance: "Identify constitutional powers that cannot be delegated. Apply separation of powers."
    },
    {
      id: 18,
      question: "Is a law requiring drug testing for all public school teachers constitutional?",
      topic: "Bill of Rights - Privacy vs. Police Power",
      difficulty: "Hard",
      points: 5,
      guidance: "Balance privacy rights vs. compelling state interest. Apply reasonable classification test."
    },
    {
      id: 19,
      question: "Can a party-list representative switch to another party-list group during their term?",
      topic: "Legislative Department - Party-List System",
      difficulty: "Medium",
      points: 5,
      guidance: "Apply party-list system principles and prohibition on turncoatism."
    },
    {
      id: 20,
      question: "Under the SPJI Gender and Development Program, what is required in court proceedings involving women and children?",
      topic: "SPJI Innovations",
      difficulty: "Medium",
      points: 5,
      guidance: "Reference gender-sensitive procedures and special protection measures."
    }
  ];

  const weeklySchedule = {
    1: { 
      title: "Political Law Deep Dive", 
      format: "Single Subject",
      activities: ["NotebookLM + Mindmap", "Outline Creation", "Case Digest Reading", "Codal Review"]
    },
    2: { 
      title: "Commercial Law Deep Dive", 
      format: "Single Subject",
      activities: ["Corporate Law Focus", "Securities Regulation", "Taxation Principles", "Banking Laws"]
    },
    3: { 
      title: "Dual Subject Review", 
      format: "Morning: Political Law | Afternoon: Commercial Law",
      activities: ["Cross-referencing", "Synthesis Work", "Mock Exams", "Rapid Recall"]
    },
    4: { 
      title: "Dual Subject Review", 
      format: "Morning: Civil Law | Afternoon: Labor Law",
      activities: ["Obligations Review", "Family Code", "Labor Standards", "Union Relations"]
    },
    5: { 
      title: "Dual Subject Review", 
      format: "Morning: Criminal Law | Afternoon: Remedial Law",
      activities: ["RPC Analysis", "Special Laws", "Civil Procedure", "Evidence Rules"]
    }
  };

  useEffect(() => {
    let interval;
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsTimerActive(false);
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  const startMockExam = (duration = 3600) => { // 1 hour default
    setCurrentSession('exam');
    setTimeRemaining(duration);
    setIsTimerActive(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setSessionScore(null);
  };

  const startStudySession = () => {
    setCurrentSession('study');
    setTimeRemaining(null);
    setIsTimerActive(false);
  };

  const handleTimeUp = () => {
    setCurrentSession('results');
    calculateScore();
  };

  const calculateScore = () => {
    const answered = answers.filter(answer => answer && answer.trim() !== '').length;
    const percentage = (answered / politicalLawQuestions.length) * 100;
    setSessionScore(percentage);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const nextQuestion = () => {
    if (currentQuestion < politicalLawQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const updateAnswer = (questionIndex, answer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  const markWeekComplete = () => {
    const newProgress = { ...weeklyProgress };
    newProgress[currentWeek].completed = newProgress[currentWeek].total;
    setWeeklyProgress(newProgress);
  };

  if (currentSession === 'exam') {
    const question = politicalLawQuestions[currentQuestion];
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* Timer and Progress */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Clock className="w-6 h-6 text-yellow-300" />
              <span className="text-xl font-mono">{formatTime(timeRemaining)}</span>
            </div>
            <div className="text-center">
              <div className="text-sm opacity-75">Question {currentQuestion + 1} of {politicalLawQuestions.length}</div>
              <div className="text-lg font-semibold">{currentSubject} Mock Exam</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-75">Points: {question.points}</div>
              <div className="text-xs">Difficulty: {question.difficulty}</div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-yellow-400 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold">
                {currentQuestion + 1}
              </div>
              <div className="flex-1">
                <div className="text-sm text-yellow-300 mb-2">{question.topic}</div>
                <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
                
                {/* Amy Javier Format Reminder */}
                <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-lg p-3 mb-4">
                  <div className="text-yellow-300 text-sm font-semibold mb-1">Justice Amy's Four-Sentence Format:</div>
                  <div className="text-sm opacity-90">1. Categorical Answer → 2. Legal Basis → 3. Application → 4. Conclusion</div>
                </div>

                <div className="text-sm text-blue-200 bg-blue-500/20 rounded p-2">
                  <strong>Guidance:</strong> {question.guidance}
                </div>
              </div>
            </div>

            {/* Answer Area */}
            <textarea
              className="w-full h-64 bg-white/10 border border-white/20 rounded-lg p-4 text-white placeholder-white/50 resize-none"
              placeholder="Write your answer here following the four-sentence format...

1. Categorical Answer: [Start with a direct yes/no or clear position]
2. Legal Basis: [Cite specific constitutional provision, law, or doctrine]
3. Application: [Apply the law to the given facts]
4. Conclusion: [Reaffirm your position]"
              value={answers[currentQuestion] || ''}
              onChange={(e) => updateAnswer(currentQuestion, e.target.value)}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center gap-2"
            >
              Previous
            </button>
            
            <div className="text-center text-sm opacity-75">
              Remember: Never leave any question unanswered!
            </div>

            <button
              onClick={nextQuestion}
              disabled={currentQuestion === politicalLawQuestions.length - 1}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {currentQuestion === politicalLawQuestions.length - 1 && (
            <div className="mt-6 text-center">
              <button
                onClick={handleTimeUp}
                className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold"
              >
                Submit Exam
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentSession === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
            <div className="text-3xl font-bold mb-4">Mock Exam Results</div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 rounded-lg p-6">
                <div className="text-4xl font-bold text-yellow-300 mb-2">{sessionScore?.toFixed(0)}%</div>
                <div className="text-sm opacity-75">Completion Rate</div>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <div className="text-4xl font-bold text-blue-300 mb-2">{answers.filter(a => a && a.trim() !== '').length}</div>
                <div className="text-sm opacity-75">Questions Answered</div>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <div className={`text-4xl font-bold mb-2 ${sessionScore >= 75 ? 'text-green-300' : 'text-red-300'}`}>
                  {sessionScore >= 75 ? "PASS" : "NEEDS REVIEW"}
                </div>
                <div className="text-sm opacity-75">Target: 75%</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-lg font-semibold mb-2">Performance Analysis</div>
              <div className="text-sm opacity-75 mb-4">
                {sessionScore >= 90 ? "Excellent! You're well-prepared for this topic." :
                 sessionScore >= 75 ? "Good performance. Review flagged areas." :
                 sessionScore >= 60 ? "Needs improvement. Focus on weak topics." :
                 "Requires intensive review. Study fundamentals again."}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setCurrentSession('study')}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg"
              >
                Return to Study Dashboard
              </button>
              <button
                onClick={() => startMockExam(3600)}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg"
              >
                Take Another Mock Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">2025 Philippine Bar Review System</h1>
              <p className="text-blue-200">Following Justice Amy Lazaro-Javier's Strategic Guidelines</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-yellow-300">Day of Bar Exams</div>
              <div className="text-2xl font-bold">September 7 (Sunday), 10 (Wednesday) and 14 (Sunday)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Exam Schedule */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {examSchedule.map((exam, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-yellow-300 font-semibold">{exam.date}</div>
              {exam.subjects.map((subject, idx) => (
                <div key={idx} className="text-sm mt-1">{subject}</div>
              ))}
            </div>
          ))}
        </div>

        {/* Weekly Progress Tracker */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-yellow-300" />
            <h2 className="text-xl font-semibold">Weekly Study Schedule</h2>
          </div>
          
          <div className="grid md:grid-cols-5 gap-4">
            {Object.entries(weeklySchedule).map(([week, schedule]) => (
              <div 
                key={week}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  currentWeek == week 
                    ? 'border-yellow-400 bg-yellow-400/20' 
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
                onClick={() => setCurrentWeek(parseInt(week))}
              >
                <div className="text-sm text-yellow-300 mb-1">Week {week}</div>
                <div className="font-semibold text-sm mb-2">{schedule.title}</div>
                <div className="text-xs opacity-75 mb-2">{schedule.format}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${(weeklyProgress[week]?.completed || 0) / (weeklyProgress[week]?.total || 1) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs">{weeklyProgress[week]?.completed || 0}/{weeklyProgress[week]?.total || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Week Focus */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Study Session */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-blue-300" />
              <h3 className="text-xl font-semibold">Current Focus: Week {currentWeek}</h3>
            </div>
            
            <div className="mb-4">
              <div className="text-lg font-semibold text-yellow-300">{weeklySchedule[currentWeek].title}</div>
              <div className="text-sm opacity-75 mb-3">{weeklySchedule[currentWeek].format}</div>
              
              <div className="text-sm mb-4">
                <strong>Today's Activities:</strong>
                <ul className="list-disc list-inside mt-2 opacity-75">
                  {weeklySchedule[currentWeek].activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={startStudySession}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-5 h-5" />
                Start Study Session
              </button>
              
              <button
                onClick={() => startMockExam(3600)}
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-500 rounded-lg flex items-center justify-center gap-2"
              >
                <Target className="w-5 h-5" />
                Take Mock Exam (1 Hour)
              </button>
              
              <button
                onClick={() => startMockExam(900)}
                className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-500 rounded-lg flex items-center justify-center gap-2"
              >
                <Clock className="w-5 h-5" />
                Quick Drill (15 mins)
              </button>
            </div>
          </div>

          {/* Amy Javier's Reminders */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-yellow-300" />
              <h3 className="text-xl font-semibold">Justice Amy's Key Reminders</h3>
            </div>
            
            <div className="space-y-3 text-sm">
              {amyJavierReminders.slice(0, 6).map((reminder, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-yellow-300 mt-0.5 flex-shrink-0" />
                  <span className="opacity-90">{reminder}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-yellow-400/20 border border-yellow-400/30 rounded-lg">
              <div className="text-yellow-300 font-semibold text-sm">Four-Sentence Format Template:</div>
              <div className="text-xs mt-1 opacity-90">
                1. Categorical Answer<br/>
                2. Legal Basis<br/>
                3. Application<br/>
                4. Conclusion
              </div>
            </div>
          </div>
        </div>

        {/* Recent Progress */}
        {sessionScore !== null && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-green-300" />
              <h3 className="text-xl font-semibold">Latest Session Results</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{sessionScore.toFixed(0)}%</div>
                <div className="text-sm opacity-75">Completion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300">{answers.filter(a => a).length}</div>
                <div className="text-sm opacity-75">Questions Answered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-300">
                  {sessionScore >= 75 ? "PASS" : "REVIEW"}
                </div>
                <div className="text-sm opacity-75">Target: 75%</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarReviewSystem;
