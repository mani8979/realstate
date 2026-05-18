console.log('Testing launch of whatsapp-service.js...');
try {
  require('../whatsapp-service.js');
  console.log('Successfully loaded whatsapp-service.js!');
} catch (err) {
  console.error('Launch threw error:', err);
}
