import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Add ngrok skip browser warning header for all requests
  // This helps when making API calls from external tools or scripts
  response.headers.set('ngrok-skip-browser-warning', '69420');

  // Handle CORS for ngrok domains
  const origin = request.headers.get('origin');
  if (origin && origin.includes('ngrok-free.app')) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, ngrok-skip-browser-warning');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
