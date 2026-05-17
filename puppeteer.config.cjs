const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Configures the cache directory to be local inside the project root
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
