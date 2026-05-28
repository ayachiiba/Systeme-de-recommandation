import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Sparkles, Film, Book, Music, MessageSquarePlus, RefreshCw, Sliders } from 'lucide-react';

interface ProfileFormProps {
  onSubmit: (profile: UserProfile, category: 'movie' | 'book' | 'music') => void;
  isLoading: boolean;
  initialCategory?: 'movie' | 'book' | 'music';
}

const MOODS = [
  { value: "Mélancolique & Nocturne", label: "🌌 Nocturne" },
  { value: "Serein & Contemplatif", label: "🧘 Contemplatif" },
  { value: "Curieux & Stimulé", label: "💡 Stimulant" },
  { value: "Festif & Plein d'Énergie", label: "⚡ Énergique" },
  { value: "Sombre & Mystérieux", label: "🕵️ Mystérieux" },
  { value: "Nostalgique & Rétro", label: "⏳ Rétro" },
  { value: "Inspiré & Créatif", label: "🎨 Créatif" }
];

const GENRES = {
  movie: ["Drame", "Sci-Fi", "Action", "Thriller", "Horreur", "Romance", "Fantasy", "Documentaire"],
  book: ["Philosophique", "Poésie", "Roman", "Policier", "Fantasy", "Sci-Fi", "Essai"],
  music: ["Ambient", "Classique moderne", "Jazz", "Rock", "Électronique", "Lofi / Chill", "Indie"]
};

export default function ProfileForm({ onSubmit, isLoading, initialCategory = 'movie' }: ProfileFormProps) {
  const [curationCategory, setCurationCategory] = useState<'movie' | 'book' | 'music'>(initialCategory);
  
  // Mood / Universal parameters
  const [mood, setMood] = useState<string>(MOODS[1].value);
  const [complexity, setComplexity] = useState<'casual' | 'standard' | 'intellectual'>('standard');
  const [language] = useState<string>('français');

  // Category specific parameters
  const [movieGenres, setMovieGenres] = useState<string[]>(["Sci-Fi", "Drame"]);
  const [bookGenres, setBookGenres] = useState<string[]>(["Philosophique"]);
  const [musicGenres, setMusicGenres] = useState<string[]>(["Ambient"]);
  
  const [lastMovie, setLastMovie] = useState<string>("Interstellar");
  const [lastBook, setLastBook] = useState<string>("L'Étranger");
  const [lastMusic, setLastMusic] = useState<string>("Max Richter - Sleep");
  
  // Custom descriptions text for each category for ultimate independence
  const [moviePrefText, setMoviePrefText] = useState<string>(
    "J'aime les œuvres contemplatives qui explorent le temps, la solitude positive et le cosmos."
  );
  const [bookPrefText, setBookPrefText] = useState<string>(
    "Attiré par la littérature existentialiste, introspective et les fictions spéculatives majeures."
  );
  const [musicPrefText, setMusicPrefText] = useState<string>(
    "Je recherche un cocon sonore planant, d'immenses vagues instrumentales et des textures éthérées."
  );

  // Keep in sync with changed page
  useEffect(() => {
    setCurationCategory(initialCategory);
  }, [initialCategory]);

  const toggleGenre = (category: 'movie' | 'book' | 'music', genre: string) => {
    if (category === 'movie') {
      setMovieGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
    } else if (category === 'book') {
      setBookGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
    } else {
      setMusicGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Choose relevant preferences text based on active category
    const activePrefText = 
      curationCategory === 'movie' ? moviePrefText :
      curationCategory === 'book' ? bookPrefText : musicPrefText;

    onSubmit({
      mood,
      genres: {
        movie: movieGenres,
        book: bookGenres,
        music: musicGenres
      },
      preferencesText: activePrefText,
      lastLiked: {
        movie: lastMovie,
        book: lastBook,
        music: lastMusic
      },
      complexity,
      language
    }, curationCategory);
  };

  const quickFillSample = (theme: 'cyberpunk' | 'romantic' | 'adventure') => {
    if (curationCategory === 'movie') {
      if (theme === 'cyberpunk') {
        setMood("Sombre & Mystérieux");
        setMovieGenres(["Sci-Fi", "Thriller"]);
        setLastMovie("Blade Runner 2049");
        setMoviePrefText("Recherche d'ambiance néon rétro-futuriste, de questions existentielles sur la conscience robotique.");
        setComplexity("intellectual");
      } else if (theme === 'romantic') {
        setMood("Inspiré & Créatif");
        setMovieGenres(["Romance", "Drame"]);
        setLastMovie("La La Land");
        setMoviePrefText("Recherche de poésie sensible, de récits mélancoliques sur les artistes et d'envolées chromatiques.");
        setComplexity("standard");
      } else if (theme === 'adventure') {
        setMood("Curieux & Stimulé");
        setMovieGenres(["Action", "Fantasy"]);
        setLastMovie("Le Seigneur des Anneaux");
        setMoviePrefText("Recherche d'épopées visuelles mythiques, de grands voyages initiatiques et de tensions dramatiques.");
        setComplexity("casual");
      }
    } else if (curationCategory === 'book') {
      if (theme === 'cyberpunk') {
        setMood("Sombre & Mystérieux");
        setBookGenres(["Sci-Fi", "Philosophique"]);
        setLastBook("Le Neuromancien");
        setBookPrefText("Lecture explorant les réseaux cyber-neuronaux, la cybernétique crasseuse et le déséquilibre de la société technologique.");
        setComplexity("intellectual");
      } else if (theme === 'romantic') {
        setMood("Inspiré & Créatif");
        setBookGenres(["Poésie", "Roman"]);
        setLastBook("Les Fleurs du Mal de Baudelaire");
        setBookPrefText("Prose lyrique lourde de spleen et de beauté obscure idéale pour accompagner des heures de rêverie.");
        setComplexity("standard");
      } else if (theme === 'adventure') {
        setMood("Curieux & Stimulé");
        setBookGenres(["Fantasy", "Roman"]);
        setLastBook("Le Hobbit");
        setBookPrefText("Récit à l'ambiance médiévale captivante, avec un lore worldbuilding dense et un souffle aventureux.");
        setComplexity("casual");
      }
    } else { // music
      if (theme === 'cyberpunk') {
        setMood("Sombre & Mystérieux");
        setMusicGenres(["Électronique", "Ambient"]);
        setLastMusic("Daft Punk - Tron: Legacy");
        setMusicPrefText("Synthwave agressive ou synthétiseurs froids inspirés de la dystopie mégalopolitaine.");
        setComplexity("standard");
      } else if (theme === 'romantic') {
        setMood("Inspiré & Créatif");
        setMusicGenres(["Classique moderne", "Ambient"]);
        setLastMusic("Max Richter - Sleep");
        setMusicPrefText("Envolées mélancoliques de piano, arrangements solennels de violons et nappes magnétiques.");
        setComplexity("intellectual");
      } else if (theme === 'adventure') {
        setMood("Curieux & Stimulé");
        setMusicGenres(["Rock"]);
        setLastMusic("Hans Zimmer - Gladiator OST");
        setMusicPrefText("Riffs de guitare cinématiques puissants, rythmes percutants et thèmes musicaux héroïques de grande envergure.");
        setComplexity("casual");
      }
    }
  };

  // Border style corresponding to category
  const getCategoryColorClass = () => {
    if (curationCategory === 'movie') return 'border-t-[#E50914] focus:border-[#E50914] text-[#E50914]';
    if (curationCategory === 'book') return 'border-t-emerald-600 focus:border-emerald-600 text-emerald-500';
    return 'border-t-violet-600 focus:border-violet-600 text-violet-500';
  };

  const getAccentBgClass = () => {
    if (curationCategory === 'movie') return 'bg-[#E50914] hover:bg-[#b00710] shadow-[#E50914]/20';
    if (curationCategory === 'book') return 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20';
    return 'bg-violet-600 hover:bg-violet-700 shadow-violet-600/20';
  };

  return (
    <div 
      id="profile-config-form" 
      className={`bg-[#181818] border border-zinc-800 border-t-4 rounded-xl p-6 shadow-2xl text-zinc-100 transition-all duration-300 ${getCategoryColorClass()}`}
    >
      {/* Header locked to active category */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-base font-bold uppercase tracking-wider text-white flex items-center gap-2 font-display">
            <Sparkles className="w-4 h-4 text-[#E50914]" />
            Configurateur de Curation IA Spécialisé
          </h2>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            Définissez vos préférences d'ambiance spécifiques pour affiner vos recommandations de {curationCategory === 'movie' ? 'Cinéma' : curationCategory === 'book' ? 'Lecture' : 'Musique'}.
          </p>
        </div>
        
        <div className="flex items-center gap-1.5 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-850 text-xs font-mono font-bold uppercase tracking-wider text-white">
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
            curationCategory === 'movie' ? 'bg-[#E50914]' : 
            curationCategory === 'book' ? 'bg-emerald-500' : 'bg-violet-500'
          }`} />
          {curationCategory === 'movie' ? '🍿 CINÉMA' : curationCategory === 'book' ? '📖 LITTÉRATURE' : '🎵 MUSIQUE'}
        </div>
      </div>

      <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-zinc-900 mb-6">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-zinc-500" />
          <span className="text-[11px] font-mono font-bold text-zinc-300 uppercase">
            Curateur Actif :{' '}
            <span className={
              curationCategory === 'movie' ? 'text-[#E50914]' : 
              curationCategory === 'book' ? 'text-emerald-400' : 'text-violet-400'
            }>
              {curationCategory === 'movie' ? '🍿 CINÉMA' : curationCategory === 'book' ? '📖 LITTÉRATURE (BOOKS)' : '🎵 MUSIQUE'}
            </span>
          </span>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => quickFillSample('cyberpunk')}
            className="text-[9px] font-mono font-bold px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded transition-all uppercase cursor-pointer"
          >
            👾 Cyberpunk
          </button>
          <button
            type="button"
            onClick={() => quickFillSample('romantic')}
            className="text-[9px] font-mono font-bold px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded transition-all uppercase cursor-pointer"
          >
            🌸 Poétique
          </button>
          <button
            type="button"
            onClick={() => quickFillSample('adventure')}
            className="text-[9px] font-mono font-bold px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded transition-all uppercase cursor-pointer"
          >
            🛡️ Épique
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood select */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-3">
            // 01. HORIZON D'AMBIANCE / MOOD
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
            {MOODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                className={`py-2 px-1 text-center text-xs rounded transition-all cursor-pointer ${
                  mood === m.value
                    ? curationCategory === 'movie' ? 'bg-[#E50914] border border-[#E50914] text-white font-bold'
                      : curationCategory === 'book' ? 'bg-emerald-600 border border-emerald-600 text-white font-bold'
                      : 'bg-violet-600 border border-violet-600 text-white font-bold'
                    : 'bg-[#121212] border border-zinc-900 text-zinc-450 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category specific fields */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left panel: Genres & Reference */}
          <div className="md:col-span-6 space-y-6">
            
            {/* Conditional categories genres checklist */}
            {curationCategory === 'movie' && (
              <div className="bg-zinc-900/60 p-4 rounded-lg border border-zinc-850">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white mb-3 font-display border-b border-zinc-850 pb-2">
                  <Film className="w-3.5 h-3.5 text-[#E50914]" />
                  Affinités de Genres Cinématographiques
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {GENRES.movie.map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGenre('movie', g)}
                      className={`text-[10px] px-2.5 py-1 rounded transition-all cursor-pointer ${
                        movieGenres.includes(g)
                          ? 'bg-[#E50914]/20 border border-[#E50914]/80 text-white font-semibold'
                          : 'bg-zinc-950 border border-zinc-850 hover:border-zinc-750 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {curationCategory === 'book' && (
              <div className="bg-zinc-900/60 p-4 rounded-lg border border-zinc-850">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white mb-3 font-display border-b border-zinc-850 pb-2">
                  <Book className="w-3.5 h-3.5 text-emerald-500" />
                  Prédilections de Genres Littéraires
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {GENRES.book.map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGenre('book', g)}
                      className={`text-[10px] px-2.5 py-1 rounded transition-all cursor-pointer ${
                        bookGenres.includes(g)
                          ? 'bg-emerald-600/20 border border-emerald-500/80 text-white font-semibold'
                          : 'bg-zinc-950 border border-zinc-850 hover:border-zinc-750 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {curationCategory === 'music' && (
              <div className="bg-zinc-900/60 p-4 rounded-lg border border-zinc-850">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white mb-3 font-display border-b border-zinc-850 pb-2">
                  <Music className="w-3.5 h-3.5 text-violet-400" />
                  Textures & Courants Musicaux
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {GENRES.music.map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGenre('music', g)}
                      className={`text-[10px] px-2.5 py-1 rounded transition-all cursor-pointer ${
                        musicGenres.includes(g)
                          ? 'bg-violet-600/20 border border-violet-500/80 text-white font-semibold'
                          : 'bg-zinc-950 border border-zinc-850 hover:border-zinc-750 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Anchors (Dernier adoré) */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2.5">
                // 02. POINT D'ANCRAGE RÉFÉRENTIEL
              </label>
              
              {curationCategory === 'movie' && (
                <div className="flex items-center gap-2.5 bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2.5 focus-within:border-[#E50914] transition-colors">
                  <Film className="w-4 h-4 text-zinc-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="Dernier film marquant adulé..."
                    value={lastMovie}
                    onChange={e => setLastMovie(e.target.value)}
                    className="bg-transparent text-xs text-zinc-250 outline-none w-full placeholder-zinc-600"
                  />
                </div>
              )}

              {curationCategory === 'book' && (
                <div className="flex items-center gap-2.5 bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2.5 focus-within:border-emerald-500 transition-colors">
                  <Book className="w-4 h-4 text-zinc-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="Dernier chef-d'œuvre littéraire lu..."
                    value={lastBook}
                    onChange={e => setLastBook(e.target.value)}
                    className="bg-transparent text-xs text-zinc-250 outline-none w-full placeholder-zinc-600"
                  />
                </div>
              )}

              {curationCategory === 'music' && (
                <div className="flex items-center gap-2.5 bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2.5 focus-within:border-violet-500 transition-colors">
                  <Music className="w-4 h-4 text-zinc-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="Album ou morceau fétiche actuel..."
                    value={lastMusic}
                    onChange={e => setLastMusic(e.target.value)}
                    className="bg-transparent text-xs text-zinc-250 outline-none w-full placeholder-zinc-600"
                  />
                </div>
              )}
            </div>

          </div>

          {/* Right panel: Description & Complexity */}
          <div className="md:col-span-6 space-y-6">
            
            {/* Description / Prose description text */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2.5 flex items-center gap-1">
                <MessageSquarePlus className="w-3.5 h-3.5" />
                // 03. DESCRIPTION DE L'ATMOSPHÈRE RECHERCHÉE (PROSE LIBRE)
              </label>
              
              {curationCategory === 'movie' && (
                <textarea
                  rows={4}
                  placeholder="Décrivez l'univers, la photo, le rythme : contemplative, scifi clinique, polar pluvieux..."
                  value={moviePrefText}
                  onChange={e => setMoviePrefText(e.target.value)}
                  className="w-full bg-zinc-955 border border-zinc-850 rounded-lg p-3 text-xs text-zinc-200 outline-none focus:border-[#E50914] transition-colors resize-none leading-relaxed font-sans placeholder-zinc-600"
                />
              )}

              {curationCategory === 'book' && (
                <textarea
                  rows={4}
                  placeholder="Style littéraire, profondeur : introspectif lourd, écriture minimaliste, philosophie baroque, prose poétique..."
                  value={bookPrefText}
                  onChange={e => setBookPrefText(e.target.value)}
                  className="w-full bg-zinc-955 border border-zinc-850 rounded-lg p-3 text-xs text-zinc-200 outline-none focus:border-emerald-500 transition-colors resize-none leading-relaxed font-sans placeholder-zinc-600"
                />
              )}

              {curationCategory === 'music' && (
                <textarea
                  rows={4}
                  placeholder="Textures, instruments, tempo : ambient planant, synthés modulaires nocturnes, violons déchirants..."
                  value={musicPrefText}
                  onChange={e => setMusicPrefText(e.target.value)}
                  className="w-full bg-zinc-955 border border-zinc-850 rounded-lg p-3 text-xs text-zinc-200 outline-none focus:border-violet-500 transition-colors resize-none leading-relaxed font-sans placeholder-zinc-600"
                />
              )}
            </div>

            {/* Complexity */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-1">
                Profondeur d'Analyse Sémantique
              </label>
              <select
                value={complexity}
                onChange={e => setComplexity(e.target.value as any)}
                className="w-full bg-[#121212] border border-zinc-850 rounded-lg p-2.5 text-xs text-zinc-300 outline-none cursor-pointer focus:border-zinc-700"
              >
                <option value="casual">Accessible, divertissant et fluide</option>
                <option value="standard">Équilibrée, recherchée et fine</option>
                <option value="intellectual">De grande profondeur philosophique & conceptuelle</option>
              </select>
            </div>

          </div>
        </div>

        {/* Action / Launch Curation bar */}
        <div className="pt-2 border-t border-zinc-850/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-[10px] text-zinc-500 font-mono">
            // L'AGENT MATCHMUSE MODÈLE LES RECOMMANDATIONS UNIQUEMENT POUR LA CATÉGORIE ACTIVE.
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full sm:w-auto relative py-2.5 px-6 font-bold text-white text-xs uppercase tracking-widest rounded-lg transition-all shadow-lg active:translate-y-0.5 disabled:bg-zinc-850 disabled:text-zinc-600 flex items-center justify-center gap-2 cursor-pointer font-display ${getAccentBgClass()}`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                  SYNTHÈSE DE CURATION IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  LANCER LA CURATION {curationCategory === 'movie' ? 'CINÉMA' : curationCategory === 'book' ? 'LIVRE' : 'MUSIQUE'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
