# 🚀 Setup GitHub Pages - American Odyssey

Ospita l'app online su GitHub Pages gratuitamente!

---

## 📋 Step 1: Crea un Repository su GitHub

1. Vai su https://github.com/new
2. Nome repository: **`american-odyssey`**
3. Descrizione: "Travel Expense Manager with GitHub Sync"
4. **Public** ✓ (necessario per GitHub Pages)
5. Clicca **"Create repository"**

---

## 📥 Step 2: Carica i File

### Opzione A: Tramite Web GitHub

1. Nel repository, clicca **"Add file" → "Upload files"**
2. Seleziona questi file:
   - `app.html` (è il file american_odyssey_COMPLETE_v3.html rinominato)
   - `index.html`
   - `_config.yml`
   - `README.md`
   - `IPHONE_SINCRONIZZAZIONE.md`
   - `BACKUP_SOLO_GITHUB.md`

3. Clicca **"Commit changes"**

### Opzione B: Tramite Git (Terminale)

```bash
git clone https://github.com/TUO_USERNAME/american-odyssey.git
cd american-odyssey
# Copia i file qui
git add .
git commit -m "Initial commit: American Odyssey app"
git push origin main
```

---

## ⚙️ Step 3: Abilita GitHub Pages

1. Nel repository, vai su **Settings** (tab in alto)
2. Cerca **"Pages"** nella sidebar sinistra
3. Sotto **"Source"**:
   - Branch: **`main`**
   - Folder: **`/ (root)`**
4. Clicca **"Save"**

GitHub Pages farà il deploy automaticamente! ✅

---

## 🌐 Step 4: Accedi all'App

L'app sarà disponibile a:

```
https://TUO_USERNAME.github.io/american-odyssey/
```

Ad esempio:
```
https://andrea-rossi.github.io/american-odyssey/
```

**Prova il link!** Dovrebbe aprire l'app. 🎉

---

## 📱 Step 5: USA su iPhone

### Apri l'App:
1. Apri Safari su iPhone
2. Vai all'indirizzo: `https://TUO_USERNAME.github.io/american-odyssey/`
3. L'app si apre!

### Aggiungi a Home Screen:
1. Clicca l'icona **"Condividi"** (freccia su)
2. Seleziona **"Aggiungi a Home Screen"**
3. Dai un nome (es. "American Odyssey")
4. **"Aggiungi"**

Ora l'app appare come icona sulla home screen! 📱

---

## 🔄 Sincronizzazione PC ↔ iPhone

### Su PC:
1. Apri: `https://TUO_USERNAME.github.io/american-odyssey/`
2. Aggiungi spese
3. Menu → "☁️ Backup Spese → GitHub"
4. Inserisci token (prima volta)
5. "💾 Backup Ora"
6. ✅ Token salvato

### Su iPhone:
1. Apri lo **stesso link** da Safari
2. Menu → "☁️ Backup Spese → GitHub"
3. Token è **già compilato** ✓
4. "📥 Ripristina"
5. ✅ Dati del PC su iPhone!

---

## 📝 Verifica Che Tutto Funzioni

### Check 1: L'app si apre?
```
https://TUO_USERNAME.github.io/american-odyssey/
```
Se sì → ✅

### Check 2: La sincronizzazione funziona?
1. PC: Aggiungi una spesa → Backup
2. iPhone: Ripristina
3. Se vedi la spesa → ✅

### Check 3: Aggiunta a home screen (iPhone)?
1. Safari → Condividi → "Aggiungi a Home Screen"
2. Appare come icona → ✅

---

## ⚠️ Troubleshooting

### "Pagina non trovata" (404)
→ L'URL è sbagliato. Verifica il nome del repository.
→ Formato corretto: `https://USERNAME.github.io/american-odyssey/`

### "Backup non funziona"
→ Assicurati che il token GitHub sia valido
→ Su GitHub → Settings → Token settings, verifica che lo scope sia `repo`

### "Su iPhone non si apre"
→ Assicurati che il repository sia **Public** (non Private)
→ GitHub Pages non funziona con repository privati (è una limitazione GitHub)

### "App carica ma è lenta"
→ Normale per la prima volta. GitHub Pages talvolta è lento.
→ Refresh il browser.

---

## 📌 Passo Finale: Condividi il Link

Se vuoi condividere l'app con altri (Monica, amici, etc.):

```
https://TUO_USERNAME.github.io/american-odyssey/
```

Chiunque apra questo link può usare l'app!

---

## 🔒 Note sulla Privacy

Se il repository è **Public** (necessario per GitHub Pages):
- Chiunque conosce il link può **usare l'app**
- I dati delle spese sono **su GitHub in repository privati** (non nel repository dell'app)
- L'app stessa è pubblica, ma i tuoi dati rimangono privati

---

## ✅ Checklist Finale

- [ ] Ho creato il repository `american-odyssey`
- [ ] Ho caricato i file nel repository
- [ ] Ho abilitato GitHub Pages
- [ ] L'app si apre su: `https://TUO_USERNAME.github.io/american-odyssey/`
- [ ] Ho testato su PC ✅
- [ ] Ho testato su iPhone ✅
- [ ] Ho aggiunto l'app a home screen (iPhone)
- [ ] La sincronizzazione funziona ✅

---

## 🎉 Fatto!

La tua app è online e accessibile da qualsiasi dispositivo!

**PC + iPhone sincronizzati via GitHub.** 🚀

Buon viaggio! 🌍✈️
