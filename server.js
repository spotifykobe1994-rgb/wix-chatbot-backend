import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Dimmi qualcosa sul tuo terrarium 🌿" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: `
Sei l’assistente ufficiale di Shi.Ku.Dama.
Sei un esperto assoluto di terrarium (chiusi, aperti, muschi, condensa, muffe, luce, acqua).
Rispondi in modo tecnico, chiaro e concreto.
Niente frasi promozionali.
Aiuta davvero l’utente a prendersi cura del suo terrarium.
`
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    const reply =
      data.output_text ||
      "Sto pensando… puoi darmi un dettaglio in più?";

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Errore del server" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server AI attivo sulla porta", PORT);
});
