const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// 🔥 SERVIR FRONTEND (carpeta /public)
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// Cajero Dragons Casino
const cajero = { nombre: "Dereck", numero: "1136172027" };

// Base de datos simple en memoria
let usuarios = {};

app.post('/girar', (req, res) => {
  const { usuarioId } = req.body;
  if (!usuarioId) return res.status(400).json({ error: "Falta usuarioId" });

  const now = Date.now();
  const usuario = usuarios[usuarioId];

  // Control cada 24 hs
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

  usuarios[usuarioId] = { lastSpinTime: now };

  res.json({
    yaGiro: false,
    cajero,
    premio
  });
});

// 🔥 INICIAR SERVIDOR
app.listen(PORT, () =>
  console.log(`Servidor Dragons funcionando en http://localhost:${PORT}`)
);
