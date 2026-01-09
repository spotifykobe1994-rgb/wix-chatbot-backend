import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message || "Ciao";

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Rispondi in modo chiaro e semplice."
            },
            {
              role: "user",
              content: userMessage
            }
          ],
        }),
      }
    );

    const data = await response.json();

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Errore server" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server attivo sulla porta " + PORT);
});
