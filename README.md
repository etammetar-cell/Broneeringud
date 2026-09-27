# Fetch API kodutöö

Veebileht laadib broneeringud Fetch API abil aadressilt `https://metshein.com/kordamine/json/broneeringud.json`. HTML-is on ainult tabeli päis; kõik tabeliread loob JavaScript.





## Nõuete täitmine

- `fetch(API_URL)` laadib JSON-andmed õpetaja antud veebiaadressilt.
- Tabel leitakse DOM-ist `querySelector` abil.
- HTML sisaldab enne JavaScripti ainult tabeli struktuuri ja päiseid.
- JavaScript genereerib veerud Klient, Teenus, Kuupäev ja Kellaaeg.
- Igal teenusel on eraldi CSS-klass ja taustavärv.
- Lisadena on otsing, teenusefilter, sortimine, statistika, värskendamine ning veatöötlus.
