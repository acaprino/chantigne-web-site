# Chantigne — Bar Pasticceria

Sito vetrina della **Pasticceria Chantigne** di Acquedolci (ME).

> *Il dolce tempo delle cose fatte bene.*

## Contatti

- **Indirizzo:** Corso Italia, 79 — 98070 Acquedolci (ME), Sicilia
- **Telefono:** [+39 0941 727249](tel:+390941727249)
- **Instagram:** [@pasticceria_chantigne](https://www.instagram.com/pasticceria_chantigne/)

## Stack

Sito statico, vanilla. Nessuna build chain.

- `index.html` — markup completo (nav, hero, marquee, specialità, storia, eventi, galleria, testimonianze, prenotazione, footer)
- `styles.css` — design tokens, layout, animazioni, responsive (1024 / 760 / 420 px)
- `app.js` — drawer mobile, tab specialità, slider testimonianze, form prenotazione
- `img/` — foto reali della pasticceria in WebP

## Avvio locale

```bash
python -m http.server 8000
# poi apri http://localhost:8000/
```

## Note

- I dati di indirizzo, telefono, Instagram sono reali. Email, orari, recensioni e sezioni "eventi & catering" usano valori provvisori da rifinire.
- Le immagini sono in WebP (~1 MB totali) generate dai PNG originali (~35 MB).
