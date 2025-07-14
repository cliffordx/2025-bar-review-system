import React, { useState, useEffect, useCallback } from 'react';
import { Clock, BookOpen, Target, Calendar, Award, CheckCircle2, PlayCircle, RefreshCw, ArrowRight, Pause, Play, Square, Settings, Coffee, Brain, Bell, BellOff } from 'lucide-react';

const BarReviewSystem = () => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentSubject, setCurrentSubject] = useState('Political Law');
  const [currentSession, setCurrentSession] = useState('study');
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [sessionScore, setSessionScore] = useState(null);
  const [pomodoroState, setPomodoroState] = useState('idle'); // 'idle', 'work', 'break', 'setup'
  const [pomodoroConfig, setPomodoroConfig] = useState({
    workDuration: 90, // minutes
    breakDuration: 10, // minutes
  });
  const [selectedPreset, setSelectedPreset] = useState('deep-dive');
  const [pomodoroRound, setPomodoroRound] = useState(1);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
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

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        setNotificationsEnabled(permission === 'granted');
      });
    } else if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  const sendNotification = (title, body) => {
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/favicon.ico'
      });
    }
  };

  const toggleNotifications = async () => {
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        setNotificationsEnabled(permission === 'granted');
      } else if (Notification.permission === 'granted') {
        setNotificationsEnabled(!notificationsEnabled);
      }
    }
  };

  const startMockExam = (duration = 3600) => {
    setCurrentSession('exam');
    setTimeRemaining(duration);
    setIsTimerActive(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setSessionScore(null);
  };

  const startStudySession = () => {
    setCurrentSession('pomodoro-setup');
    setTimeRemaining(null);
    setIsTimerActive(false);
    setPomodoroState('setup');
    setPomodoroRound(1);
    setTotalStudyTime(0);
  };

  const startPomodoroTimer = () => {
    setCurrentSession('pomodoro');
    setPomodoroState('work');
    setTimeRemaining(pomodoroConfig.workDuration * 60);
    setIsTimerActive(true);
  };

  const pausePomodoroTimer = () => {
    setIsTimerActive(!isTimerActive);
  };

  const resetPomodoroTimer = () => {
    setIsTimerActive(false);
    setTimeRemaining(pomodoroConfig.workDuration * 60);
    setPomodoroState('work');
  };

  const stopPomodoroSession = () => {
    setCurrentSession('study');
    setIsTimerActive(false);
    setTimeRemaining(null);
    setPomodoroState('idle');
  };

  const handleTimeUp = useCallback(() => {
    setCurrentSession('results');
    calculateScore();
  }, []);

  const calculateScore = useCallback(() => {
    const answered = answers.filter(answer => answer && answer.trim() !== '').length;
    const percentage = (answered / politicalLawQuestions.length) * 100;
    setSessionScore(percentage);
  }, [answers]);

  const handlePomodoroComplete = useCallback(() => {
    if (pomodoroState === 'work') {
      setTotalStudyTime(prev => prev + pomodoroConfig.workDuration);
      setPomodoroState('break');
      setTimeRemaining(pomodoroConfig.breakDuration * 60);
      setIsTimerActive(true);
      
      sendNotification('Work session complete!', `Great job! Take a ${pomodoroConfig.breakDuration}-minute break.`);
    } else if (pomodoroState === 'break') {
      setPomodoroRound(prev => prev + 1);
      setPomodoroState('work');
      setTimeRemaining(pomodoroConfig.workDuration * 60);
      setIsTimerActive(false);
      
      sendNotification('Break complete!', 'Ready for another study session?');
    }
  }, [pomodoroState, pomodoroConfig.workDuration, pomodoroConfig.breakDuration, notificationsEnabled]);

  useEffect(() => {
    let interval;
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsTimerActive(false);
      if (currentSession === 'exam') {
        handleTimeUp();
      } else if (currentSession === 'pomodoro') {
        handlePomodoroComplete();
      }
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining, currentSession, handleTimeUp, handlePomodoroComplete]);

  const formatTime = (seconds) => {
    if (!seconds || seconds < 0) return "00:00:00";
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

  if (currentSession === 'pomodoro-setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <div className="text-center mb-8">
              <Settings className="w-12 h-12 text-green-300 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Pomodoro Study Timer Setup</h2>
              <p className="text-green-200">Configure your deep-dive study sessions</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-green-300 mb-2">
                  Work Session Duration (minutes)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="25"
                    max="180"
                    step="5"
                    value={pomodoroConfig.workDuration}
                    onChange={(e) => {
                      setPomodoroConfig(prev => ({...prev, workDuration: parseInt(e.target.value)}));
                      setSelectedPreset('custom');
                    }}
                    className="flex-1 h-3 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #10b981 0%, #10b981 ${((pomodoroConfig.workDuration - 25) / (180 - 25)) * 100}%, rgba(255,255,255,0.2) ${((pomodoroConfig.workDuration - 25) / (180 - 25)) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                  <div className="bg-white/10 px-4 py-2 rounded-lg min-w-[80px] text-center font-mono text-lg">
                    {pomodoroConfig.workDuration}m
                  </div>
                </div>
                <div className="text-xs text-green-200 mt-1">
                  Recommended: 90 minutes (follows your deep-dive methodology)
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-300 mb-2">
                  Break Duration (minutes)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={pomodoroConfig.breakDuration}
                    onChange={(e) => {
                      setPomodoroConfig(prev => ({...prev, breakDuration: parseInt(e.target.value)}));
                      setSelectedPreset('custom');
                    }}
                    className="flex-1 h-3 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #10b981 0%, #10b981 ${((pomodoroConfig.breakDuration - 5) / (30 - 5)) * 100}%, rgba(255,255,255,0.2) ${((pomodoroConfig.breakDuration - 5) / (30 - 5)) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                  <div className="bg-white/10 px-4 py-2 rounded-lg min-w-[80px] text-center font-mono text-lg">
                    {pomodoroConfig.breakDuration}m
                  </div>
                </div>
                <div className="text-xs text-green-200 mt-1">
                  Recommended: 10-15 minutes for optimal recovery
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-300 mb-3">
                  Quick Presets
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => {
                      setPomodoroConfig({workDuration: 25, breakDuration: 5});
                      setSelectedPreset('classic');
                    }}
                    className={`p-3 rounded-lg text-sm transition-all ${
                      selectedPreset === 'classic' 
                        ? 'bg-green-500/30 hover:bg-green-500/40 border border-green-400/50' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="font-semibold">Classic</div>
                    <div className="text-xs opacity-75">25m + 5m</div>
                  </button>
                  <button
                    onClick={() => {
                      setPomodoroConfig({workDuration: 50, breakDuration: 10});
                      setSelectedPreset('extended');
                    }}
                    className={`p-3 rounded-lg text-sm transition-all ${
                      selectedPreset === 'extended' 
                        ? 'bg-green-500/30 hover:bg-green-500/40 border border-green-400/50' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="font-semibold">Extended</div>
                    <div className="text-xs opacity-75">50m + 10m</div>
                  </button>
                  <button
                    onClick={() => {
                      setPomodoroConfig({workDuration: 90, breakDuration: 10});
                      setSelectedPreset('deep-dive');
                    }}
                    className={`p-3 rounded-lg text-sm transition-all ${
                      selectedPreset === 'deep-dive' 
                        ? 'bg-green-500/30 hover:bg-green-500/40 border border-green-400/50' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="font-semibold">Deep Dive</div>
                    <div className="text-xs opacity-75">90m + 10m</div>
                  </button>
                  <button
                    onClick={() => {
                      setPomodoroConfig({workDuration: 120, breakDuration: 15});
                      setSelectedPreset('ultra');
                    }}
                    className={`p-3 rounded-lg text-sm transition-all ${
                      selectedPreset === 'ultra' 
                        ? 'bg-green-500/30 hover:bg-green-500/40 border border-green-400/50' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="font-semibold">Ultra</div>
                    <div className="text-xs opacity-75">120m + 15m</div>
                  </button>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm text-green-300 mb-1">Current Focus</div>
                <div className="text-xl font-semibold">{weeklySchedule[currentWeek].title}</div>
                <div className="text-sm opacity-75">{weeklySchedule[currentWeek].format}</div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-green-300">Notifications</span>
                  <button
                    onClick={toggleNotifications}
                    className="flex items-center gap-2 text-sm"
                  >
                    {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                    {notificationsEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                <div className="text-xs opacity-75">
                  Get notified when work sessions and breaks complete
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setCurrentSession('study')}
                  className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={startPomodoroTimer}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors"
                >
                  <Brain className="w-5 h-5" />
                  Start Study Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentSession === 'pomodoro') {
    const isWorkSession = pomodoroState === 'work';
    const sessionType = isWorkSession ? 'Work Session' : 'Break Time';
    const bgColor = isWorkSession ? 'from-blue-900 via-blue-800 to-indigo-900' : 'from-green-900 via-green-800 to-emerald-900';
    const accentColor = isWorkSession ? 'text-blue-300' : 'text-green-300';
    const IconComponent = isWorkSession ? Brain : Coffee;
    const maxDuration = isWorkSession ? pomodoroConfig.workDuration : pomodoroConfig.breakDuration;

    return (
      <div className={`min-h-screen bg-gradient-to-br ${bgColor} text-white p-6`}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <IconComponent className={`w-8 h-8 ${accentColor}`} />
                <div>
                  <div className="text-2xl font-bold">{sessionType}</div>
                  <div className="text-sm opacity-75">Round {pomodoroRound}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-75">Total Study Time</div>
                <div className="text-lg font-semibold">{Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m</div>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 mb-6">
              <div className="text-8xl font-mono font-bold mb-4">
                {formatTime(timeRemaining)}
              </div>
              <div className={`text-xl ${accentColor} mb-6`}>
                {isWorkSession ? 
                  `Focus on ${weeklySchedule[currentWeek].title}` : 
                  'Take a well-deserved break!'
                }
              </div>
              
              <div className="w-full bg-white/20 rounded-full h-3 mb-6">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    isWorkSession ? 'bg-blue-400' : 'bg-green-400'
                  }`}
                  style={{ 
                    width: `${Math.max(0, Math.min(100, 100 - (timeRemaining / (maxDuration * 60)) * 100))}%` 
                  }}
                />
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={pausePomodoroTimer}
                  className={`px-8 py-4 ${
                    isWorkSession ? 'bg-blue-600 hover:bg-blue-500' : 'bg-green-600 hover:bg-green-500'
                  } rounded-lg flex items-center gap-2 font-semibold text-lg transition-colors`}
                >
                  {isTimerActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  {isTimerActive ? 'Pause' : 'Resume'}
                </button>
                
                <button
                  onClick={resetPomodoroTimer}
                  className="px-8 py-4 bg-gray-600 hover:bg-gray-500 rounded-lg flex items-center gap-2 font-semibold text-lg transition-colors"
                >
                  <RefreshCw className="w-6 h-6" />
                  Reset
                </button>
                
                <button
                  onClick={stopPomodoroSession}
                  className="px-8 py-4 bg-red-600 hover:bg-red-500 rounded-lg flex items-center gap-2 font-semibold text-lg transition-colors"
                >
                  <Square className="w-6 h-6" />
                  Stop
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Current Session</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Session Type:</span>
                  <span className={`font-semibold ${accentColor}`}>{sessionType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{maxDuration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Round:</span>
                  <span>{pomodoroRound}</span>
                </div>
                <div className="flex justify-between">
                  <span>Focus Area:</span>
                  <span>{weeklySchedule[currentWeek].title}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">
                {isWorkSession ? 'Study Tips' : 'Break Suggestions'}
              </h3>
              <div className="space-y-2 text-sm">
                {(isWorkSession ? [
                  '📚 Focus on one topic at a time',
                  '✍️ Take notes using the four-sentence format',
                  '🎯 Review codal provisions actively',
                  '💡 Apply Justice Amy\'s guidelines',
                  '🔕 Keep phone in another room'
                ] : [
                  '🚶 Take a short walk outside',
                  '💧 Hydrate with water',
                  '🧘 Do light stretching',
                  '👀 Rest your eyes (look away from screen)',
                  '🍎 Have a healthy snack'
                ]).map((tip, tipIndex) => (
                  <div key={tipIndex} className="opacity-90">{tip}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentSession === 'exam') {
    const question = politicalLawQuestions[currentQuestion];
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
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

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-yellow-400 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold">
                {currentQuestion + 1}
              </div>
              <div className="flex-1">
                <div className="text-sm text-yellow-300 mb-2">{question.topic}</div>
                <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
                
                <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-lg p-3 mb-4">
                  <div className="text-yellow-300 text-sm font-semibold mb-1">Justice Amy's Four-Sentence Format:</div>
                  <div className="text-sm opacity-90">
                    1. Categorical Answer → 2. Legal Basis → 3. Application → 4. Conclusion
                  </div>
                </div>

                <div className="text-sm text-blue-200 bg-blue-500/20 rounded p-2">
                  <strong>Guidance:</strong> {question.guidance}
                </div>
              </div>
            </div>

            <textarea
              className="w-full h-64 bg-white/10 border border-white/20 rounded-lg p-4 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Write your answer here following the four-sentence format...

1. Categorical Answer: [Start with a direct yes/no or clear position]
2. Legal Basis: [Cite specific constitutional provision, law, or doctrine]
3. Application: [Apply the law to the given facts]
4. Conclusion: [Reaffirm your position]"
              value={answers[currentQuestion] || ''}
              onChange={(e) => updateAnswer(currentQuestion, e.target.value)}
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center gap-2 transition-colors"
            >
              Previous
            </button>
            
            <div className="text-center text-sm opacity-75">
              Remember: Never leave any question unanswered!
            </div>

            <button
              onClick={nextQuestion}
              disabled={currentQuestion === politicalLawQuestions.length - 1}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center gap-2 transition-colors"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {currentQuestion === politicalLawQuestions.length - 1 && (
            <div className="mt-6 text-center">
              <button
                onClick={handleTimeUp}
                className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-colors"
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
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                Return to Study Dashboard
              </button>
              <button
                onClick={() => startMockExam(3600)}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
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
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">2025 Philippine Bar Review System</h1>
              <p className="text-blue-200">Following Justice Amy Lazaro-Javier's Strategic Guidelines</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-yellow-300">Days to Bar Exam</div>
              <div className="text-2xl font-bold">September 7, 10, 14, 2025</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {examSchedule.map((exam, examIndex) => (
            <div key={examIndex} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-yellow-300 font-semibold">{exam.date}</div>
              {exam.subjects.map((subject, subjectIndex) => (
                <div key={subjectIndex} className="text-sm mt-1">{subject}</div>
              ))}
            </div>
          ))}
        </div>

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

        <div className="grid md:grid-cols-2 gap-6 mb-8">
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
                  {weeklySchedule[currentWeek].activities.map((activity, activityIndex) => (
                    <li key={activityIndex}>{activity}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={startStudySession}
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-500 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Brain className="w-5 h-5" />
                Start Pomodoro Study Session
              </button>
              
              <button
                onClick={() => startMockExam(3600)}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Target className="w-5 h-5" />
                Take Mock Exam (1 Hour)
              </button>
              
              <button
                onClick={() => startMockExam(900)}
                className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-500 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Clock className="w-5 h-5" />
                Quick Drill (15 mins)
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-yellow-300" />
              <h3 className="text-xl font-semibold">Justice Amy's Key Reminders</h3>
            </div>
            
            <div className="space-y-3 text-sm">
              {amyJavierReminders.slice(0, 6).map((reminder, reminderIndex) => (
                <div key={reminderIndex} className="flex items-start gap-3">
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