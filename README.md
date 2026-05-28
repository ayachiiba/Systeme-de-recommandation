# 🎓 MatchMuse — Système de Recommandation Multi-Catégorielle par LLM



>  ### **Auteur** : **Aya Chiba**  
> *MatchMuse est une plateforme web full-stack moderne exploitant l'intelligence sémantique des modèles de langage de grande taille pour concevoir une curation artistique et culturelle d'affinité sur-mesure couvrant le Cinéma, la Littérature et la Musique.*

---

## 📖 Table des matières

1. [À propos (Ce que fait le projet)](#-à-propos-ce-que-fait-le-projet)
2. [Pourquoi ce projet est utile](#-pourquoi-ce-projet-est-utile)
3. [Fonctionnalités clés](#-fonctionnalités-clés)
4. [Stack technique & Architecture](#-stack-technique--architecture)
5. [Pour commencer (Installation locale)](#-pour-commencer-installation-locale)
6. [Guide d'utilisation](#%EF%B8%8F-guide-dutilisation)
7. [demonstration](#%EF%B8%8F-demonstration)



---

## 🔍 À propos (Ce que fait le projet)

Dans le cadre de l'ingénierie cognitive et des interfaces homme-machine (IHM), **MatchMuse** propose un paradigme alternatif basé sur **l'alignement sémantique et affectif**. Au lieu d'utiliser des classifications rigides par genres statistiques ou filtrage collaboratif (historiques de clics, likes anonymes), le système fusionne :
*   **Les indices psychologiques** de l'utilisateur (humeur passagère, énergie recherchée, niveau de complexité conceptuelle souhaitée).
*   **Ses ancres culturelles réelles** (ses dernières œuvres préférées pour contextualiser son goût).
*   **Une prose libre descriptive** de l'atmosphère recherchée.

L'IA hautement spécialisée de Google **Gemini 3.5 Flash** agit ensuite comme un expert culturel universel pour décoder ces informations textuelles complexes, formuler un bref profil sémantique de l'usager et générer une sélection d'œuvres adaptées, assortie de justifications d'affinité précises.

---

## 💡 Pourquoi ce projet est utile

*   **Surmonter la fatigue de choix** : Les algorithmes de recommandation actuels ont tendance à enfermer les internautes dans des bulles de filtres redondantes. MatchMuse permet de dépasser ces limites en faisant le pont entre différentes formes d'art (par exemple, recommander un livre de philosophie existentialiste parce que vous cherchez un film au ton similaire).
*   **Comprendre l'arrière-plan créatif** : Chaque suggestion formulée par MatchMuse est accompagnée d'un pourcentage d'affinité et d'un paragraphe d'explication rédigé par l'IA détaillant pourquoi l'œuvre résonne sémantiquement avec l'état émotionnel décrit.
*   **Curation croisée cohérente** : La plateforme permet de créer des fils directeurs d'ambiance à travers des médias de natures différentes (écouter la musique idéale pour accompagner le livre recommandé pour la soirée).

---

## 🎨 Fonctionnalités clés

1.  **Curation Décentralisée par IA Spécialisée** : Chaque discipline artistique (Cinéma, Littérature, Musique) dispose de sa propre enveloppe de paramètres et de sa propre zone de configuration. L'IA adapte ses critères s'il s'agit de décoder l'intensité de la photographie d'un film d'auteur ou la dynamique instrumentale d'un morceau de musique.
2.  **Sortie JSON Structurellement Robuste** : Utilisation du module `responseSchema` de l'API Google Gen AI. L'IA génère les recommandations selon un schéma de typage strict des données (titres, créateurs, pourcentages d'affinité, explications, tags thématiques), ce qui supprime tout risque d'erreurs d'analyse JSON sur le terminal client.
3.  **Persistance Locale Pragmatique** : Les séances de génération de curation, les profils d'humeur saisis ainsi que les favoris de l'utilisateur sont entièrement persistés localement via `localStorage`.

---

## 🛠️ Stack technique & Architecture

L'application est structurée selon un modèle **Full-Stack (Client/Serveur)** moderne de production :

*   **Frontend** :
    *   **React 18** & environnement de développement rapide **Vite**.
    *   **Tailwind CSS v4** : Pour une gestion millimétrée du design responsive.
    *   **Lucide-React** : Pack d'iconographie vectorielle épuré.
    *   **Motion (Framer)** : Staggering de l'apparition des cartes d'œuvres et animations fluides.
*   **Backend** :
    *   **Express.js (Node.js)** : Serveur d'API agissant en tant que reverse-proxy sécurisé. **La clé d'API de l'IA (Gemini) reste strictement stockée côté serveur**, évitant sa fuite lors du chargement de l'IHM dans le client.
    *   **@google/genai SDK** : Utilisation de la dernière bibliothèque officielle stable en TypeScript.
*   **Indicateurs Qualitatifs** :
    *   Entièrement typé en **TypeScript** avec validation stricte du compilateur (`tsc --noEmit`).

---

## Installation locale

Suivez ces étapes simples pour démarrer le projet sur votre ordinateur :

### 1. Prérequis
Assurez-vous d'avoir installé [Node.js](https://nodejs.org/) (version 18 ou supérieure) sur votre système.

### 2. Clonage et installation
Extrayez l'archive ou clonez le dépôt, puis installez les paquets requis :
```bash
git clone https://github.com/votre-compte/matchmuse-llm-curator.git
cd matchmuse-llm-curator
npm install
```

### 3. Configurer l'environnement (Clé API)
Pour que la génération fonctionne, le serveur Express requiert une clé API Google Gemini :
1. Obtenez une clé API gratuite en quelques secondes sur [Google AI Studio](https://aistudio.google.com/).
2. Créez un fichier `.env` à la racine de votre projet en copiant l'exemple :
   ```bash
   cp .env.example .env
   ```
3. Ouvrez le fichier `.env` et ajoutez-y votre clé :
   ```env
   GEMINI_API_KEY="AIzaSyC..." # Remplacer par votre clé API réelle
   ```
   
### 4. Démarrage de l'application
Démarrez le serveur de développement unifié :
```bash
npm run dev
```
Ouvrez ensuite votre navigateur internet sur **[http://localhost:3000](http://localhost:3000)**.

### 5. Build de production & lancement
```bash
npm run build
npm start
```

---

## 🕹️ Guide d'utilisation

1.  **Exploration d'Accueil** : Découvrez les vedettes de la semaine et filtrez les catégories depuis la barre supérieure de navigation.
2.  **Configuration du Profil d'Affinité** :
    *   Allez sur la catégorie de votre choix (ex: *Musique*).
    *   Cliquez sur **Ajuster le Curateur IA**.
    *   Saisissez vos préférences (humeur actuelle, curseur de complexité, œuvre d'ancre, description d'atmosphère libre).
    *   Cliquez sur le bouton de génération pour interroger l'IA.
3.  **Sauvegarde de Sessions** : Sauvegardez vos curations favorites pour y réaccéder plus tard instantanément via la section d'historique en bas de page.

---

## Demonstration

 ### **Main page** : exploration d'acceuil 
<img width="1916" height="848" alt="image" src="https://github.com/user-attachments/assets/5f58b46c-4244-43d9-a531-86a005c23602" />
<img width="1646" height="561" alt="image" src="https://github.com/user-attachments/assets/9045d2d9-54b9-4544-9153-568f83bb9903" />

 ### **The recommendation system: 3 categories (films, books, music)

  ### **exemple: recommendation des filmes**
 ### 1. Formulaire de configuration du profil
on va tester la categorie Cinéma ( toute la demonstration sera disponible dans video demo ) 
<img width="1688" height="829" alt="image" src="https://github.com/user-attachments/assets/3507e203-02e2-40ea-8736-877eaf3604fc" />

### 2. Suggestions personnalisées générées par l'IA
                                                  
 <img width="1802" height="861" alt="image" src="https://github.com/user-attachments/assets/2cfc850c-b9ce-4c3c-b39a-b41b22fe08d8" />


 ### **main page updated**
<img width="1778" height="826" alt="image" src="https://github.com/user-attachments/assets/aecd9ce6-12e4-4645-90f2-6b19d046139e" />














