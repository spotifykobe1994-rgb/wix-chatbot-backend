const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Dimmi qualcosa sul tuo terrarium 🌿" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
Sei Shi.Ku.Dama Assistant.
Sei un esperto assoluto di terrarium (chiusi e aperti), muschi, condensa,
umidità, muffe, luce e manutenzione.

Rispondi sempre in modo tecnico, chiaro e concreto.
Non chiedere dettagli inutili.
Se la domanda è generale, spiega comunque in modo completo.
Niente frasi promozionali.
`
    },
    {
      role: "user",
      content: userMessage
    }
  ],
  temperature: 0.4
})

    const data = await response.json();

const reply = data.choices[0].message.content;

return res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Errore del server" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server AI attivo sulla porta", PORT);
});
