import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// On charge les variables d'environnement
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Stockage en mémoire pour simuler une base de données de sessions sauvegardées
interface SavedSession {
  id: string;
  timestamp: string;
  profile: any;
  recommendations: any[];
  userProfileSummary: string;
}

let savedSessions: SavedSession[] = [
  {
    id: "session-démo",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // Il y a 2 heures
    profile: {
      mood: "Mélancolique & Nocturne",
      genres: {
        movie: ["Drame", "Sci-Fi"],
        book: ["Philosophique", "Poésie"],
        music: ["Ambient", "Classique moderne"]
      },
      preferencesText: "J'aime les œuvres contemplatives qui explorent le temps, la solitude positive et le cosmos.",
      lastLiked: {
        movie: "Interstellar de Christopher Nolan",
        book: "L'Étranger d'Albert Camus",
        music: "Max Richter - Sleep"
      },
      complexity: "intellectual",
      language: "français"
    },
    userProfileSummary: "L'utilisateur possède un profil artistique d'une grande sensibilité, marqué par une recherche continuelle d'introspection et de résonance contemplative. Attiré par les thématiques de l'infiniment grand et de l'intimité humaine, il préfère les récits complexes qui allient rigueur conceptuelle et profondeur poétique.",
    recommendations: [
      {
        id: "demo-rec-1",
        title: "Blade Runner 2049",
        creator: "Denis Villeneuve",
        category: "movie",
        genres: ["Sci-Fi", "Drame", "Cinématographique"],
        year: 2017,
        description: "Un officier de police de Los Angeles (K) déterre un secret oublié depuis longtemps qui pourrait plonger le reste de la société dans le chaos.",
        reason: "Parce que vous aimez 'Interstellar' et êtes attiré par la solitude poétique, la photographie magistrale de Roger Deakins et le rythme hypnotique de ce chef-d'œuvre de science-fiction feront vibrer votre âme contemplative.",
        matchScore: 94,
        tags: ["Atmosphérique", "Philosophique", "Mélancolique"]
      },
      {
        id: "demo-rec-2",
        title: "La possibilité d'une île",
        creator: "Michel Houellebecq",
        category: "book",
        genres: ["Philosophique", "Anticipation"],
        year: 2005,
        description: "Une double réflexion sur le vieillissement du corps humain, l'immortalité technologique et l'extinction lente du sentiment d'amour.",
        reason: "Votre attrait pour 'L'Étranger' d'Albert Camus et les questionnements métaphysiques lourds trouvera dans cette œuvre une tension cynique et émouvante autour de la solitude des clones du futur.",
        matchScore: 89,
        tags: ["Existantialisme", "Mélancolie", "Visionnaire"]
      },
      {
        id: "demo-rec-3",
        title: "Solitude",
        creator: "Hammock",
        category: "music",
        genres: ["Ambient", "Post-Rock"],
        year: 2017,
        description: "Un album instrumental somptueux, fondé sur des couches de guitare réverbérées et des orchestrations de cordes délicates.",
        reason: "En parfaite symbiose avec votre écoute de Max Richter, Hammock peint des paysages sonores d'une pure beauté mélancolique qui feront office d'écrin parfait pour vos moments de recueillement nocturnes.",
        matchScore: 96,
        tags: ["Contemplatif", "Nostalgique", "Lumineux"]
      }
    ]
  }
];

// Lazy initialization du client Gemini
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY non configurée. Veuillez ajouter votre clé API Gemini dans le panneau Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// ---------------------------------------------------------
// ROUTES D'API BACKEND
// ---------------------------------------------------------

// Route de santé
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Route historique
app.get("/api/sessions", (req, res) => {
  try {
    res.json(savedSessions);
  } catch (err: any) {
    res.status(500).json({ error: "Impossible de récupérer les sessions", detail: err.message });
  }
});

// Route sauvegarde de session
app.post("/api/sessions/save", (req, res) => {
  try {
    const { profile, recommendations, userProfileSummary } = req.body;
    if (!profile || !recommendations) {
      res.status(400).json({ error: "Champs obligatoires manquants" });
      return;
    }
    const newSession: SavedSession = {
      id: "session-" + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      profile,
      recommendations,
      userProfileSummary: userProfileSummary || "Analyse personnalisée."
    };
    savedSessions.unshift(newSession); // On l'ajoute au début
    res.status(201).json(newSession);
  } catch (err: any) {
    res.status(500).json({ error: "Impossible de sauvegarder la session", detail: err.message });
  }
});

// Route suppression de session
app.delete("/api/sessions/:id", (req, res) => {
  try {
    const { id } = req.params;
    savedSessions = savedSessions.filter(s => s.id !== id);
    res.json({ message: "Session supprimée avec succès" });
  } catch (err: any) {
    res.status(500).json({ error: "Impossible de supprimer la session", detail: err.message });
  }
});

// Route principale : Génération des recommandations intelligentes par Gemini !
app.post("/api/recommendations/generate", async (req, res) => {
  try {
    const { profile, category } = req.body;
    if (!profile) {
      res.status(400).json({ error: "Données de profil utilisateur manquantes." });
      return;
    }

    const ai = getGeminiClient();
    const targetCategory = category || 'all';
    const isSingleCategory = ['movie', 'book', 'music'].includes(targetCategory);
    const countRequired = isSingleCategory ? 4 : 9;

    const systemInstruction = `Tu es un expert culturel et artistique universel doté d'une profonde sensibilité sémantique.
Ton rôle est de recommander EXACTEMENT ${countRequired} œuvres d'art parfaitement adaptées au profil culturel, à l'humeur et aux préférences de l'utilisateur.

${isSingleCategory ? `Tu dois proposer uniquement des œuvres de la catégorie '${targetCategory}' (exactement ${countRequired} œuvres sous category='${targetCategory}'). Ne propose AUCUNE œuvre d'une autre catégorie.` : `Tu dois proposer exactement 3 films (category='movie'), 3 livres (category='book'), et 3 pistes de musique (category='music') pour un total de 9 œuvres.`}

Pour chaque œuvre recommandée :
- Tu fourniras un titre exact, le créateur (réalisateur pour les films, auteur pour les livres, artiste/groupe/compositeur pour la musique) et l'année.
- Tu fourniras un court résumé accrocheur (description).
- Tu fourniras une explication sémantique hautement personnalisée et chaleureuse (reason), rédigée d'après l'humeur recherchée par l'utilisateur, ses genres favoris, ses dernières œuvres appréciées, et son style s'il a spécifié des détails. Cette explication doit aller en profondeur sémantique (éviter les clichés, faire de vrais liens thématiques ou de mood).
- Tu attribueras un score de correspondance (matchScore, entre 60 et 100) honnête et réaliste.
- Tu ajouteras 3 tags pertinents (mots clés de mood ou caractéristiques thématiques, ex: ['Contemplatif', 'Complexe', 'Mélancolique']).

Tu dois également générer un résumé synthétique (userProfileSummary) rédigé comme une fine analyse de profil psychologique de l'utilisateur basé uniquement sur ses préférences saisies. Ce résumé lui explique ce que ses choix révèlent de sa sensibilité.

Le tout sera rédigé exclusivement en ${profile.language || 'français'}.
Ne renvoie que du JSON valide respectant scrupuleusement le schéma fourni.`;

    const modelName = "gemini-3.5-flash";

    const schema = {
      type: Type.OBJECT,
      properties: {
        userProfileSummary: {
          type: Type.STRING,
          description: "Un paragraphe ou deux résumant la sensibilité esthétique et psychologique de l'utilisateur d'après ses paramètres."
        },
        recommendations: {
          type: Type.ARRAY,
          description: isSingleCategory ? `Un tableau contenant exactement ${countRequired} objets de recommandation de catégorie ${targetCategory}.` : "Un tableau contenant exactement 9 objets de recommandation (exactement 3 films, 3 livres, 3 pièces musicales).",
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "ID unique de type sémantique (ex: rec-1, rec-2...)" },
              title: { type: Type.STRING, description: "Le titre original ou français connu" },
              creator: { type: Type.STRING, description: "L'auteur, le réalisateur ou l'artiste" },
              category: { 
                type: Type.STRING, 
                description: `La catégorie. Doit obligatoirement être '${targetCategory}' pour toutes les œuvres.`
              },
              genres: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Les genres principaux"
              },
              year: { type: Type.STRING, description: "L'année approximative ou exacte" },
              description: { type: Type.STRING, description: "Un synopsis ou résumé accrocheur." },
              reason: { type: Type.STRING, description: "L'analyse sur-mesure expliquant le lien sémantique entre cette œuvre et le profil de l'utilisateur." },
              matchScore: { type: Type.INTEGER, description: "Score de 60 à 100" },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactement 3 tags ou adjectifs descriptifs de l'ambiance."
              }
            },
            required: ["id", "title", "creator", "category", "genres", "year", "description", "reason", "matchScore", "tags"]
          }
        }
      },
      required: ["userProfileSummary", "recommendations"]
    };

    let promptUser = "";
    if (isSingleCategory) {
      let categoryDetails = "";
      if (targetCategory === 'movie') {
        categoryDetails = `
- Catégorie ciblée : FILMS / CINÉMA
- Genres favoris de l'utilisateur : [${(profile.genres?.movie || []).join(', ')}]
- Dernier film adoré : "${profile.lastLiked?.movie || 'Non spécifié'}"
`;
      } else if (targetCategory === 'book') {
        categoryDetails = `
- Catégorie ciblée : LIVRES / LITTÉRATURE
- Genres favoris de l'utilisateur : [${(profile.genres?.book || []).join(', ')}]
- Dernier livre adoré : "${profile.lastLiked?.book || 'Non spécifié'}"
`;
      } else {
        categoryDetails = `
- Catégorie ciblée : MUSIQUE / PIÈCES SONORES
- Genres favoris de l'utilisateur : [${(profile.genres?.music || []).join(', ')}]
- Dernier morceau/artiste adoré : "${profile.lastLiked?.music || 'Non spécifié'}"
`;
      }

      promptUser = `
Voici le profil de l'utilisateur à analyser pour la génération d'une curation ${targetCategory === 'movie' ? 'Cinéma' : targetCategory === 'book' ? 'Littéraire' : 'Musicale'} sur-mesure :
- Humeur / État d'esprit général : "${profile.mood || 'Standard'}"
- Complexité recherchée : "${profile.complexity || 'standard'}"
- Langue préférée : "${profile.language || 'français'}"

Détails spécifiques de la catégorie :
${categoryDetails}

- Expression libre de l'utilisateur (ses attentes et l'univers recherché) :
  "${profile.preferencesText || 'Pas de précisions additionnelles'}"

Génère les recommandations parfaites. Assure-toi d'en proposer exactement 4 de type '${targetCategory}'.
`;
    } else {
      promptUser = `
Voici le profil global de l'utilisateur à analyser et à satisfaire :
- Humeur / État d'esprit : "${profile.mood || 'Standard / Découverte'}"
- Complexes & Ton : "${profile.complexity || 'standard'}" (casual = accessible mais intelligent, standard = équilibré et fin, intellectual = de grande profondeur philosophique ou ésotérique)
- Langue préférée : "${profile.language || 'français'}"

Préférences par catégorie :
1. FILMS:
   - Genres favoris : [${(profile.genres?.movie || []).join(', ')}]
   - Dernier film adoré : "${profile.lastLiked?.movie || 'Non spécifié'}"

2. LIVRES :
   - Genres favoris : [${(profile.genres?.book || []).join(', ')}]
   - Dernier livre adoré : "${profile.lastLiked?.book || 'Non spécifié'}"

3. MUSIQUE :
   - Genres favoris : [${(profile.genres?.music || []).join(', ')}]
   - Dernier titre/album adoré : "${profile.lastLiked?.music || 'Non spécifié'}"

- Texte additionnel de préférences libres rédigé par l'utilisateur :
  "${profile.preferencesText || 'Pas de préférences additionnelles'}"

Génère les recommandations parfaites. Assure-toi d'en proposer exactement 3 de type 'movie', 3 de type 'book' et 3 de type 'music'.
`;
    }

    // Appel à l'API Gemini
    const response = await ai.models.generateContent({
      model: modelName,
      contents: promptUser,
      config: {
        systemInstruction,
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const textOutput = response.text || "{}";
    const resultJson = JSON.parse(textOutput);

    res.json(resultJson);
  } catch (err: any) {
    console.error("Erreur lors de la génération des recommandations:", err);
    res.status(500).json({
      error: "Une erreur est survenue lors de la recommandation sémantique par l'IA.",
      details: err.message
    });
  }
});

// ---------------------------------------------------------
// MIDDLEWARE DE VITE (DEV) & SERVEUR STATIQUE (PRODUCTION)
// ---------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveur de recommandation démarré sur http://localhost:${PORT}`);
  });
}

startServer();
