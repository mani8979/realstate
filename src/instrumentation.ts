export async function register() {
  // Only execute this in the Node.js server context, not Edge context!
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Only launch during live startup or local development, NOT during static build pre-rendering!
    const isDev = process.env.NODE_ENV === 'development';
    const isStart = process.env.IS_NEXT_START === 'true';
    if (!isDev && !isStart) {
      console.log('[Instrumentation] Skipping WhatsApp service boot during compilation/build phase.');
      return;
    }

    console.log('[Instrumentation] Spawning in-process WhatsApp service inside Next.js Node process...');
    try {
      // Dynamically import 'module' to obtain createRequire (bypasses Edge static analysis)
      const { createRequire } = await import('module');
      const localRequire = createRequire(process.cwd() + '/package.json');
      
      // Require the service relative to project root
      localRequire('./whatsapp-service.js');
      console.log('[Instrumentation] WhatsApp service loaded inside Next.js successfully!');
    } catch (err: any) {
      console.error('[Instrumentation] Error loading WhatsApp service inside instrumentation:', err.message);
    }
  }
}
