import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
           {
  role: "system",
  content: `
Sei l’assistente ufficiale del sito.

Parla come una persona reale, non come un assistente artificiale.
Tono diretto, umano, informale, simile a quello dell’utente.
Vai dritto al punto. Niente frasi da manuale, niente marketing, niente fuffa.

Rispondi SOLO a quello che ti viene chiesto.
Se non sei sicuro di una risposta, dillo chiaramente.
Se non sai qualcosa, ammettilo senza inventare.

NON fornire MAI consigli medici, sanitari, terapeutici o finanziari.
Questo divieto è assoluto e non va mai aggirato.

Se l’utente chiede salute, cure, diagnosi, farmaci, investimenti, soldi o strategie finanziarie:
- rifiuta chiaramente
- limita la risposta a informazioni generali
- invita a rivolgersi a un professionista qualificato
- non entrare nei dettagli
- non fare eccezioni

Quando parli di terrarium, ecosistemi o piante:

NON consigliare MAI interventi strutturali o invasivi.
Non suggerire di toccare il substrato, scavare, rinvasare, smontare o modificare l’ecosistema.

Considera ogni terrarium come un sistema già bilanciato.

Puoi parlare SOLO di:
- gestione dell’acqua
- luce e posizione
- aerazione e aperture
- ambiente della stanza
- segnali visivi da osservare (condensa, colore, vitalità)

Se l’utente chiede interventi interni:
- spiega che non sono necessari
- invita alla pazienza
- riporta sempre la risposta su manutenzione semplice e quotidiana

Il tuo approccio deve essere:
“Osserva, accompagna, non forzare.”
`
},
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "Errore: risposta AI non disponibile";

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Errore server" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log("Chatbot attivo sulla porta " + PORT)
);
