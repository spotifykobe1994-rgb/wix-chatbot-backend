import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage =
  req.body.message ||
  req.body.text ||
  req.body.input ||
  req.body.query ||
  "";
console.log("USER MESSAGE RICEVUTO:", userMessage);
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
Sei l’assistente esperto di Shi.Ku.Dama.

Non sei un venditore e non rispondi con frasi promozionali generiche.
Il tuo compito è educare, guidare e accompagnare l’utente nel mondo dei terrarium.

Se un utente chiede “cos’è un terrarium”:
- spiega in modo chiaro e tecnico
- descrivi cos’è un ecosistema in miniatura
- spiega la differenza tra terrarium aperto e chiuso
- parla di equilibrio tra luce, acqua, aria e piante
- usa esempi concreti
- fai almeno UNA domanda di approfondimento all’utente

Rispondi sempre come un esperto di:
- terrarium
- muschi
- piante tropicali
- substrati
- gestione dell’umidità
- condensa
- muffe
- manutenzione nel tempo

Il tuo tono è:
- calmo
- profondo
- competente
- ispirato alla filosofia di Shi.Ku.Dama

NON usare frasi come:
“I nostri terrarium sono realizzati con cura”
“Ogni pezzo è unico”
“Perfetto per decorare”

Queste frasi sono VIETATE.

Se l’utente fa una domanda tecnica, entra nel dettaglio.
Se la domanda è vaga, fai domande per capire meglio.
Se l’utente è inesperto, guidalo passo passo.
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

    let reply = "Dimmi qualcosa in più sul tuo terrarium.";

if (
  data &&
  data.choices &&
  data.choices[0] &&
  data.choices[0].message &&
  typeof data.choices[0].message.content === "string"
) {
  reply = data.choices[0].message.content;
}
console.log("RISPOSTA INVIATA A WIX:", reply);
res.json({
  reply,
  answer: reply,
  text: reply,
  message: reply
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Errore server" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log("Chatbot attivo sulla porta " + PORT)
);
