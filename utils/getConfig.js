const fs = require('fs').promises;
const path = require('path');

async function getConfig() {
  try {
    let filePath = path.join(__dirname, '../config.json');

    // Check if running in production (like on Vercel)
    if (process.env.NODE_ENV === 'production') {
      filePath = path.join(process.cwd(), 'config.json');
    }

    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Error reading JSON file: ${error.message}`);
  }
}

module.exports = getConfig;
