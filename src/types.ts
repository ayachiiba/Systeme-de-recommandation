/**
 * Types partagés pour le Système de Recommandation Intelligent basé sur un LLM
 */

export type CategoryType = 'movie' | 'book' | 'music';

export interface UserProfile {
  mood: string;
  genres: {
    movie: string[];
    book: string[];
    music: string[];
  };
  preferencesText: string;
  lastLiked: {
    movie: string;
    book: string;
    music: string;
  };
  complexity: 'casual' | 'standard' | 'intellectual';
  language: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  creator: string; // Réalisateur, Auteur ou Artiste
  category: CategoryType;
  genres: string[];
  year: string | number;
  description: string;
  reason: string; // Explication sémantique personnalisée du LLM
  matchScore: number; // Pourcentage de correspondance (0-100)
  tags: string[];
}

export interface RecommendationResponse {
  recommendations: RecommendationItem[];
  userProfileSummary: string; // Résumé textuel généré par l'IA sur l'analyse du profil utilisateur
}

export interface SavedSession {
  id: string;
  timestamp: string;
  profile: UserProfile;
  recommendations: RecommendationItem[];
  userProfileSummary: string;
}
