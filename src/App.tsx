import React, { useState, useEffect } from 'react';
import { UserProfile, RecommendationItem, SavedSession } from './types';
import ProfileForm from './components/ProfileForm';
import { 
  Sparkles, 
  Film, 
  Book, 
  Music, 
  Play, 
  Sliders, 
  Save, 
  Check, 
  RefreshCw, 
  History, 
  ExternalLink, 
  Search, 
  ArrowRight, 
  X, 
  HelpCircle,
  AlertCircle,
  Award,
  ChevronRight,
  Trash2,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Pristine pre-populated default database of MatchMuse masterpieces
const DEFAULT_CULTURAL_ITEMS: RecommendationItem[] = [
  {
    id: "default-movie-1",
    title: "Blade Runner 2049",
    creator: "Denis Villeneuve",
    category: "movie",
    genres: ["Sci-Fi", "Drame", "Thriller"],
    year: "2017",
    description: "Un flic de Los Angeles (K) déterre un secret oublié depuis longtemps qui pourrait plonger ce qui reste de la société dans une obscurité profonde et irréversible.",
    reason: "La direction artistique magistrale de Roger Deakins s'harmonise parfaitement avec les atmosphères contemplatives, hypnotiques et nimbées d'ambiguïté existentielles.",
    matchScore: 98,
    tags: ["Néo-Noir", "Mélancolique", "Hypnotique"]
  },
  {
    id: "default-movie-2",
    title: "Interstellar",
    creator: "Christopher Nolan",
    category: "movie",
    genres: ["Sci-Fi", "Drame", "Aventure"],
    year: "2014",
    description: "Une équipe d'explorateurs voyage au-delà de notre galaxie à travers un trou de ver pour tenter de trouver un nouvel avenir et sauver l'humanité.",
    reason: "Une odyssée spatiale bouleversante où la rigueur physique rencontre la pure émotion intime familiale, portée par la majesté des orgues de Hans Zimmer.",
    matchScore: 97,
    tags: ["Cosmique", "Émotionnel", "Métaphysique"]
  },
  {
    id: "default-movie-3",
    title: "Your Name",
    creator: "Makoto Shinkai",
    category: "movie",
    genres: ["Romance", "Anime", "Drame"],
    year: "2016",
    description: "Deux adolescents vivant l'un à Tokyo et l'autre au fond des montagnes découvrent qu'ils échangent périodiquement de corps à travers l'espace et le temps.",
    reason: "Une poésie esthétique absolue mêlant la sensibilité romantique à un sentiment cosmique de nostalgie et de destinée tragique.",
    matchScore: 94,
    tags: ["Poétique", "Lyrique", "Destinée"]
  },
  {
    id: "default-movie-4",
    title: "Arrival (Premier Contact)",
    creator: "Denis Villeneuve",
    category: "movie",
    genres: ["Sci-Fi", "Mystère", "Drame"],
    year: "2016",
    description: "Une linguiste est recrutée par l'armée pour traduire les communications d'extra-terrestres arrivés à bord de vaisseaux monolithiques immobiles.",
    reason: "Une étude émouvante sur la perception du temps, le langage comme prisme d'évolution et l'empathie face à l'inconnu métaphysique.",
    matchScore: 95,
    tags: ["Hypnotique", "Linguistique", "Brillant"]
  },
  {
    id: "default-book-1",
    title: "L'Étranger",
    creator: "Albert Camus",
    category: "book",
    genres: ["Philosophique", "Classique"],
    year: "1942",
    description: "Dans une Algérie écrasée de chaleur, un employé de bureau commet un meurtre absurde et assiste impunément à son propre procès criminel.",
    reason: "La quintessence de l'absurde camusien, où la prose minimaliste installe un sentiment de détachement absolu face à la comédie sociale.",
    matchScore: 93,
    tags: ["Existentialisme", "Minimaliste", "Absurde"]
  },
  {
    id: "default-book-2",
    title: "Dune",
    creator: "Frank Herbert",
    category: "book",
    genres: ["Sci-Fi", "Légende", "Politique"],
    year: "1965",
    description: "Paul Atréides doit mener les nomades indigènes d'Arrakis à la révolte pour reconquérir le contrôle de la planète-désert et son Épice indispensable.",
    reason: "Une fresque grandiose et écologique où la géopolitique féodale rencontre les prophéties mystiques sous la poésie implacable des tempêtes de sable.",
    matchScore: 96,
    tags: ["Épique", "Écologie", "Geopolitique"]
  },
  {
    id: "default-book-3",
    title: "Les Fleurs du Mal",
    creator: "Charles Baudelaire",
    category: "book",
    genres: ["Poésie", "Classique"],
    year: "1857",
    description: "Une collection de vers lyriques explorant l'ennui, la luxure urbaine parisienne, la mort vénéneuse et la mélancolie sublime.",
    reason: "Un chef-d'œuvre de la poésie symboliste hanté par l'idéal impossible et la beauté trouble des ténèbres de l'âme humaine.",
    matchScore: 92,
    tags: ["Spleen", "Esthétisme", "Nocturne"]
  },
  {
    id: "default-book-4",
    title: "La Possibilité d'une Île",
    creator: "Michel Houellebecq",
    category: "book",
    genres: ["Roman", "Sci-Fi", "Philosophie"],
    year: "2005",
    description: "À travers les mémoires de clones successifs vivant dans un futur stérile, se retrace l'histoire tragique de Daniel 1er dans le monde moderne.",
    reason: "Une réflexion glaciale et touchante sur le déclin des sentiments humains, l'immortalité technologique sans âme et la quête éternelle de l'amour.",
    matchScore: 91,
    tags: ["Mélancolie", "Visionnaire", "Introspectif"]
  },
  {
    id: "default-music-1",
    title: "Sleep",
    creator: "Max Richter",
    category: "music",
    genres: ["Classique moderne", "Ambient"],
    year: "2015",
    description: "Une œuvre hypnotique et majestueuse de huit heures combinant piano acoustique, cordes vibrantes et synthétiseurs analogues.",
    reason: "Conçu scientifiquement pour dialoguer avec les cycles du sommeil, ce monument sonore berce les esprits fatigués pour les élever vers des contrées de pure rêverie calme.",
    matchScore: 99,
    tags: ["Thérapeutique", "Calme", "Intemporel"]
  },
  {
    id: "default-music-2",
    title: "Solitude",
    creator: "Hammock",
    category: "music",
    genres: ["Ambient", "Post-Rock"],
    year: "2017",
    description: "Des lofis de guitares saturés de réverbération infinie et d'orchestrations minimalistes de cordes suspendues.",
    reason: "Une texture musicale splendide idéale pour s'isoler du chaos quotidien, peignant des paysages de brumes d'hiver et d'introspection.",
    matchScore: 95,
    tags: ["Planant", "Nostalgique", "Lumineux"]
  },
  {
    id: "default-music-3",
    title: "Nuvole Bianche",
    creator: "Ludovico Einaudi",
    category: "music",
    genres: ["Classique moderne", "Piano"],
    year: "2004",
    description: "Un thème de piano minimaliste qui enfle doucement vers une apogée mélodique déchirante avant de s'effacer en silence.",
    reason: "Un miracle d'émotion sobre capable de suspendre le temps et de faire jaillir des réminiscences douces-amères de sentiments enfouis.",
    matchScore: 96,
    tags: ["Épuré", "Mélancolique", "Vibrant"]
  }
];

export default function App() {
  const [activePage, setActivePage] = useState<'home' | 'movies' | 'literature' | 'music'>('home');
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [userProfileSummary, setUserProfileSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Custom states for form toggling and saved sessions (one per category page)
  const [showMovieCuration, setShowMovieCuration] = useState<boolean>(false);
  const [showBookCuration, setShowBookCuration] = useState<boolean>(false);
  const [showMusicCuration, setShowMusicCuration] = useState<boolean>(false);
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>("session-démo");
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('français');

  // Hero custom selector to pick a highlighted masterpiece dynamically
  const [heroIndex, setHeroIndex] = useState<number>(1); // Interstellar by default
  const [activeHero, setActiveHero] = useState<RecommendationItem>(DEFAULT_CULTURAL_ITEMS[1]);

  // Expand states for detailed review cards
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  // Update hero when recommendations or database change
  useEffect(() => {
    const listToPick = recommendations.length > 0 ? recommendations : DEFAULT_CULTURAL_ITEMS;
    if (listToPick.length > heroIndex) {
      setActiveHero(listToPick[heroIndex]);
    } else if (listToPick.length > 0) {
      setActiveHero(listToPick[0]);
    }
  }, [recommendations, heroIndex]);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
        
        // Load demo or first history entry
        const demo = data.find((s: any) => s.id === "session-démo");
        if (demo && recommendations.length === 0) {
          setRecommendations(demo.recommendations);
          setUserProfileSummary(demo.userProfileSummary);
          setCurrentProfile(demo.profile);
          setLanguage(demo.profile.language || 'français');
        }
      }
    } catch (err) {
      console.error("Impossible de récupérer l'historique", err);
    }
  };

  const handleGenerateRecommendations = async (profile: UserProfile, category: 'movie' | 'book' | 'music') => {
    setIsLoading(true);
    setError(null);
    setIsSaved(false);
    setLanguage(profile.language);
    setCurrentProfile(profile);

    try {
      const response = await fetch('/api/recommendations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, category }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || errData.details || "Erreur de communication avec le serveur");
      }

      const data = await response.json();
      const recs = data.recommendations || [];
      
      setRecommendations(prev => {
        const currentRecs = prev.length > 0 ? prev : DEFAULT_CULTURAL_ITEMS;
        const filtered = currentRecs.filter(item => item.category !== category);
        const updated = [...filtered, ...recs];
        return updated;
      });
      
      setUserProfileSummary(data.userProfileSummary || '');
      setActiveSessionId(null); // New live generation
      setShowMovieCuration(false); // Smooth roll-up on success
      setShowBookCuration(false);
      setShowMusicCuration(false);
      
      // Auto highlight the first newly generated suggestion of that category
      setTimeout(() => {
        setRecommendations(prev => {
          const listToPick = prev.length > 0 ? prev : DEFAULT_CULTURAL_ITEMS;
          const indexInList = listToPick.findIndex(x => x.category === category);
          if (indexInList !== -1) {
            setHeroIndex(indexInList);
          } else {
            setHeroIndex(0);
          }
          return prev;
        });
      }, 100);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Une erreur réseau est survenue lors de l'accès au modèle d'analyse.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSession = async () => {
    if (!currentProfile || recommendations.length === 0 || isLoading) return;

    try {
      const response = await fetch('/api/sessions/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: currentProfile,
          recommendations,
          userProfileSummary
        }),
      });

      if (response.ok) {
        const newSession = await response.json();
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Impossible de sauvegarder la session");
      }
    } catch (err) {
      setError("Erreur technique de connexion au serveur.");
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      const response = await fetch(`/api/sessions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSessions(prev => prev.filter(s => s.id !== id));
        if (activeSessionId === id) {
          setActiveSessionId(null);
        }
      }
    } catch (err) {
      console.error("Erreur de suppression:", err);
    }
  };

  const handleSelectSession = (session: SavedSession) => {
    setRecommendations(session.recommendations);
    setUserProfileSummary(session.userProfileSummary);
    setCurrentProfile(session.profile);
    setLanguage(session.profile.language || 'français');
    setActiveSessionId(session.id);
    
    // Auto shift hero index to showcase results
    setHeroIndex(0);
    
    // Scroll to views smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter recommendations based on active page or fallbacks
  const currentMediaList = recommendations.length > 0 ? recommendations : DEFAULT_CULTURAL_ITEMS;
  
  const activeMovies = currentMediaList.filter(item => item.category === 'movie');
  const activeBooks = currentMediaList.filter(item => item.category === 'book');
  const activeMusic = currentMediaList.filter(item => item.category === 'music');

  const triggerSearch = (title: string, creator: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(title + " " + creator)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#141414] text-zinc-100 flex flex-col justify-between selection:bg-[#E50914] selection:text-white font-sans">
      
      {/* NETFLIX MASTER STYLED NAVIGATION HEADER */}
      <header className="border-b border-zinc-900 bg-[#141414]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          
          {/* Logo Brand "MatchMuse" */}
          <div className="flex items-center gap-6">
            <span 
              onClick={() => setActivePage('home')}
              className="text-2xl font-extrabold uppercase font-display tracking-tighter text-[#E50914] cursor-pointer active:scale-95 transition-all"
            >
              MatchMuse
            </span>
            
            {/* Header Links */}
            <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-zinc-400">
              <button 
                onClick={() => setActivePage('home')}
                className={`transition-colors cursor-pointer ${activePage === 'home' ? 'text-white font-bold' : 'hover:text-zinc-350'}`}
              >
                Accueil
              </button>
              <button 
                onClick={() => setActivePage('movies')}
                className={`transition-colors cursor-pointer ${activePage === 'movies' ? 'text-white font-bold' : 'hover:text-zinc-350'}`}
              >
                Cinéma
              </button>
              <button 
                onClick={() => setActivePage('literature')}
                className={`transition-colors cursor-pointer ${activePage === 'literature' ? 'text-white font-bold' : 'hover:text-zinc-350'}`}
              >
                Littérature
              </button>
              <button 
                onClick={() => setActivePage('music')}
                className={`transition-colors cursor-pointer ${activePage === 'music' ? 'text-white font-bold' : 'hover:text-zinc-350'}`}
              >
                Musique
              </button>
            </nav>
          </div>

          {/* Action tuning control button & Connected indicator */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (activePage === 'movies') {
                  const nextVal = !showMovieCuration;
                  setShowMovieCuration(nextVal);
                  if (nextVal) {
                    setTimeout(() => {
                      document.getElementById("profile-config-form")?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                } else if (activePage === 'literature') {
                  const nextVal = !showBookCuration;
                  setShowBookCuration(nextVal);
                  if (nextVal) {
                    setTimeout(() => {
                      document.getElementById("profile-config-form")?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                } else if (activePage === 'music') {
                  const nextVal = !showMusicCuration;
                  setShowMusicCuration(nextVal);
                  if (nextVal) {
                    setTimeout(() => {
                      document.getElementById("profile-config-form")?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                } else {
                  // Home page: transition to movies page & open tuner
                  setActivePage('movies');
                  setShowMovieCuration(true);
                  setTimeout(() => {
                    document.getElementById("profile-config-form")?.scrollIntoView({ behavior: 'smooth' });
                  }, 200);
                }
              }}
              className="px-4 py-1.5 bg-[#E50914] hover:bg-[#b00710] text-white text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-[#E50914]/10"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Curation IA</span>
            </button>

            <span className="h-4 w-[1px] bg-zinc-800" />

            <div className="hidden sm:flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-900 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" />
              Direct-Sync
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE PAGE ACCORDION */}
      <div className="md:hidden bg-zinc-950/60 py-2.5 px-6 border-b border-zinc-900 flex justify-around text-xs text-zinc-400 font-semibold tracking-wider uppercase">
        <button className={activePage === 'home' ? 'text-white font-bold border-b border-[#E50914] pb-0.5' : ''} onClick={() => setActivePage('home')}>Accueil</button>
        <button className={activePage === 'movies' ? 'text-white font-bold border-b border-[#E50914] pb-0.5' : ''} onClick={() => setActivePage('movies')}>Cinéma</button>
        <button className={activePage === 'literature' ? 'text-white font-bold border-b border-[#E50914] pb-0.5' : ''} onClick={() => setActivePage('literature')}>Littérature</button>
        <button className={activePage === 'music' ? 'text-white font-bold border-b border-[#E50914] pb-0.5' : ''} onClick={() => setActivePage('music')}>Musique</button>
      </div>

      {/* RENDERED ROUTED PAGES */}
      <div className="flex-1 w-full flex flex-col justify-start">
        
        {/* PAGE 1: HOME PAGE */}
        {activePage === 'home' && (
          <div className="w-full flex flex-col justify-start pb-12">
            
            {/* NETFLIX ATMOSPHERIC HERO BANNER */}
            <div className="relative w-full py-20 sm:py-32 px-6 bg-radial from-zinc-800/40 via-zinc-900/90 to-[#141414] border-b border-zinc-900/70 overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 bg-gradient-to-l from-[#E50914]/5 to-transparent pointer-events-none" />
              
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                <div className="md:col-span-8 space-y-5">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#E50914] text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-widest uppercase font-mono shadow-sm">
                      Recommandé à {activeHero.matchScore}%
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-widest font-bold">
                      // {activeHero.category === 'movie' ? 'Cinéma d’Auteur' : activeHero.category === 'book' ? 'Littérature Culte' : 'Symphonie Acoustique'}
                    </span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none font-display">
                    {activeHero.title}
                  </h1>
                  
                  <p className="text-lg text-zinc-300 font-semibold italic">
                    Un chef-d'œuvre de <span className="text-zinc-100 font-bold not-italic">{activeHero.creator}</span> ({activeHero.year})
                  </p>

                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-2xl font-sans font-light">
                    {activeHero.description}
                  </p>

                  {/* Synesthesia reasons */}
                  <div className="p-4 bg-black/60 rounded-lg border border-zinc-800 backdrop-blur-md max-w-2xl">
                    <p className="text-zinc-350 text-xs leading-relaxed">
                      <strong className="text-white uppercase tracking-wider font-mono text-[10px] block mb-1 font-bold text-[#E50914]">Pourquoi vous allez vibrer :</strong>
                      "{activeHero.reason}"
                    </p>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button 
                      onClick={() => triggerSearch(activeHero.title, activeHero.creator)}
                      className="px-6 py-2.5 bg-[#E50914] hover:bg-[#b00710] text-white text-xs font-bold uppercase tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Explorer l'Œuvre
                    </button>
                    
                    <button 
                      onClick={() => {
                        if (activeHero.category === 'movie') {
                          setActivePage('movies');
                          setShowMovieCuration(true);
                        } else if (activeHero.category === 'book') {
                          setActivePage('literature');
                          setShowBookCuration(true);
                        } else {
                          setActivePage('music');
                          setShowMusicCuration(true);
                        }
                        setTimeout(() => {
                          document.getElementById("profile-config-form")?.scrollIntoView({ behavior: 'smooth' });
                        }, 250);
                      }}
                      className="px-6 py-2.5 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-250 hover:text-white text-xs font-bold uppercase tracking-widest rounded border border-zinc-750 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-[#E50914]" />
                      Personnaliser Curation
                    </button>
                  </div>
                </div>

                {/* Cover Art Visual Representation */}
                <div className="md:col-span-4 hidden md:flex justify-center">
                  <div className="w-[240px] h-[340px] rounded-xl border border-zinc-800 bg-zinc-950/90 shadow-2xl overflow-hidden relative group p-6 flex flex-col justify-between">
                    <div className="absolute inset-0 bg-radial from-[#E50914]/15 to-transparent pointer-events-none" />
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-mono uppercase text-[#E50914] font-extrabold tracking-wider bg-black/50 px-2 py-0.5 rounded">
                        {activeHero.category}
                      </span>
                      <span className="text-xs font-bold text-zinc-500">
                        {activeHero.year}
                      </span>
                    </div>

                    <div className="text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-2 text-zinc-350">
                        {activeHero.category === 'movie' ? <Film className="w-5 h-5 text-[#E50914]" /> : activeHero.category === 'book' ? <Book className="w-5 h-5 text-[#E50914]" /> : <Music className="w-5 h-5 text-[#E50914]" />}
                      </div>
                      <h4 className="text-md font-bold text-white line-clamp-2 uppercase font-display">
                        {activeHero.title}
                      </h4>
                      <p className="text-xs text-[#E50914] font-bold">
                        {activeHero.creator}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 justify-center">
                      {(activeHero.tags || []).map(t => (
                        <span key={t} className="text-[8px] font-mono uppercase bg-black/60 text-zinc-400 px-1.5 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Slider Controls for Hero Selection */}
              <div className="max-w-7xl mx-auto flex items-center justify-start gap-4 mt-12 sm:mt-16 text-xs text-zinc-400">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">// Changer de Vedette :</span>
                <div className="flex gap-2">
                  {currentMediaList.slice(0, 5).map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setHeroIndex(idx);
                        setExpandedCardId(null);
                      }}
                      className={`px-3 py-1 bg-zinc-900 border transition-all text-[11px] font-bold uppercase rounded cursor-pointer ${heroIndex === idx ? 'bg-[#E50914] text-white border-[#E50914]' : 'text-zinc-400 border-zinc-800 hover:border-zinc-700'}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* ERROR CARD IF EXISTS */}
            {error && (
              <div className="max-w-7xl mx-auto w-full px-6 mt-6">
                <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 flex gap-3 items-start">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[11px] font-bold text-rose-400 uppercase tracking-wider font-mono">Erreur d'analyse sémantique</h4>
                    <p className="text-xs text-zinc-400 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}



            {/* SAVED USER HISTORY ("Continuer de regarder" style list for custom watching presets) */}
            {sessions.length > 0 && (
              <div className="max-w-7xl mx-auto w-full px-6 mt-10">
                <div className="flex items-center gap-2 mb-4">
                  <History className="w-4.5 h-4.5 text-[#E50914]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white font-display">
                    Reprendre vos Curations (Historique MatchMuse)
                  </h3>
                  <span className="text-[10px] text-zinc-500 font-mono">({sessions.length} profils)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-zinc-950/40 p-4 rounded-xl border border-zinc-900">
                  {sessions.slice(0, 8).map((session, i) => {
                    const isSelected = activeSessionId === session.id;
                    return (
                      <div
                        key={session.id}
                        onClick={() => handleSelectSession(session)}
                        className={`p-3 rounded-lg border transition-all text-left relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                          isSelected 
                            ? 'bg-[#E50914]/5 border-[#E50914] shadow-sm' 
                            : 'bg-[#181818] border-zinc-800 hover:border-zinc-700 hover:bg-[#202020]'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-1">
                          <span className="text-[11px] font-bold text-zinc-200 truncate font-display">
                            🔥 {session.profile.mood}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSession(session.id);
                            }}
                            className="text-zinc-500 hover:text-rose-500 p-0.5 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <p className="text-[10px] text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
                          {session.profile.preferencesText || "Curation personnalisée."}
                        </p>

                        <div className="flex items-center justify-between border-t border-zinc-850 mt-3 pt-2 text-[8px] text-zinc-500 font-mono uppercase">
                          <span>
                            {new Date(session.timestamp).toLocaleDateString()}
                          </span>
                          <span className="text-[#E50914] font-extrabold flex items-center gap-0.5">
                            Restaurer <ChevronRight className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* INTRODUCTORY DIAGNOSIS BANNER IF GENERATED */}
            {userProfileSummary && (
              <div className="max-w-7xl mx-auto w-full px-6 mt-10">
                <div className="bg-gradient-to-br from-[#181818] to-zinc-950 border border-zinc-800 p-6 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Award className="w-48 h-48 text-[#E50914]" />
                  </div>
                  <div className="flex gap-4 items-start relative z-10">
                    <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 text-[#E50914]">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase mb-1">
                        // SENS DE CURATION ARTISTIQUE ACTIF
                      </h3>
                      <p className="text-sm text-zinc-200 leading-relaxed italic font-light font-sans">
                        "{userProfileSummary}"
                      </p>
                      
                      {/* Save action button */}
                      {recommendations.length > 0 && currentProfile && (
                        <div className="mt-3.5 flex items-center gap-3">
                          <button
                            onClick={handleSaveSession}
                            className={`py-1.5 px-3 rounded text-[10px] uppercase tracking-wider font-extrabold cursor-pointer border flex items-center gap-1.5 transition-all ${
                              isSaved 
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
                                : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-850 text-zinc-300 hover:text-white'
                            }`}
                          >
                            {isSaved ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                Profil Sauvegardé dans votre historique
                              </>
                            ) : (
                              <>
                                <Save className="w-3.5 h-3.5 text-[#E50914]" />
                                Enregistrer ce profil de curation
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HOME PAGE MAIN HORIZONTAL SHOWCASE ROWS */}
            <div className="max-w-7xl mx-auto w-full px-6 mt-12 space-y-12">
              
              {/* ROW 1: CINEMA ROW */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold tracking-tight text-white font-display flex items-center gap-2">
                    <Film className="w-5 h-5 text-[#E50914]" />
                    Cinéma d'Affinité
                  </h3>
                  <button 
                    onClick={() => setActivePage('movies')}
                    className="text-xs font-bold text-[#E50914] hover:underline flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                  >
                    Tout voir <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {activeMovies.slice(0, 4).map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => {
                        setExpandedCardId(expandedCardId === item.id ? null : item.id);
                        // Auto highlight in hero as well
                        const idxInFull = currentMediaList.findIndex(x => x.id === item.id);
                        if (idxInFull !== -1) setHeroIndex(idxInFull);
                      }}
                      className="bg-[#181818] border border-zinc-800 hover:border-[#E50914]/60 rounded-lg p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] cursor-pointer group hover:shadow-2xl"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-1 pb-2 border-b border-zinc-850">
                          <span className="text-[10px] font-bold text-[#E50914] uppercase tracking-wider font-mono">
                            {item.matchScore}% affinity
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {item.year}
                          </span>
                        </div>
                        
                        <h4 className="text-md font-bold text-white mt-3 font-display group-hover:text-[#E50914] transition-colors leading-snug">
                          {item.title}
                        </h4>
                        
                        <p className="text-xs text-zinc-400 mt-1 font-semibold font-mono">
                          {item.creator}
                        </p>

                        <p className="text-xs text-zinc-400 line-clamp-3 mt-3 leading-relaxed font-sans font-light">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-850">
                        <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
                          {item.genres.slice(0, 2).join(' • ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ROW 2: BOOKS ROW */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold tracking-tight text-white font-display flex items-center gap-2">
                    <Book className="w-5 h-5 text-[#E50914]" />
                    Lecture Recommandée
                  </h3>
                  <button 
                    onClick={() => setActivePage('literature')}
                    className="text-xs font-bold text-[#E50914] hover:underline flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                  >
                    Tout voir <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {activeBooks.slice(0, 4).map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => {
                        setExpandedCardId(expandedCardId === item.id ? null : item.id);
                        const idxInFull = currentMediaList.findIndex(x => x.id === item.id);
                        if (idxInFull !== -1) setHeroIndex(idxInFull);
                      }}
                      className="bg-[#181818] border border-zinc-800 hover:border-[#E50914]/60 rounded-lg p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] cursor-pointer group hover:shadow-2xl"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-1 pb-2 border-b border-zinc-850">
                          <span className="text-[10px] font-bold text-[#E50914] uppercase tracking-wider font-mono">
                            {item.matchScore}% affinity
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {item.year}
                          </span>
                        </div>
                        
                        <h4 className="text-md font-bold text-white mt-3 font-display group-hover:text-[#E50914] transition-colors leading-snug">
                          {item.title}
                        </h4>
                        
                        <p className="text-xs text-zinc-400 mt-1 font-semibold font-mono">
                          {item.creator}
                        </p>

                        <p className="text-xs text-zinc-400 line-clamp-3 mt-3 leading-relaxed font-sans font-light">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-850">
                        <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
                          {item.genres.slice(0, 2).join(' • ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ROW 3: MUSIC ROW */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold tracking-tight text-white font-display flex items-center gap-2">
                    <Music className="w-5 h-5 text-[#E50914]" />
                    Vibrations Sonores Suggerées
                  </h3>
                  <button 
                    onClick={() => setActivePage('music')}
                    className="text-xs font-bold text-[#E50914] hover:underline flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                  >
                    Tout voir <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {activeMusic.slice(0, 4).map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => {
                        setExpandedCardId(expandedCardId === item.id ? null : item.id);
                        const idxInFull = currentMediaList.findIndex(x => x.id === item.id);
                        if (idxInFull !== -1) setHeroIndex(idxInFull);
                      }}
                      className="bg-[#181818] border border-zinc-800 hover:border-[#E50914]/60 rounded-lg p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] cursor-pointer group hover:shadow-2xl"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-1 pb-2 border-b border-zinc-850">
                          <span className="text-[10px] font-bold text-[#E50914] uppercase tracking-wider font-mono">
                            {item.matchScore}% affinity
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {item.year}
                          </span>
                        </div>
                        
                        <h4 className="text-md font-bold text-white mt-3 font-display group-hover:text-[#E50914] transition-colors leading-snug">
                          {item.title}
                        </h4>
                        
                        <p className="text-xs text-zinc-400 mt-1 font-semibold font-mono">
                          {item.creator}
                        </p>

                        <p className="text-xs text-zinc-400 line-clamp-3 mt-3 leading-relaxed font-sans font-light">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-850">
                        <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
                          {item.genres.slice(0, 2).join(' • ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* PAGE 2: MOVIES SUGGESTIONS PAGE */}
        {activePage === 'movies' && (
          <div className="max-w-7xl mx-auto w-full p-6 space-y-8 min-h-[70vh]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">// Curation Cinéma</div>
                <h2 className="text-3xl font-extrabold text-white font-display flex items-center gap-3">
                  <Film className="w-8 h-8 text-[#E50914]" />
                  Cinéma d'Affinité MatchMuse
                </h2>
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed max-w-2xl font-sans font-light">
                  Ces films d'auteurs et de science-fiction partagent une résonance sémantique exacte avec vos humeurs. De la direction photographique à la dramaturgie sonore.
                </p>
              </div>
              <button
                onClick={() => setShowMovieCuration(!showMovieCuration)}
                className="px-5 py-2.5 bg-[#E50914] hover:bg-[#b00710] text-white text-xs font-bold uppercase tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-2 self-start sm:self-center shadow-lg"
              >
                <Sliders className="w-4 h-4" />
                {showMovieCuration ? "Masquer les réglages IA" : "Ajuster le Curateur IA"}
              </button>
            </div>

            <AnimatePresence>
              {showMovieCuration && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <ProfileForm 
                    onSubmit={handleGenerateRecommendations} 
                    isLoading={isLoading} 
                    initialCategory="movie"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeMovies.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-[#181818] border border-zinc-800 hover:border-[#E50914]/80 transition-all rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group shadow-lg duration-300"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                    <Film className="w-16 h-16 text-[#E50914]" />
                  </div>

                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-mono tracking-widest text-[#E50914] bg-[#E50914]/10 border border-[#E50914]/30 px-2 py-0.5 rounded font-bold uppercase">
                        {item.matchScore}% affinity
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono leading-relaxed flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.year}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white leading-tight font-display group-hover:text-[#E50914] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 font-mono font-bold">
                      {item.creator}
                    </p>

                    <p className="text-xs text-zinc-300 mt-4 leading-relaxed font-sans font-light">
                      {item.description}
                    </p>

                    {/* Expandable note on affinity reasons */}
                    <div className="mt-4 p-3 bg-black/40 rounded border border-zinc-900">
                      <h4 className="text-[9px] font-mono font-bold uppercase text-[#E50914] mb-1.5">// Rapport Sémantique & Synesthésie :</h4>
                      <p className="text-xs text-zinc-400 italic">
                        "{item.reason}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-850 flex justify-between items-center">
                    <button
                      onClick={() => triggerSearch(item.title, item.creator)}
                      className="text-[10px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 uppercase"
                    >
                      <Search className="w-3 h-3 text-[#E50914]" />
                      Rechercher
                      <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                    </button>
                    <span className="text-[9px] font-mono text-zinc-500">
                      {item.genres.join(' • ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 3: LITERATURE SUGGESTIONS PAGE */}
        {activePage === 'literature' && (
          <div className="max-w-7xl mx-auto w-full p-6 space-y-8 min-h-[70vh]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">// Curation Littérature</div>
                <h2 className="text-3xl font-extrabold text-white font-display flex items-center gap-3">
                  <Book className="w-8 h-8 text-emerald-500" />
                  Grille de Lecture Recommandée
                </h2>
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed max-w-2xl font-sans font-light">
                  D'Albert Camus à Frank Herbert, une collection d'œuvres littéraires classiques ou d'anticipation choisies pour l'intensité philosophique de leur univers.
                </p>
              </div>
              <button
                onClick={() => setShowBookCuration(!showBookCuration)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-2 self-start sm:self-center shadow-lg"
              >
                <Sliders className="w-4 h-4" />
                {showBookCuration ? "Masquer les réglages IA" : "Ajuster le Curateur IA"}
              </button>
            </div>

            <AnimatePresence>
              {showBookCuration && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <ProfileForm 
                    onSubmit={handleGenerateRecommendations} 
                    isLoading={isLoading} 
                    initialCategory="book"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeBooks.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-[#181818] border border-zinc-800 hover:border-[#E50914]/80 transition-all rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group shadow-lg duration-300"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                    <Book className="w-16 h-16 text-[#E50914]" />
                  </div>

                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-mono tracking-widest text-[#E50914] bg-[#E50914]/10 border border-[#E50914]/30 px-2 py-0.5 rounded font-bold uppercase">
                        {item.matchScore}% affinity
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono leading-relaxed flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.year}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white leading-tight font-display group-hover:text-[#E50914] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 font-mono font-bold">
                      {item.creator}
                    </p>

                    <p className="text-xs text-zinc-300 mt-4 leading-relaxed font-sans font-light">
                      {item.description}
                    </p>

                    {/* Expandable note on affinity reasons */}
                    <div className="mt-4 p-3 bg-black/40 rounded border border-zinc-900">
                      <h4 className="text-[9px] font-mono font-bold uppercase text-[#E50914] mb-1.5">// Rapport Sémantique & Synesthésie :</h4>
                      <p className="text-xs text-zinc-400 italic">
                        "{item.reason}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-850 flex justify-between items-center">
                    <button
                      onClick={() => triggerSearch(item.title, item.creator)}
                      className="text-[10px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 uppercase"
                    >
                      <Search className="w-3 h-3 text-[#E50914]" />
                      Rechercher
                      <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                    </button>
                    <span className="text-[9px] font-mono text-zinc-500">
                      {item.genres.join(' • ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 4: MUSIC SUGGESTIONS PAGE */}
        {activePage === 'music' && (
          <div className="max-w-7xl mx-auto w-full p-6 space-y-8 min-h-[70vh]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">// Curation Musique</div>
                <h2 className="text-3xl font-extrabold text-white font-display flex items-center gap-3">
                  <Music className="w-8 h-8 text-violet-500" />
                  Vibrations Sonores Suggérées
                </h2>
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed max-w-2xl font-sans font-light">
                  Des paysages ambient de Max Richter aux textures de guitares éthérées d'Hammock. Un parcours auditif structuré pour apaiser ou intensifier votre imaginaire.
                </p>
              </div>
              <button
                onClick={() => setShowMusicCuration(!showMusicCuration)}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold uppercase tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-2 self-start sm:self-center shadow-lg"
              >
                <Sliders className="w-4 h-4" />
                {showMusicCuration ? "Masquer les réglages IA" : "Ajuster le Curateur IA"}
              </button>
            </div>

            <AnimatePresence>
              {showMusicCuration && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <ProfileForm 
                    onSubmit={handleGenerateRecommendations} 
                    isLoading={isLoading} 
                    initialCategory="music"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeMusic.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-[#181818] border border-zinc-800 hover:border-[#E50914]/80 transition-all rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group shadow-lg duration-300"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                    <Music className="w-16 h-16 text-[#E50914]" />
                  </div>

                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-mono tracking-widest text-[#E50914] bg-[#E50914]/10 border border-[#E50914]/30 px-2 py-0.5 rounded font-bold uppercase">
                        {item.matchScore}% affinity
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono leading-relaxed flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.year}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white leading-tight font-display group-hover:text-[#E50914] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 font-mono font-bold">
                      {item.creator}
                    </p>

                    <p className="text-xs text-zinc-300 mt-4 leading-relaxed font-sans font-light">
                      {item.description}
                    </p>

                    {/* Expandable note on affinity reasons */}
                    <div className="mt-4 p-3 bg-black/40 rounded border border-zinc-900">
                      <h4 className="text-[9px] font-mono font-bold uppercase text-[#E50914] mb-1.5">// Rapport Sémantique & Synesthésie :</h4>
                      <p className="text-xs text-zinc-400 italic">
                        "{item.reason}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-850 flex justify-between items-center">
                    <button
                      onClick={() => triggerSearch(item.title, item.creator)}
                      className="text-[10px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 uppercase"
                    >
                      <Search className="w-3 h-3 text-[#E50914]" />
                      Rechercher
                      <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                    </button>
                    <span className="text-[9px] font-mono text-zinc-500">
                      {item.genres.join(' • ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* NETFLIX-STYLE ULTRA SLEEK MINIMAL FOOTER */}
      <footer className="border-t border-zinc-900 bg-[#0c0c0c] px-6 py-12 text-center text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-lg font-extrabold uppercase font-display tracking-wider text-[#E50914]">
              MatchMuse
            </span>
            <p className="text-[9px] text-zinc-600 tracking-wide font-sans normal-case">
              Plateforme sémantique de synesthésie culturelle croisée pour esprits curieux.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[10px]">
            <span className="hover:text-white transition-all cursor-pointer">Conditions d'Utilisation</span>
            <span>•</span>
            <span className="hover:text-white transition-all cursor-pointer">Confidentialité</span>
            <span>•</span>
            <span className="hover:text-white transition-all cursor-pointer">Curation Personnalisée</span>
            <span>•</span>
            <span className="hover:text-white transition-all cursor-pointer">Contact</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
