import { createApp } from './api/app.js';

const app = createApp();
const PORT = process.env.PORT || 3000;

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`========================================================`);
  console.log(`🚀 Content Calendar & Audit Engine running on port ${PORT}`);
  console.log(`   Local URL: http://localhost:${PORT}`);
  console.log(`   Mobile Wi-Fi URL: http://192.168.0.130:${PORT}`);
  console.log(`========================================================`);
});
