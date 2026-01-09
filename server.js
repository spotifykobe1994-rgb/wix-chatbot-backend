import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    // 🔹 Recupero messaggio utente (compatibile con Wix)
    const userMessage =
      req.body.message ||
      req.body.text ||
      req.body.input ||
      req.body.query;

    if (!userMessage) {
      return res.json({
        reply: "Dimmi qualcosa sul tuo terrarium e ti aiuto volentieri."
      });
    }

    console.log("🟢 Messaggio utente:", userMessage);

    // 🔹 Chiamata OpenAI — API CORRETTA
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

Sei un ESPERTO di:
- terrarium aperti e chiusi
- muschi (ecologia, crescita, equilibrio)
- gestione dell’umidità e della condensa
- luce, substrati, ventilazione
- manutenzione nel tempo

NON sei un venditore.
NON usare frasi promozionali.
NON dire mai:
- "I nostri terrarium sono realizzati con cura"
- "Ogni pezzo è unico"
- "Perfetto per decorare"

Il tuo compito è:
- spiegare in modo chiaro e tecnico
- entrare nel dettaglio quando serve
- fare almeno UNA domanda di approfondimento
- guidare passo passo chi è inesperto

Tono:
calmo, competente, profondo, ispirato alla filosofia Shi.Ku.Dama.
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

    console.log("🧠 Risposta OpenAI RAW:", JSON.stringify(data, null, 2));

    let reply =
      data?.output_text ||
      "Dimmi qualcosa in più sul tuo terrarium (chiuso o aperto, dimensioni, da quanto tempo è attivo).";

    console.log("📤 Risposta inviata a Wix:", reply);

    // 🔹 Risposta compatibile con Wix
    res.json({
      reply,
      answer: reply,
      text: reply,
      message: reply
    });

  } catch (error) {
    console.error("❌ Errore server:", error);
    res.status(500).json({
      reply: "C’è stato un problema tecnico. Riprova tra poco."
    });
  }
});

// 🔹 Avvio server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Chatbot attivo sulla porta ${PORT}`);
});
