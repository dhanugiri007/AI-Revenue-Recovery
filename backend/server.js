require('dotenv').config();
require('dns').setServers(['8.8.8.8','8.8.4.4']);
const app = require('./src/app');
const connectDB = require('./src/config/db');

connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});