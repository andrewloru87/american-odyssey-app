# 🌍 American Odyssey - Travel Expense Manager

Un'app web per gestire le spese di un viaggio di 25 giorni con **sincronizzazione automatica via GitHub**.

## 🚀 Accedi all'App

**👉 Apri nel browser:** `app.html` oppure usa il link GitHub Pages

Apri da qualsiasi dispositivo: **PC, iPhone, Android!**

---

## ✨ Cosa Fa

- 📱 **25 giorni** di viaggio completamente documentati
- 📅 **Timeline** con orari e locazioni
- 🏨 **Prenotazioni** hotel e voli
- 💰 **Gestione spese** con categorizzazione
- 📊 **Grafici** delle spese per categoria
- 💳 **Saldi automatici** tra 2 persone
- ☁️ **Backup automatico** su GitHub
- 📲 **Sincronizzazione** PC ↔ iPhone
- 📱 **Offline capable** (funziona senza internet)

---

## 🔄 Sincronizzazione Multi-Dispositivo

### PC → GitHub → iPhone

1. **Su PC**: Aggiungi spese → Menu → "💾 Backup Ora" ☁️
2. **Su iPhone**: Menu → "📥 Ripristina"
3. **✅ Tutto sincronizzato!**

Le credenziali GitHub si salvano automaticamente nel browser.

---

## 🔑 Setup Iniziale (Una Volta)

1. Crea un **GitHub Personal Access Token**
   - https://github.com/settings/tokens
   - Scope: `repo`
   - Copia il token

2. Apri l'app → Menu → "☁️ Backup Spese → GitHub"
3. Inserisci il token, username, repo
4. Clicca "💾 Backup Ora"
5. ✅ Finito! Token salvato nel browser

---

## 📖 Guide

- **IPHONE_SINCRONIZZAZIONE.md** - Come usare su iPhone
- **BACKUP_SOLO_GITHUB.md** - Guida backup GitHub

---

## 🔐 Sicurezza

✅ **Token salvato solo nel browser** (localStorage)  
✅ **Repository privato** su GitHub  
✅ **Nessun backend** intermedio  
✅ **HTTPS cifrato**  

---

## 📱 Su iPhone

### Aggiungi a Home Screen (Consigliato):
```
Safari → Condividi → Aggiungi a Home Screen
```

L'app appare come vera app nativa! 📱

### Usa Offline:
- L'app funziona completamente offline
- Aggiungi spese senza rete
- Quando hai connessione → Sincronizza su GitHub

---

## 🛠️ Tecnologie

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Storage**: Browser localStorage + GitHub
- **API**: GitHub REST API
- **Hosting**: GitHub Pages (Gratis)
- **Offline**: Service Worker

---

## 🎯 Workflow Consigliato

### Mattina (PC):
- Aggiungi spese della notte
- Menu → "💾 Backup Ora"

### Nel giorno (iPhone):
- Menu → "📥 Ripristina"
- Consulta spese/timeline
- Se aggiungi → Backup

### Sera (PC):
- Ripristina se aggiunte spese su iPhone
- Aggiungi altre spese
- Backup finale

---

## 🎉 Ready?

1. **Apri l'app** (app.html)
2. **Crea un token GitHub** → https://github.com/settings/tokens
3. **Fai il primo backup** (PC)
4. **Su iPhone: Ripristina**
5. **Buon viaggio!** 🌍✈️

---

**Made with ❤️ for travel lovers**
