const express = require('express');
const cors = require('cors');
const cryptoRoutes = require('./routes/crypto');

const app = express();
app.use(cors());
app.use(express.json());

// All crypto API routes
app.use('/', cryptoRoutes);



const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
