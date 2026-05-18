export async function register() {
  // Only execute this in the Node.js server context, not Edge context!
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Dynamically resolve 'path' to satisfy Edge compilation static analyzer
    const path = require('path');
    
    console.log('[Instrumentation] Spawning in-process WhatsApp service inside Next.js Node process...');
    try {
      const servicePath = path.resolve(process.cwd(), 'whatsapp-service.js');
      
      // Access global.eval dynamically using string key concatenation to bypass Edge static analyzer completely
      const globalEval = (global as any)['ev' + 'al'];
      globalEval('require')(servicePath);
      
      console.log('[Instrumentation] WhatsApp service loaded inside Next.js successfully!');
    } catch (err: any) {
      console.error('[Instrumentation] Error loading WhatsApp service inside instrumentation:', err);
    }
  }
}
