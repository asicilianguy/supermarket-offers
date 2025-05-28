# RisparmiApp - Applicazione per Offerte dei Supermercati

RisparmiApp è un'applicazione full-stack che centralizza le offerte dei prodotti dei supermercati, aiutando gli utenti a risparmiare tempo e denaro sulla spesa quotidiana.

## Struttura del Progetto

Il progetto è diviso in due parti principali:

- **client**: Frontend costruito con Next.js
- **server**: Backend costruito con Express.js e MongoDB

## Tecnologie Utilizzate

### Frontend
- Next.js (App Router)
- Redux Toolkit e RTK Query
- Tailwind CSS
- Framer Motion per le animazioni
- React Three Fiber per le animazioni 3D

### Backend
- Express.js
- MongoDB con Mongoose
- JWT per l'autenticazione
- Bcrypt per la crittografia delle password

## Funzionalità Principali

- Registrazione e login utenti
- Gestione della lista della spesa
- Visualizzazione delle offerte per supermercato, reparto, marca
- Ricerca di prodotti in offerta
- Suggerimenti di offerte basati sulla lista della spesa
- Visualizzazione delle migliori offerte

## Installazione e Avvio

### Prerequisiti
- Node.js (v14 o superiore)
- MongoDB

### Server
\`\`\`bash
cd server
npm install
npm run dev
\`\`\`

### Client
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

## Variabili d'Ambiente

### Server (.env)
\`\`\`
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret
PORT=3001
\`\`\`

### Client (.env.local)
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3001/api
\`\`\`

## Struttura del Database

### Collezioni
- **User**: Informazioni utente, lista della spesa e supermercati frequentati
- **ProductOffer**: Dettagli delle offerte dei prodotti

## Scraping dei Volantini

Il server include rotte predisposte per lo scraping dei volantini dei supermercati. La logica di scraping deve essere implementata manualmente per ciascun supermercato.

## Scalabilità

L'applicazione è progettata per essere facilmente scalabile:
- Aggiunta di nuovi supermercati
- Nuovi criteri di raggruppamento per le offerte
- Espansione delle funzionalità utente

## Licenza

Questo progetto è proprietario e non è disponibile per l'uso pubblico senza autorizzazione.
