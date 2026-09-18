# StudyPlanner Frontend

Webbapplikation för att hantera studieuppgifter. Byggd med React och Vite.

## Kom igång

### Förutsättningar

- [Node.js](https://nodejs.org/) (version 18 eller nyare)
- Backend-API:et måste vara igång (se [studyplanner](https://github.com/filipogit/studyplanner))

### Starta frontend

```bash
git clone https://github.com/filipogit/studyplanner-frontend.git
cd studyplanner-frontend
npm install
npm run dev
```

Appen öppnas på `http://localhost:5173`.

### Starta backend

```bash
git clone https://github.com/filipogit/studyplanner.git
cd studyplanner
dotnet ef database update
dotnet run
```

API:et startar på `https://localhost:7257`.

## Funktioner

- Skapa, redigera och ta bort studieuppgifter
- Markera uppgifter som klara med bekräftelsedialog
- Tagga uppgifter med ämne/kurs som färgkodas automatiskt
- Ladda upp filer direkt i formuläret eller på befintliga uppgifter
- Bildförhandsvisning för uppladdade bilder
- Detaljsida för varje uppgift med all information
- Sök bland uppgifter på titel och beskrivning
- Filtrera uppgifter (alla, pågående, klara)
- Sortera efter skapad-datum, deadline eller titel
- Deadline-påminnelser som varnar när deadline närmar sig
- Färgkodning för passerade deadlines
- Mörkt läge som sparas mellan sessioner
- Laddningsindikator medan data hämtas
- Formulärvalidering med teckengräns och felmeddelanden
- Responsiv design som fungerar på mobil och desktop

## Tekniska val

### React med Vite
Vite valdes som byggverktyg för snabb utveckling med hot module replacement. React ger en komponentbaserad struktur som gör koden lätt att underhålla och återanvända.

### React Router
React Router används för klient-sidnavigering mellan startsidan och detaljsidor för enskilda uppgifter. Det ger en SPA-upplevelse utan omladdning av sidan.

### CSS med Flexbox och Grid
Layouten använder CSS Grid för formuläret (två kolumner på desktop, en på mobil) och Flexbox för uppgiftslistan och övrig layout. Responsiva breakpoints vid 768px och 1024px anpassar designen för mobil, surfplatta och desktop. Inga externa CSS-ramverk behövs.

### Felhantering
Alla API-anrop är wrappade i try/catch. Vid fel visas ett tydligt meddelande som användaren kan stänga, istället för att appen kraschar.
