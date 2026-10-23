import React, { useState, useEffect, useRef } from "react";
import { 
  User, 
  Ecopoint, 
  Disposal, 
  Badge, 
  QuizQuestion, 
  Article, 
  ScanResult
} from "./types";
import { 
  SEED_ECOPOINTS, 
  BADGES, 
  QUIZ_QUESTIONS, 
  EDUCATION_ARTICLES 
} from "./constants";
import { BonfireBackground } from "./components/BonfireBackground";
import { 
  MapPin, 
  Search, 
  Award, 
  Shield, 
  Zap, 
  Compass, 
  Navigation, 
  Flame, 
  HelpCircle, 
  BookOpen, 
  Layers, 
  History, 
  User as UserIcon, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  ArrowRight, 
  Sparkles, 
  Leaf, 
  Upload, 
  Trash2, 
  Clock, 
  Info,
  Phone,
  BarChart2,
  Lock,
  LogOut,
  Mail,
  UserCheck
} from "lucide-react";

// Default initial states
const DEFAULT_USER: User = {
  id: "user-123",
  nome: "Danilo Rodrigues",
  email: "danilo.rodrigues@ufrb.br",
  pontuacao: 180,
  nivel: 2
};

const SEED_DISPOSALS: Disposal[] = [
  {
    id: "disp-1",
    user_id: "user-123",
    ecopoint_id: 1,
    tipo_residuo: "Computadores / Notebooks",
    peso: 2.1,
    data: "2026-06-02T14:30:00.000Z",
    pontos_ganhos: 60,
    equipamento_nome: "Notebook Dell Inspiron"
  },
  {
    id: "disp-2",
    user_id: "user-123",
    ecopoint_id: 2,
    tipo_residuo: "Pilhas / Baterias",
    peso: 0.4,
    data: "2026-06-08T09:15:00.000Z",
    pontos_ganhos: 25,
    equipamento_nome: "Conjunto de Pilhas Alcalinas"
  }
];

export default function App() {
  // --- STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem("ecomap_logged_in");
    return saved === "true";
  });
  
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem("ecomap_user");
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [disposals, setDisposals] = useState<Disposal[]>(() => {
    const saved = localStorage.getItem("ecomap_disposals");
    return saved ? JSON.parse(saved) : SEED_DISPOSALS;
  });

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMaterialFilter, setSelectedMaterialFilter] = useState<string>("Todos");
  const [selectedEcopoint, setSelectedEcopoint] = useState<Ecopoint | null>(SEED_ECOPOINTS[0]);
  
  // Login flow state
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginName, setLoginName] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");


  
  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [quizPointsEarned, setQuizPointsEarned] = useState<number>(0);
  const [answeredQuestionsSet, setAnsweredQuestionsSet] = useState<number[]>([]);

  // Education state
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(EDUCATION_ARTICLES[0]);
  const [readArticles, setReadArticles] = useState<string[]>([]);

  // Local Storage Sync
  useEffect(() => {
    localStorage.setItem("ecomap_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("ecomap_disposals", JSON.stringify(disposals));
  }, [disposals]);

  useEffect(() => {
    localStorage.setItem("ecomap_logged_in", isLoggedIn ? "true" : "false");
  }, [isLoggedIn]);

  // Handle Login
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginName) {
      setAuthError("Por favor, preencha todos os campos.");
      return;
    }
    const newUser: User = {
      id: "user-" + Math.random().toString(36).substr(2, 9),
      nome: loginName,
      email: loginEmail,
      pontuacao: 50, // Welcome points
      nivel: 1
    };
    setUser(newUser);
    setIsLoggedIn(true);
    setAuthError("");
  };

  const handleQuickLogin = () => {
    setUser(DEFAULT_USER);
    setIsLoggedIn(true);
    setAuthError("");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("ecomap_logged_in");
  };

  const handleResetData = () => {
    if (window.confirm("Deseja realmente resetar seus dados de progresso no RecySouls?")) {
      setUser(DEFAULT_USER);
      setDisposals(SEED_DISPOSALS);
      setReadArticles([]);
      setAnsweredQuestionsSet([]);
      setCurrentQuestionIndex(0);
      setQuizCompleted(false);
      alert("Sua jornada foi reiniciada e suas Almas Recicladas retornaram ao estado inicial!");
    }
  };

  // Add Score points
  const addScorePoints = (points: number) => {
    setUser(prev => {
      const nextPoints = prev.pontuacao + points;
      // Simple Level progression threshold (e.g. Nível 1 sub 100, Nível 2 < 200, Nível 3 >= 200)
      let nextLevel = 1;
      if (nextPoints >= 350) {
        nextLevel = 3; // Herói Verde Level
      } else if (nextPoints >= 150) {
        nextLevel = 2; // Guardião Ambiental Level
      }
      return {
        ...prev,
        pontuacao: nextPoints,
        nivel: nextLevel
      };
    });
  };

  // --- FILTERS & GEO METRICS ---
  const filteredEcopoints = SEED_ECOPOINTS.filter(pt => {
    const matchesSearch = pt.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pt.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pt.regiao.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedMaterialFilter === "Todos") return matchesSearch;
    return matchesSearch && pt.materiais_aceitos.includes(selectedMaterialFilter);
  });

  const allMaterials = Array.from(
    new Set(SEED_ECOPOINTS.flatMap(pt => pt.materiais_aceitos))
  );



  // --- QUIZ ACTIONS ---
  const handleQuizAnswer = (optionIdx: number) => {
    if (quizAnswered) return;
    
    setSelectedOption(optionIdx);
    setQuizAnswered(true);
    
    const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
    const isCorrect = optionIdx === currentQ.resposta_correta;
    setQuizCorrect(isCorrect);

    if (isCorrect) {
      // Award 20 points
      addScorePoints(20);
      setQuizPointsEarned(prev => prev + 20);
    }
    
    setAnsweredQuestionsSet(prev => [...prev, currentQ.id]);
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setQuizAnswered(false);
    setQuizCorrect(null);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setQuizAnswered(false);
    setQuizCorrect(null);
    setQuizCompleted(false);
    setQuizPointsEarned(0);
  };

  // --- EDUCATION ACTIONS ---
  const handleReadArticle = (art: Article) => {
    setSelectedArticle(art);
    if (!readArticles.includes(art.id)) {
      setReadArticles(prev => [...prev, art.id]);
      addScorePoints(10); // Reward +10 points for reading environment tips
    }
  };

  // Global totals
  const totalKg = disposals.reduce((sum, d) => sum + d.peso, 0);
  const totalCO2Of = totalKg * 2.42;

  // Active Badges computed from current points
  const activeBadges = BADGES.filter(b => user.pontuacao >= b.pontos_requisito);
  const nextBadge = BADGES.find(b => user.pontuacao < b.pontos_requisito);

  const getBadgeIconComponent = (id: string) => {
    switch (id) {
      case "reciclador_iniciante":
        return <Award className="w-6 h-6 shrink-0" />;
      case "guardiao_ambiental":
        return <Shield className="w-6 h-6 shrink-0" />;
      case "heroi_verde":
        return <Zap className="w-6 h-6 shrink-0" />;
      default:
        return <Sparkles className="w-6 h-6 shrink-0" />;
    }
  };

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0b0705] text-white font-sans overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>
        
        {/* Dark Souls custom interactive vector bonfire background */}
        <BonfireBackground />
        
        <div className="w-full max-w-md glass p-8 shadow-2xl relative z-10 space-y-7 animate-fade-in border border-[#2d1e16]">
          {/* Logo */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-[#4a1010] border border-[#6b1f1f] rounded-xl flex items-center justify-center mx-auto shadow-md">
              <Flame className="w-9 h-9 text-[#ffaa44] animate-pulseslow" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold tracking-widest text-[#d4a359] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                RecySouls
              </h1>
              <p className="text-[#ebd7c3]/60 text-xs mt-1 font-mono uppercase tracking-widest">Santuário de Almas de Metal</p>
            </div>
          </div>

          <div className="bg-[#0f0a07] border border-[#2d1e16] p-4 rounded text-center">
            <p className="text-[11px] text-[#ebd7c3] font-medium leading-relaxed font-mono uppercase tracking-wider">
              Sua jornada para purificar os resíduos eletrônicos do semiárido baiano começa aqui. Ofereça itens na Fogueira e recolha Almas Recicladas.
            </p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#d4a359] uppercase tracking-widest mb-1.5 font-mono">Nome do Reciclador</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#d4a359]/50">
                  <UserIcon className="w-4 h-4" />
                </span>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Danilo Rodrigues"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  className="w-full h-11 bg-[#0f0a07] border border-[#2d1e16] rounded px-4 pl-10 text-xs outline-none focus:border-[#d4a359] focus:ring-1 focus:ring-[#d4a359]/20 transition text-[#ebd7c3] placeholder-[#ebd7c3]/30 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#d4a359] uppercase tracking-widest mb-1.5 font-mono">E-mail de Cadastro</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#d4a359]/50">
                  <Mail className="w-4 h-4" />
                </span>
                <input 
                  type="email" 
                  required
                  placeholder="nome@universidade.edu.br"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full h-11 bg-[#0f0a07] border border-[#2d1e16] rounded px-4 pl-10 text-xs outline-none focus:border-[#d4a359] focus:ring-1 focus:ring-[#d4a359]/20 transition text-[#ebd7c3] placeholder-[#ebd7c3]/30 font-mono"
                />
              </div>
            </div>

            {authError && (
              <p className="text-xs text-rose-300 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full h-11 medieval-wax-seal text-white font-mono uppercase tracking-widest font-bold rounded text-xs transition-all shadow-md cursor-pointer flex items-center justify-center border-0"
            >
              Entrar
            </button>
          </form>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-[#2d1e16] w-full font-mono"></div>
            <span className="absolute bg-[#120c09] px-3 text-[10px] text-[#ebd7c3]/50 uppercase tracking-widest font-mono">OU</span>
          </div>

          <button
            type="button"
            onClick={handleQuickLogin}
            className="w-full h-11 bg-[#1a110a] hover:bg-[#23170e] border border-[#2d1e16] text-[#ebd7c3] font-mono uppercase tracking-widest text-[10px] transition-colors flex items-center justify-center gap-2 cursor-pointer rounded"
          >
            <UserCheck className="w-4 h-4 text-[#d4a359]" />
            Convidado Latente (Unkindled)
          </button>
        </div>
      </div>
    );
  }

  // MAIN SYSTEM INTERFACE
  return (
    <div className="min-h-screen w-full bg-[#0b0705] text-white p-3 md:p-6 font-sans relative flex flex-col justify-between overflow-hidden">
      {/* Background custom decorations */}
      <BonfireBackground />
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-stone-900 rounded-full opacity-5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-stone-950 rounded-full opacity-5 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-5 items-stretch flex-1 relative z-10">
        
        {/* SIDE NAV PANEL */}
        <aside className="w-full lg:w-64 glass p-5 flex flex-col rounded-3xl shrink-0 border border-[#2d1e16]" id="aside-navbar">
          {/* Logo */}
          <div className="flex items-center justify-between lg:justify-start gap-3 mb-6 lg:mb-8 px-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-[#4a1010] border border-[#6b1f1f] rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-md">
                <Flame className="w-5 h-5 text-[#ffaa44] animate-pulseslow" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold tracking-widest text-[#d4a359]">RecySouls</h1>
                <span className="text-[10px] opacity-45 uppercase tracking-widest font-mono font-medium block">Santuário de Almas</span>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="lg:hidden p-2 text-white/60 hover:text-rose-400 transition"
              title="Sair da conta"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5 flex-1" id="mainsystem-tabs">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "dashboard" ? "active-nav font-semibold shadow-xs" : "text-white/65 hover:bg-white/5"
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Painel de Almas</span>
            </button>

            <button
              onClick={() => setActiveTab("map")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "map" ? "active-nav font-semibold shadow-xs" : "text-white/65 hover:bg-white/5"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Fogueiras e Mapas</span>
            </button>

            <button
              onClick={() => setActiveTab("education")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "education" ? "active-nav font-semibold shadow-xs" : "text-white/65 hover:bg-white/5"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Filosofia Ambiental</span>
            </button>

            <button
              onClick={() => setActiveTab("quiz")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "quiz" ? "active-nav font-semibold shadow-xs" : "text-white/65 hover:bg-white/5"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Pergaminhos de Teste</span>
            </button>
          </nav>

          {/* User badge static info footer */}
          <div className="mt-6 lg:mt-auto glass-dark p-4 rounded-2xl space-y-3 border border-[#2d1e16]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#d4a359] font-semibold tracking-wide uppercase font-mono">Nível {user.nivel} - Guardião</span>
              <span className="text-white/40 text-[10px] font-mono">{user.pontuacao} pts</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-black/60 h-2 rounded overflow-hidden border border-[#2d1e16]">
              <div 
                className="bg-gradient-to-r from-[#d4a359] to-[#f47c22] h-full rounded transition-all duration-500"
                style={{ width: `${Math.min(100, (user.pontuacao / 350) * 100)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/50">
              <span className="truncate max-w-[120px] font-mono">{user.nome}</span>
              <button 
                onClick={handleLogout}
                className="hover:text-rose-400 transition flex items-center font-semibold text-[10px] uppercase tracking-wider font-mono"
              >
                Sair
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN PANEL */}
        <main className="flex-1 flex flex-col gap-5 overflow-hidden">
          
          {/* HEADER SECTION */}
          <header className="flex flex-col sm:flex-row items-center justify-between gap-4 glass px-5 py-3 rounded-2xl h-auto shrink-0 border border-[#2d1e16]">
            <div className="flex-1 w-full max-w-sm">
              <div className="glass-dark h-9 flex items-center px-3 gap-2.5 rounded-lg border border-[#2d1e16]">
                <Search className="w-3.5 h-3.5 text-white/40" />
                <input 
                  type="text" 
                  placeholder="Buscar fogueiras em FSA..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-white placeholder:text-white/30 font-mono"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="text-[10px] opacity-40 hover:opacity-100">✕</button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              <div className="glass-dark h-9 px-3 flex items-center gap-1.5 rounded-lg border border-[#2d1e16] text-xs text-[#d4a359]">
                <MapPin className="w-3.5 h-3.5 text-[#d4a359]" />
                <span className="font-semibold font-mono">Feira de Santana, BA</span>
              </div>

              <div 
                onClick={() => setActiveTab("dashboard")}
                className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 px-2.5 rounded-lg transition border border-transparent hover:border-[#2d1e16]/30"
              >
                <div className="w-8 h-8 bg-[#4a1010] rounded-full flex items-center justify-center font-mono font-bold text-xs text-[#ebd7c3] border border-[#6b1f1f]">
                  {user.nome.substring(0, 2).toUpperCase()}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold font-sans">{user.nome}</div>
                  <div className="text-[9px] text-[#d4a359]/70 font-mono tracking-widest uppercase">Guardiano Latente</div>
                </div>
              </div>
            </div>
          </header>

          {/* DYNAMIC SCROLLABLE TAB CONTAINER */}
          <div className="flex-1 overflow-y-auto max-h-[72vh] lg:max-h-[82vh] pr-1">
            
            {/* TAB 1: PAINEL DE IMPACTO */}
            {activeTab === "dashboard" && (
              <div className="space-y-5 animate-fade-in" id="dashboard-tab">
                
                {/* Hero Box */}
                <div className="relative overflow-hidden bg-gradient-to-b from-[#2d1a10] to-[#140a06] text-white rounded-3xl p-5 md:p-6 border border-[#2d1e16] shadow-lg">
                  <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-[#d4a359]/10 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-36 h-36 bg-[#f47c22]/5 rounded-full opacity-10 blur-2xl pointer-events-none"></div>

                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center space-x-1.5">
                      <span className="bg-[#d4a359]/20 border border-[#d4a359]/40 text-[#f7d299] text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#ebd299] animate-pulse" />
                        Guardião do Semiárido • FSA
                      </span>
                    </div>

                    <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight">
                      Saudações, {user.nome}! ⚔️
                    </h2>
                    <p className="text-[#ebd7c3]/70 text-xs max-w-xl leading-relaxed">
                      Consagre o lixo eletrônico quebrado aos fogos da purificação. Vossa retidão ecológica mantém o semiárido baiano livre de contaminantes e vossas moedas de prestígio florescem no templo.
                    </p>

                    {/* Quick Progress */}
                    <div className="pt-2">
                      <div className="flex justify-between items-end text-[10px] text-[#f7d299] font-mono mb-1 uppercase tracking-wider">
                        <span>Prestígio Acumulado: {user.pontuacao} pts</span>
                        <span>
                          {nextBadge 
                            ? `Requer mais ${nextBadge.pontos_requisito - user.pontuacao} moedas para: [${nextBadge.nome}]`
                            : "Nível de Cavaleiro Lendário Atingido! 👑"}
                        </span>
                      </div>
                      <div className="w-full bg-black/60 rounded h-2 overflow-hidden border border-[#2d1e16]">
                        <div 
                          className="bg-gradient-to-r from-[#d4a359] to-[#f47c22] h-full rounded transition-all duration-500"
                          style={{ width: `${Math.min(100, (user.pontuacao / 350) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bento Grid Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass p-4 rounded-xl flex items-center space-x-4 border border-[#2d1e16]">
                    <div className="p-3 bg-[#4a1010]/20 text-[#d4a359] rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[#d4a359]/70 uppercase tracking-widest font-mono">Resíduos Entregues</p>
                      <h4 className="font-display text-xl font-bold text-white font-mono mt-0.5">
                        {totalKg.toFixed(1)} <span className="text-xs font-sans font-medium text-white/50">kg</span>
                      </h4>
                      <p className="text-[9px] text-[#ebd7c3] font-mono uppercase tracking-wider">Purificação Segura</p>
                    </div>
                  </div>

                  <div className="glass p-4 rounded-xl flex items-center space-x-4 border border-[#2d1e16]">
                    <div className="p-3 bg-[#4a1010]/15 text-[#d4a359] rounded-lg">
                      <Leaf className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[#d4a359]/70 uppercase tracking-widest font-mono">Purificação do Ar</p>
                      <h4 className="font-display text-xl font-bold text-white font-mono mt-0.5">
                        {totalCO2Of.toFixed(1)} <span className="text-xs font-sans font-medium text-white/50">kg</span>
                      </h4>
                      <p className="text-[9px] text-[#ebd7c3] font-mono uppercase tracking-wider">CO₂ Impedido</p>
                    </div>
                  </div>

                  <div className="glass p-4 rounded-xl flex items-center space-x-4 border border-[#2d1e16]">
                    <div className="p-3 bg-[#4a1010]/15 text-[#d4a359] rounded-lg">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[#d4a359]/70 uppercase tracking-widest font-mono">Essência de Almas</p>
                      <h4 className="font-display text-xl font-bold text-white font-mono mt-0.5">
                        {user.pontuacao} <span className="text-xs font-sans font-medium text-white/50">pts</span>
                      </h4>
                      <p className="text-[9px] text-[#ebd7c3] font-mono uppercase tracking-wider">Acúmulo de Mérito</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left Column: Weekly & Quick actions */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Weekly progress representation */}
                    <div className="glass p-5 rounded-2xl space-y-3.5 border border-[#2d1e16]">
                      <div className="flex justify-between items-center mb-1">
                        <div>
                          <h4 className="font-display font-bold text-sm text-white">Estatísticas Semanais</h4>
                          <p className="text-[11px] text-white/40">Descartes e reciclagem de resíduos por dia</p>
                        </div>
                        <span className="text-[9px] bg-[#4a1010]/20 border border-[#2d1e16] text-[#d4a359] px-2 py-0.5 rounded font-mono">
                          67% das Oferendas Concluídas
                        </span>
                      </div>

                      <div className="space-y-2.5 pt-1">
                        {[
                          { day: "Segunda", kg: 1.2, item: "Pilhas" },
                          { day: "Terça", kg: 0.0, item: "-" },
                          { day: "Quarta", kg: 2.1, item: "Cabos / Smartphone" },
                          { day: "Quinta", kg: 0.5, item: "Adaptadores" },
                          { day: "Sexta", kg: 4.8, item: "Notebook / Componentes" },
                          { day: "Sábado", kg: 0.0, item: "-" },
                        ].map((d, i) => (
                          <div key={i} className="flex items-center space-x-3 text-xs text-white/85">
                            <span className="w-16 font-medium text-white/60 font-mono">{d.day}</span>
                            <div className="flex-1 bg-black/45 h-4 rounded overflow-hidden relative border border-[#2d1e16]/20">
                              <div 
                                className="bg-gradient-to-r from-[#d4a359] to-[#f47c22] h-full rounded transition-all duration-500"
                                style={{ width: `${d.kg > 0 ? (d.kg / 5) * 100 : 0}%` }}
                              ></div>
                              {d.kg > 0 && (
                                <span className="absolute right-2 top-0.5 font-mono text-[9px] font-bold text-white/95">
                                  {d.kg} kg ({d.item})
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Real-time feed of disposals */}
                    <div className="glass p-5 rounded-2xl space-y-3 border border-[#2d1e16]">
                      <h4 className="font-display font-semibold text-sm text-white flex items-center gap-2">
                        <History className="w-4 h-4 text-[#d4a359]" />
                        Crônicas de Purificação (Histórico de Descarte)
                      </h4>
                      
                      {disposals.length === 0 ? (
                        <p className="text-xs text-white/40 italic py-3 text-center">Nenhum descarte efetuado ainda. Vá na aba de mapas para encontrar o primeiro fogareiro de purificação!</p>
                      ) : (
                        <div className="space-y-2.5 max-h-[160px] overflow-y-auto">
                          {disposals.map((disp) => {
                            const matchingEcopoint = SEED_ECOPOINTS.find(p => p.id === disp.ecopoint_id);
                            return (
                              <div key={disp.id} className="glass-dark p-3 rounded-xl flex items-center justify-between border border-[#2d1e16]">
                                <div className="space-y-1">
                                  <h5 className="text-xs font-semibold text-white">
                                    {disp.equipamento_nome || disp.tipo_residuo}
                                  </h5>
                                  <p className="text-[10px] text-white/45 flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-[#d4a359] shrink-0" />
                                    Entregue em: {matchingEcopoint?.nome || "Posto Autorizado"} • {new Date(disp.data).toLocaleDateString("pt-BR")}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-bold font-mono text-[#d4a359]">+{disp.pontos_ganhos} pts</span>
                                  <div className="text-[9px] text-white/40 font-mono">{disp.peso.toFixed(1)} kg</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Badges status & Quiz Prompt */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Achievements Widget */}
                    <div className="glass p-5 rounded-2xl space-y-4 border border-[#2d1e16]">
                      <div>
                        <h4 className="font-display font-semibold text-sm text-white">Insígnias do Conclave</h4>
                        <p className="text-[11px] text-white/40">Baseado no seu impacto positivo</p>
                      </div>

                      <div className="space-y-3">
                        {BADGES.map((badge) => {
                          const unlocked = user.pontuacao >= badge.pontos_requisito;
                          return (
                            <div 
                              key={badge.id}
                              className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                                unlocked ? "bg-[#4a1010]/10 border-[#d4a359]/45" : "bg-black/25 border-[#2d1e16]/35 opacity-40"
                              }`}
                            >
                              <div className={`p-2 rounded-lg ${unlocked ? "bg-[#d4a359]/20 text-[#ebd7c3]" : "bg-white/5 text-white/30"}`}>
                                {getBadgeIconComponent(badge.id)}
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5 font-mono">
                                  <h5 className="text-xs font-bold text-white">{badge.nome}</h5>
                                  {unlocked ? (
                                    <span className="text-[8px] bg-[#d4a359]/20 text-[#ebd299] px-1.5 py-0.2 rounded font-semibold">ATIVO</span>
                                  ) : (
                                    <span className="text-[8px] bg-white/5 text-white/40 px-1.5 py-0.2 rounded font-mono">{badge.pontos_requisito} pts</span>
                                  )}
                                </div>
                                <p className="text-[10px] text-white/50 leading-relaxed font-sans">{badge.descricao}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Environmental Quiz Prompt */}
                    <div 
                      onClick={() => setActiveTab("quiz")}
                      className="glass p-5 rounded-2xl bg-[#1a110a] border border-[#2d1e16] cursor-pointer hover:border-[#d4a359]/40 transition group relative"
                    >
                      <div className="absolute top-2 right-2 text-[#d4a359] flex items-center justify-center p-1 bg-[#d4a359]/10 rounded-full">
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <span className="text-[9px] uppercase font-bold text-[#d4a359] tracking-widest font-mono">Desafio Ativo</span>
                      <h4 className="font-display font-semibold text-sm text-white mt-1 leading-tight group-hover:text-[#f7d299] transition-colors">
                        Desafio dos Pergaminhos
                      </h4>
                      <p className="text-[11px] text-white/50 mt-1.5 leading-relaxed font-sans">
                        Responda corretamente aos mistérios da ecologia e herde pontos de prestígio.
                      </p>
                    </div>

                    {/* Reset Button */}
                    <div className="text-center">
                      <button 
                        onClick={handleResetData}
                        className="text-[10px] text-white/35 hover:text-rose-400 flex items-center gap-1 mx-auto font-mono hover:underline"
                      >
                        <RefreshCw className="w-3 h-3" /> Reiniciar Progresso Acadêmico
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
                  {/* TAB 2: MAPA E FILTROS */}
            {activeTab === "map" && (
              <div className="space-y-4 animate-fade-in" id="map-tab">
                <div className="glass p-4 rounded-2xl space-y-4 border border-[#2d1e16]">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display font-semibold text-base text-white">Fogareiros de Coleta FSA</h3>
                      <p className="text-xs text-white/50">Ecopontos oficiais e acadêmicos em Feira de Santana</p>
                    </div>
                    
                    {/* Material Filter */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-[#d4a359]/75 font-mono uppercase tracking-wider mr-1">Filtrar:</span>
                      {["Todos", "Celulares / Tablets", "Pilhas / Baterias", "Computadores / Notebooks", "Monitores / TVs", "Impressoras / Scanners"].map((mat) => (
                        <button
                          key={mat}
                          onClick={() => setSelectedMaterialFilter(mat)}
                          className={`text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 rounded border transition-all cursor-pointer ${
                            selectedMaterialFilter === mat 
                              ? "bg-[#d4a359] text-black border-[#ebd299] font-bold h-7 flex items-center" 
                              : "bg-black/45 text-white/70 border-[#2d1e16] hover:bg-[#2d1e16]/30 h-7 flex items-center"
                          }`}
                        >
                          {mat === "Todos" ? "Todos materiais" : mat.split(" / ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* INTERACTIVE VECTOR MAP */}
                  <div className="relative h-[320px] rounded-xl overflow-hidden map-container border border-[#2d1e16]">
                    {/* Grid Mesh lines style */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
                    
                    {/* Simulated Map Streets & Rivers background */}
                    <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
                      {/* Feira de Santana ringroads simulation */}
                      <circle cx="50%" cy="50%" r="90" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 2" />
                      <circle cx="50%" cy="50%" r="160" fill="none" stroke="white" strokeWidth="0.5" />
                      <path d="M 0,160 L 1000,160 M 500,0 L 500,500" stroke="white" strokeWidth="1" strokeDasharray="10 5" />
                      {/* River Subaé simulation */}
                      <path d="M -50,450 Q 200,420 400,470 T 1000,410" fill="none" stroke="#0ea5e9" strokeWidth="4" opacity="0.3" />
                      <text x="30" y="420" fill="sky-200" opacity="0.3" className="text-[10px] font-semibold font-mono">Nascentes de Subaé</text>
                      {/* Ring Road label */}
                      <text x="52%" y="15%" fill="white" opacity="0.2" className="text-[8px] tracking-widest uppercase font-mono">Contorno de Feira de Santana</text>
                    </svg>

                    {/* Map Markers for matching ecopoints */}
                    {filteredEcopoints.map((pt) => {
                      // Project lat/lng linearly to canvas coordinate percentages (lat centered around -12.26, lng around -38.95)
                      const mapWidthPct = 50 + (pt.longitude - (-38.955)) * 1400; 
                      const mapHeightPct = 50 - (pt.latitude - (-12.260)) * 1400; 

                      const isSelected = selectedEcopoint?.id === pt.id;

                      return (
                        <div
                          key={pt.id}
                          onClick={() => setSelectedEcopoint(pt)}
                          style={{
                            left: `${Math.max(8, Math.min(92, mapWidthPct))}%`,
                            top: `${Math.max(8, Math.min(92, mapHeightPct))}%`,
                          }}
                          className={`marker cursor-pointer ${isSelected ? "marker-selected scale-125" : "hover:scale-115"}`}
                          title={pt.nome}
                        >
                          {/* Pulse background on selection */}
                          {isSelected && (
                            <span className="absolute -inset-2 rounded-full bg-[#d4a359]/30 animate-ping"></span>
                          )}
                          
                          {/* Hover Tooltip name */}
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/90 border border-[#2d1e16] text-[9px] text-white px-2 py-0.5 rounded shadow-xl whitespace-nowrap opacity-0 hover:opacity-100 transition duration-150 pointer-events-none z-30">
                            {pt.nome}
                          </div>
                        </div>
                      );
                    })}

                    {/* Map Controls */}
                    <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-20">
                      <button onClick={() => alert("Zoom in (+)")} className="w-8 h-8 bg-[#090e0c] border border-[#2d1e16] hover:bg-white/10 rounded flex items-center justify-center font-bold font-mono text-white text-sm cursor-pointer">+</button>
                      <button onClick={() => alert("Zoom out (-)")} className="w-8 h-8 bg-[#090e0c] border border-[#2d1e16] hover:bg-white/10 rounded flex items-center justify-center font-bold font-mono text-white text-sm cursor-pointer">−</button>
                    </div>

                    {/* Quick helper badge */}
                    <div className="absolute top-3 left-3 bg-[#080c0a]/90 p-2.5 rounded border border-[#2d1e16] text-[10px] space-y-0.5 max-w-[200px] font-mono">
                      <p className="font-semibold text-[#d4a359] uppercase tracking-wider">Total: {filteredEcopoints.length} Fogueiras</p>
                      <p className="text-white/40 text-[9px]">Aproxime-se e interaja com os fogareiros de purificação.</p>
                    </div>
                  </div>

                  {/* Selected Ecopoint Details Cards */}
                  {selectedEcopoint && (
                    <div className="glass-dark p-4 rounded-xl border border-[#2d1e16] grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-8 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-black bg-[#d4a359] px-2.5 py-1 rounded font-mono uppercase tracking-widest leading-none">
                            {selectedEcopoint.regiao}
                          </span>
                          <h4 className="text-sm font-semibold text-white tracking-widest uppercase font-mono">{selectedEcopoint.nome}</h4>
                        </div>
                        
                        <p className="text-xs text-white/70">{selectedEcopoint.endereco}</p>
                        
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-white/45 font-mono uppercase tracking-wider">Atende:</span>
                          {selectedEcopoint.materiais_aceitos.map((mat, i) => (
                            <span key={i} className="text-[9px] bg-black/40 text-[#ebd7c3] border border-[#2d1e16]/30 px-2 py-0.5 rounded font-mono">
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-[#2d1e16]/40 pt-3 md:pt-0 md:pl-4 space-y-2 text-xs">
                        <div className="space-y-1">
                          <p className="text-[10px] text-white/40 flex items-center gap-1 uppercase tracking-wider font-mono">
                            <Clock className="w-3 h-3 text-[#d4a359]" /> Horário
                          </p>
                          <p className="font-medium text-white/90">{selectedEcopoint.horario}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[10px] text-white/40 flex items-center gap-1 uppercase tracking-wider font-mono">
                            <Phone className="w-3 h-3 text-[#d4a359]" /> Contato
                          </p>
                          <p className="font-mono text-white/80">{selectedEcopoint.telefone}</p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}







            {/* TAB 5: EDUCAÇÃO AMBIENTAL */}
            {activeTab === "education" && (
              <div className="space-y-4 animate-fade-in" id="education-tab">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  
                  {/* Left list of Articles */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="glass p-4 rounded-3xl border border-[#2d1e16]">
                      <h3 className="font-display font-semibold text-sm text-white uppercase tracking-widest">Compêndio das Almas</h3>
                      <p className="text-[11px] text-white/40 mb-4 px-0.5">Estude os pergaminhos sagrados da preservação</p>
                      
                      <div className="space-y-2.5">
                        {EDUCATION_ARTICLES.map((art) => {
                          const isSelected = selectedArticle?.id === art.id;
                          const hasRead = readArticles.includes(art.id);
                          return (
                            <div
                              key={art.id}
                              onClick={() => handleReadArticle(art)}
                              className={`p-3.5 rounded-xl cursor-pointer border text-left transition-all ${
                                isSelected 
                                  ? "bg-[#d4a359]/10 border-[#d4a359]/40" 
                                  : "bg-[#140d08]/45 border-[#2d1e16] hover:bg-[#1d140e]"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[9px] bg-black/45 text-white/50 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                                  {art.categoria}
                                </span>
                                {hasRead ? (
                                  <span className="text-[8px] text-[#d4a359] font-bold flex items-center gap-0.5 font-mono">
                                    LIDO [+10 pts] ✔
                                  </span>
                                ) : (
                                  <span className="text-[8px] text-white/30 font-semibold font-mono">NÃO LIDO</span>
                                )}
                              </div>
                              <h4 className="text-xs font-semibold text-white tracking-wide mt-1 uppercase font-mono">{art.titulo}</h4>
                              <p className="text-[10px] text-white/50 mt-1 line-clamp-2 font-sans">{art.resumo}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right expanded Reader */}
                  <div className="lg:col-span-7">
                    {selectedArticle ? (
                      <div className="glass p-5 rounded-3xl border border-[#2d1e16] space-y-4 text-white">
                        <div className="border-b border-[#2d1e16] pb-3">
                          <div className="flex justify-between items-center text-[10px] text-white/40 font-mono mb-1.5 uppercase tracking-wider">
                            <span>FONTE: {selectedArticle.fonte}</span>
                            <span>{selectedArticle.tempoLeitura}</span>
                          </div>
                          <h2 className="font-display font-semibold text-base md:text-lg text-white leading-snug uppercase tracking-widest">
                            {selectedArticle.titulo}
                          </h2>
                        </div>

                        {/* Normalized Content block */}
                        <div className="text-xs space-y-3.5 leading-relaxed text-white/80 font-sans max-h-[380px] overflow-y-auto pr-1">
                          {selectedArticle.conteudo.split("\n\n").map((p, idx) => {
                            if (p.startsWith("**") || p.includes("**")) {
                              const text = p.replace(/\*\*/g, "");
                              return (
                                <p key={idx} className="font-semibold text-white">
                                  {text}
                                </p>
                              );
                            }
                            return <p key={idx}>{p}</p>;
                          })}
                        </div>

                        <div className="bg-[#1a110a] border border-[#2d1e16] p-2.5 rounded text-center text-[10px] text-[#d4a359] font-mono">
                          🌱 <strong>Economia Circular:</strong> Evitar resíduos protege o lençol freático contra chorume de baterias oxidadas.
                        </div>
                      </div>
                    ) : (
                      <div className="glass-dark p-6 rounded-3xl flex flex-col items-center justify-center text-center border border-[#2d1e16] h-[300px]">
                        <BookOpen className="w-8 h-8 text-white/30" />
                        <p className="text-xs text-white/45 mt-2 font-mono">Escolha um dos artigos na biblioteca ao lado para ler e ganhar EcoPoints!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: QUIZ AMBIENTAL */}
            {activeTab === "quiz" && (
              <div className="space-y-4 animate-fade-in" id="quiz-tab">
                <div className="glass p-5 rounded-3xl border border-[#2d1e16] space-y-4 max-w-2xl mx-auto">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[#2d1e16] pb-3">
                    <div>
                      <h3 className="font-display font-semibold text-base text-white uppercase tracking-widest">Julgamento do Pergaminho</h3>
                      <p className="text-[11px] text-white/45">Responda com retidão para acumular pontos de prestígio</p>
                    </div>
                    <span className="text-[10px] bg-[#2d1e16] border border-[#d4a359]/30 text-[#d4a359] px-2 py-1 rounded font-mono font-semibold">
                      Questão {currentQuestionIndex + 1} de {QUIZ_QUESTIONS.length}
                    </span>
                  </div>

                  {!quizCompleted ? (
                    <div className="space-y-4">
                      
                      {/* Question box */}
                      <div className="p-4 bg-black/45 rounded border border-[#2d1e16]">
                        <h4 className="text-sm font-semibold text-white leading-relaxed font-sans">
                          {QUIZ_QUESTIONS[currentQuestionIndex].pergunta}
                        </h4>
                      </div>

                      {/* Alternatives choices */}
                      <div className="space-y-2">
                        {QUIZ_QUESTIONS[currentQuestionIndex].alternativas.map((alt, idx) => {
                          const isSelected = selectedOption === idx;
                          const isCorrectAns = idx === QUIZ_QUESTIONS[currentQuestionIndex].resposta_correta;
                          
                          let btnClass = "bg-[#140d08]/45 border-[#2d1e16] hover:bg-[#1d140e] text-white/90";
                          if (quizAnswered) {
                            if (isCorrectAns) {
                              btnClass = "bg-[#d4a359]/25 border-[#d4a359] text-[#ebd7c3] font-semibold";
                            } else if (isSelected) {
                              btnClass = "bg-[#991b1b]/20 border-[#f87171] text-rose-300 font-semibold";
                            } else {
                              btnClass = "opacity-45 border-[#2d1e16]/40 hover:none";
                            }
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => handleQuizAnswer(idx)}
                              disabled={quizAnswered}
                              className={`w-full text-left p-3.5 rounded text-xs border transition-all flex items-start gap-2 cursor-pointer ${btnClass}`}
                            >
                              <span className="w-5 h-5 bg-black/45 text-white/80 flex items-center justify-center rounded font-mono font-semibold shrink-0 text-[10px] border border-[#2d1e16]">
                                {idx === 0 ? "A" : idx === 1 ? "B" : "C"}
                              </span>
                              <span className="font-mono tracking-wide">{alt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Result Feedbacks */}
                      {quizAnswered && (
                        <div className="p-4 rounded border space-y-2 animate-fade-in text-xs bg-black/45 border-[#2d1e16]">
                          {quizCorrect ? (
                            <p className="font-bold text-[#d4a359] flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
                              <span>✨</span> CORRETO! +20 EcoPoints ganhos!
                            </p>
                          ) : (
                            <p className="font-bold text-rose-400 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
                              <span>✕</span> INCORRETO! Aquisição necessária.
                            </p>
                          )}
                          <p className="text-white/70 leading-relaxed font-sans text-xs">
                            {QUIZ_QUESTIONS[currentQuestionIndex].explicacao}
                          </p>

                          <button
                            onClick={handleNextQuiz}
                            className="w-full h-10 bg-[#4a1010] hover:bg-[#6b1f1f] text-white font-extrabold text-xs rounded border border-[#6b1f1f] transition mt-2 cursor-pointer font-mono uppercase tracking-widest"
                          >
                            {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? "Próxima Pergunta ➔" : "Finalizar Julgamento ➔"}
                          </button>
                        </div>
                      )}

                    </div>
                  ) : (
                    // Quiz End Summary State
                    <div className="text-center py-6 space-y-4 animate-fade-in text-white">
                      <div className="w-14 h-14 bg-amber-500/10 text-amber-300 rounded-full flex items-center justify-center mx-auto border border-amber-400/20">
                        <Award className="w-8 h-8" />
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="font-display font-semibold text-base uppercase tracking-widest">Julgamento Concluído! 🎉</h4>
                        <p className="text-xs text-white/50 max-w-sm mx-auto font-sans leading-relaxed">
                          Sua conscientização ecológica foi atualizada com sucesso no altar do conhecimento. Você demonstrou excelente retidão e virtude.
                        </p>
                      </div>

                      <div className="bg-[#2d1e16]/50 border border-[#2d1e16] p-3 rounded max-w-sm mx-auto text-center space-y-0.5 font-mono">
                        <span className="text-[10px] text-[#ebd7c3] font-bold block uppercase tracking-wider">Moedas de prestígio obtidas</span>
                        <span className="text-xl font-bold text-[#d4a359]">+{quizPointsEarned} EcoPoints</span>
                      </div>

                      <div className="flex items-center gap-2 justify-center max-w-sm mx-auto">
                        <button
                          onClick={handleRestartQuiz}
                          className="flex-1 h-9 bg-black/40 hover:bg-[#1d140e] text-white border border-[#2d1e16] rounded font-mono text-xs uppercase tracking-wider transition cursor-pointer"
                        >
                          Jogar Novamente
                        </button>
                        <button
                          onClick={() => setActiveTab("dashboard")}
                          className="flex-1 h-9 bg-[#4a1010] hover:bg-[#6b1f1f] text-white font-bold text-xs rounded border border-[#6b1f1f] transition cursor-pointer font-mono uppercase tracking-widest shadow"
                        >
                          Voltar ao Painel
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>

        </main>
      </div>

      {/* FOOTER METADATA */}
      <footer className="mt-5 border-t border-[#2d1e16] pt-3 text-center text-[10px] text-white/30 font-mono flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl w-full mx-auto">
        <p>© 2026 RecySouls • Logística Reversa de Almas Metálicas</p>
        <p>Forjado na chama do Conclave Ecológico • FSA & Semiárido • Código Aberto Sólido</p>
      </footer>
    </div>
  );
}
