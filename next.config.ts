import type { NextConfig } from "next";
import path from "path";

// ─────────────────────────────────────────────────────────────────────────────
// Consolidate WhatsApp microservice directly inside Next.js Node process!
// This saves a massive 130MB of RAM by avoiding a duplicate V8 engine.
// ─────────────────────────────────────────────────────────────────────────────
const phase = process.env.NEXT_PHASE;
const isNextBuild = phase === 'phase-production-build' || process.argv.some(arg => arg.includes('build') || arg.includes('lint'));
const isNextStart = !isNextBuild && (
  phase === 'phase-development-server' || 
  phase === 'phase-production-server' || 
  process.argv.includes('start') || 
  process.argv.includes('dev') || 
  process.argv.some(arg => arg.includes('start-server.js'))
);

console.log('[Next.js Config] NEXT_PHASE is:', phase, 'isNextStart (server runtime):', isNextStart, 'isNextBuild (build/lint):', isNextBuild);

if (isNextStart && typeof window === 'undefined') {
  console.log('[Next.js Config] Spawning in-process WhatsApp service inside Next.js Node process instantly...');
  try {
    const servicePath = path.join(process.cwd(), 'whatsapp-service.js');
    eval('require')(servicePath);
    console.log('[Next.js Config] WhatsApp service loaded inside Next.js successfully!');
  } catch (err) {
    console.error('[Next.js Config] Error loading WhatsApp service in-process:', err);
  }
}



const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      }
    ],
  },
};

export default nextConfig;

