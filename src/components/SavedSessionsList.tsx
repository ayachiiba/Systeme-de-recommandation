import React from 'react';
import { SavedSession } from '../types';
import { Library, Trash2, Calendar, FileText, ChevronRight, User } from 'lucide-react';
import { motion } from 'motion/react';

interface SavedSessionsListProps {
  sessions: SavedSession[];
  onSelect: (session: SavedSession) => void;
  onDelete: (id: string) => void;
  currentSelectedId?: string;
  language?: string;
}

export default function SavedSessionsList({ 
  sessions, 
  onSelect, 
  onDelete, 
  currentSelectedId,
  language = "français"
}: SavedSessionsListProps) {
  
  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleString(language === 'français' ? 'fr-FR' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="bg-[#090b10] border border-zinc-900 rounded-2xl p-6 shadow-xl text-zinc-100 h-full">
      <div className="flex items-center gap-2 mb-5">
        <Library className="w-4 h-4 text-amber-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-white font-display">
          {language === 'français' ? "Profils Sauvegardés" : "Saved Profiles"}
        </h3>
        <span className="ml-auto bg-black/40 text-[9px] font-mono text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded-full">
          {sessions.length}
        </span>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-8 text-zinc-650">
          <FileText className="w-7 h-7 mx-auto mb-2 text-zinc-700" />
          <p className="text-xs">
            {language === 'français' 
              ? "Aucune sauvegarde." 
              : "No saved profiles."}
          </p>
          <p className="text-[10px] text-zinc-600 mt-1">
            {language === 'français'
              ? "Sauvegardez vos curations d'IA."
              : "Generate and save recommendations."}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
          {sessions.map((session, i) => {
            const isSelected = currentSelectedId === session.id;
            
            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`group p-4 rounded-xl border transition-all text-left relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                  isSelected 
                    ? 'bg-gradient-to-br from-amber-400/5 to-rose-500/5 border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.03)]' 
                    : 'bg-black/30 border-zinc-900 hover:border-zinc-800 hover:bg-black/55'
                }`}
                onClick={() => onSelect(session)}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-zinc-200 truncate pr-6 font-display">
                      Mood: {session.profile.mood}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(session.id);
                      }}
                      className="absolute top-3 right-3 text-zinc-600 hover:text-rose-400 p-1 rounded hover:bg-zinc-900 transition-colors"
                      title={language === 'français' ? "Supprimer" : "Delete profile"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed font-sans">
                    {session.profile.preferencesText || (language === 'français' ? "Curation par défaut." : "No explicit preferences.")}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-black text-sky-400 rounded border border-zinc-900">
                      🎬 {session.profile.genres?.movie?.slice(0, 1) || 'All'}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-black text-emerald-400 rounded border border-zinc-900">
                      📘 {session.profile.genres?.book?.slice(0, 1) || 'All'}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-black text-rose-400 rounded border border-zinc-900">
                      🎵 {session.profile.genres?.music?.slice(0, 1) || 'All'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-900 mt-3 pt-2 text-[10px] text-zinc-600 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(session.timestamp)}
                  </span>
                  
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5 font-mono text-[9px] uppercase font-bold">
                    {language === 'français' ? "Restaurer" : "Restore"}
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

