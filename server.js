const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// Cajero Dragons Casino
const cajero = { nombre: "Dereck", numero: "1136172027" };

// Base de datos simple en memoria (IP + User-Agent = usuario único)
let usuarios = {};

function getUserKey(req) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
  const agente = req.headers['user-agent'] || "desconocido";
  return `${ip}_${agente}`;
}

app.post('/girar', (req, res) => {
  const userKey = getUserKey(req);
  const now = Date.now();

  const usuario = usuarios[userKey];

  // Bloqueo 24 hs
  if (usuario && now - usuario.lastSpinTime < 24*60*60*1000) {
    const remaining = 24*60*60*1000 - (now - usuario.lastSpinTime);
    const horas = Math.floor(remaining / (1000*60*60));
    const mins = Math.floor((remaining % (1000*60*60)) / (1000*60));

    return res.json({
      yaGiro: true,
      mensaje: `⏳ Podrás volver a girar en ${horas}h ${mins}m`
    });
  }

  // Premios
  const premios = [
    "10% extra (en la primera carga)",
    "15% extra (en la primera carga)",
    "20% extra (en la primera carga)",
    "30% extra (en la segunda carga)",
    "100 fichas (sin carga, no retirables)",
    "500 fichas (sin carga, no retirables)",
    "300 fichas (sin carga, no retirables)"
  ];

  const premio = premios[Math.floor(Math.random() * premios.length)];

  // Guardar último giro
  usuarios[userKey] = { lastSpinTime: now };

  res.json({
    yaGiro: false,
    cajero,
    premio
  });
});

app.listen(PORT, () =>
  console.log(`Servidor Dragons funcionando en http://localhost:${PORT}`)
);
