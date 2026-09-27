# Fetch API kodutöö

Veebileht laadib broneeringud Fetch API abil aadressilt `https://metshein.com/kordamine/json/broneeringud.json`. HTML-is on ainult tabeli päis; kõik tabeliread loob JavaScript.

## Käivitamine

Fetch ei tööta korrektselt, kui avada `index.html` otse failina. Käivita kaust kohaliku veebiserveriga, näiteks VS Code'i Live Serveri laiendusega.

## GitHub Pages

1. Loo GitHubis uus repositoorium.
2. Laadi kõik selle kausta failid repositooriumi juurkausta.
3. Ava **Settings → Pages**.
4. Vali **Deploy from a branch**, haru **main** ja kaust **/(root)**.
5. Salvesta ja oota, kuni GitHub kuvab veebilehe aadressi.

## Nõuete täitmine

- `fetch(API_URL)` laadib JSON-andmed õpetaja antud veebiaadressilt.
- Tabel leitakse DOM-ist `querySelector` abil.
- HTML sisaldab enne JavaScripti ainult tabeli struktuuri ja päiseid.
- JavaScript genereerib veerud Klient, Teenus, Kuupäev ja Kellaaeg.
- Igal teenusel on eraldi CSS-klass ja taustavärv.
- Lisadena on otsing, teenusefilter, sortimine, statistika, värskendamine ning veatöötlus.
