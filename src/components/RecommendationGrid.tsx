import React, { useState } from 'react';
import { RecommendationItem, CategoryType } from '../types';
import { Film, Book, Music, Award, ExternalLink, Calendar, ChevronDown, ChevronUp, Search, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RecommendationGridProps {
  items: RecommendationItem[];
  userProfileSummary?: string;
  language?: string;
}

export default function RecommendationGrid({ items, userProfileSummary, language = "français" }: RecommendationGridProps) {
  const [activeTab, setActiveTab] = useState<'all' | CategoryType>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const filteredItems = activeTab === 'all' 
    ? items 
    : items.filter(item => item.category === activeTab);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const gategoryIcons = {
    movie: <Film className="w-4 h-4 text-sky-400" />,
    book: <Book className="w-4 h-4 text-emerald-400" />,
    music: <Music className="w-4 h-4 text-rose-400" />
  };

  const categoryLabels = {
    movie: language === 'français' ? 'Cinéma' : 'Movies',
    book: language === 'français' ? 'Littérature' : 'Books',
    music: language === 'français' ? 'Musique' : 'Music'
  };

  const categoryColors = {
    movie: {
      border: 'border-zinc-900 focus:border-sky-500/50 hover:border-sky-500/40',
      bgGlow: 'hover:shadow-[0_0_24px_rgba(56,189,248,0.06)]',
      badge: 'bg-sky-500/5 text-sky-400 border-sky-500/20',
      scoreBar: 'bg-sky-500'
    },
    book: {
      border: 'border-zinc-900 focus:border-emerald-500/50 hover:border-emerald-500/40',
      bgGlow: 'hover:shadow-[0_0_24px_rgba(52,211,153,0.06)]',
      badge: 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20',
      scoreBar: 'bg-emerald-500'
    },
    music: {
      border: 'border-zinc-900 focus:border-rose-500/50 hover:border-rose-500/40',
      bgGlow: 'hover:shadow-[0_0_24px_rgba(251,113,133,0.06)]',
      badge: 'bg-rose-500/5 text-rose-400 border-rose-500/20',
      scoreBar: 'bg-rose-500'
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual profile analysis callout bar */}
      {userProfileSummary && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#090b10] to-[#040507] border border-zinc-900 rounded-2xl p-5 shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <Award className="w-48 h-48 text-amber-500" />
          </div>
          <div className="flex gap-4 items-start">
            <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 shrink-0 mt-0.5">
              <Award className="w-4.5 h-4.5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-[10px] font-mono font-bold tracking-widest text-[#9facb2] uppercase mb-1.5">
                {language === 'français' ? "// Diagnostic de votre Profil Esthétique" : "// Aesthetic Diagnosis"}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "{userProfileSummary}"
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Categories Filter Tabs */}
      <div className="flex border-b border-zinc-900 pb-3 justify-between items-center flex-wrap gap-3">
        <div className="flex gap-1.5">
          {['all', 'movie', 'book', 'music'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1 rounded text-[10px] font-mono uppercase tracking-wider cursor-pointer transition-all ${
                activeTab === tab 
                  ? 'bg-zinc-900 text-white border border-zinc-800 shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-950'
              }`}
            >
              {tab === 'all' && (language === 'français' ? 'Tout' : 'All')}
              {tab === 'movie' && (language === 'français' ? 'Cinéma' : 'Films')}
              {tab === 'book' && (language === 'français' ? 'Littérature' : 'Books')}
              {tab === 'music' && (language === 'français' ? 'Musique' : 'Music')}
            </button>
          ))}
        </div>
        <div className="text-[10px] text-zinc-600 font-mono">
          {items.length} {language === 'français' ? 'recommandations sémantiques' : 'AI recommendations'}
        </div>
      </div>

      {/* Grid containing cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => {
            const styles = categoryColors[item.category];
            const isExpanded = !!expandedIds[item.id];
            
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                className={`bg-[#090b10] border ${styles.border} ${styles.bgGlow} transition-all duration-300 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden`}
              >
                {/* Visual score marker in the corner */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 rounded border ${styles.badge} flex items-center gap-1.5`}>
                    {gategoryIcons[item.category]}
                    {categoryLabels[item.category]}
                  </span>
                  
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-mono font-bold text-zinc-400">
                      /{item.matchScore}% affinity
                    </span>
                    <div className="w-12 h-[2px] bg-zinc-950 rounded-full overflow-hidden mt-1">
                      <div 
                        className={`h-full ${styles.scoreBar}`} 
                        style={{ width: `${item.matchScore}%` }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Info block */}
                <div className="mb-4">
                  <h4 className="text-base font-bold text-white tracking-tight leading-snug font-display">
                    {item.title}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 font-semibold">
                    {item.creator}
                  </p>
                  
                  {item.year && (
                    <div className="flex items-center gap-1 text-[10px] text-zinc-600 font-mono mt-1">
                      <Calendar className="w-3 h-3" />
                      {item.year}
                    </div>
                  )}

                  <p className="text-xs text-zinc-400 mt-3.5 line-clamp-3 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {(item.tags || []).map(t => (
                    <span key={t} className="text-[9px] font-mono px-2 py-0.5 bg-black/40 text-zinc-500 rounded border border-zinc-950">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Accordion Explaining semantic reason */}
                <div className="border-t border-zinc-900/60 pt-3">
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-display"
                  >
                    <span className="flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      {language === 'français' ? "L'analyse complète" : "Curator's Note"}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden mt-2 bg-black/40 p-3 rounded border border-zinc-900"
                      >
                        <p className="text-xs text-zinc-350 leading-relaxed font-sans font-light">
                          {item.reason}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* External link to Google search semantic ground */}
                <div className="mt-4 flex justify-between items-center text-[10px]">
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(item.title + " " + item.creator + " " + item.category)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-zinc-500 hover:text-white transition-colors cursor-pointer font-mono"
                  >
                    <Search className="w-3 h-3 text-zinc-650" />
                    {language === 'français' ? "Rechercher" : "Search"}
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  
                  {item.genres && item.genres.length > 0 && (
                    <span className="text-zinc-600 text-[9px] font-mono truncate max-w-[120px]">
                      {item.genres.slice(0, 2).join(', ')}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
