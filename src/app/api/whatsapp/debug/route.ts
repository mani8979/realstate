import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cwd = process.cwd();
    const logPath = path.join(cwd, 'whatsapp_server.log');
    let serverLogs = 'File not found';
    
    if (fs.existsSync(logPath)) {
      serverLogs = fs.readFileSync(logPath, 'utf8');
    }

    // Gather basic container health statistics
    const diagnostics = {
      timestamp: new Date().toISOString(),
      cwd,
      filesInCwd: fs.readdirSync(cwd).filter(f => !f.startsWith('.')),
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        WHATSAPP_SERVICE_URL: process.env.WHATSAPP_SERVICE_URL,
      },
      serverLogs,
    };

    return NextResponse.json(diagnostics);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
