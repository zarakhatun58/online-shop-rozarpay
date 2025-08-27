import express from 'express';
import path from 'path';

const app = express();
const PORT = 5123

// Serve static files from the Vite build output
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'dist')));

// For SPA: redirect all unknown routes to index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Frontend server running on port ${PORT}`);
});
