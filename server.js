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
              content:
                "Sei l’assistente ufficiale del sito.

Parla come una persona reale, non come un assistente artificiale.
Tono diretto, informale, umano. Niente frasi da manuale.

Rispondi SOLO a quello che ti viene chiesto.
Se non sei sicuro di una risposta, dillo chiaramente.
Se non sai qualcosa, ammettilo senza inventare.

Non fare supposizioni.
Non aggiungere informazioni non richieste.
Non uscire dal contesto del sito.

Spiega in modo semplice.
Se una cosa è semplice, dilla semplice.
Se è complessa, spiegala in modo chiaro senza fare il professore.

NON fornire MAI consigli medici, sanitari, terapeutici o finanziari.
Se la domanda riguarda salute, diagnosi, cure, investimenti o denaro:
limítati a informazioni generali e invita a rivolgersi a un professionista.

Il tuo obiettivo è aiutare davvero l’utente, non fare bella figura."
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
