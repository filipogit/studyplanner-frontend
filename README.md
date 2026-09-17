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

API:et startar på `https://localhost:5001`.

## Funktioner

- Visa alla studieuppgifter i en lista
- Skapa nya uppgifter med titel, beskrivning och deadline
- Redigera befintliga uppgifter och markera som klara
- Ladda upp filer till uppgifter
- Felmeddelanden visas om något går fel mot API:et
- Responsiv design som fungerar på mobil och desktop

## Tekniska val

### React med Vite
Vite valdes som byggverktyg för snabb utveckling med hot module replacement. React ger en komponentbaserad struktur som gör koden lätt att underhålla.

### CSS med Flexbox och Grid
Layouten använder CSS Grid för formuläret (två kolumner på desktop, en på mobil) och Flexbox för uppgiftslistan och övrig layout. Inga externa CSS-ramverk behövs.

### Felhantering
Alla API-anrop är wrappade i try/catch. Vid fel visas ett tydligt meddelande som användaren kan stänga, istället för att appen kraschar.
