import type { NextConfig } from "next";
import path from "path";

// ─────────────────────────────────────────────────────────────────────────────
// Consolidate WhatsApp microservice directly inside Next.js Node process!
// This saves a massive 130MB of RAM by avoiding a duplicate V8 engine.
// ─────────────────────────────────────────────────────────────────────────────
const isNextStart = process.argv.includes('start') || process.argv.some(arg => arg.endsWith('next'));
const isNextBuild = process.argv.includes('build');

if (isNextStart && !isNextBuild && typeof window === 'undefined') {
  console.log('[Next.js Config] Spawning in-process WhatsApp service inside Next.js Node process...');
  setTimeout(() => {
    try {
      const servicePath = path.join(process.cwd(), 'whatsapp-service.js');
      eval('require')(servicePath);
      console.log('[Next.js Config] WhatsApp service loaded inside Next.js successfully!');
    } catch (err) {
      console.error('[Next.js Config] Error loading WhatsApp service in-process:', err);
    }
  }, 15000); // 15 second delay to let Next.js fully pass initial health checks first
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

