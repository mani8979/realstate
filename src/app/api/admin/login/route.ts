import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    // Artificial delay to deter brute-force attacks
    await new Promise(resolve => setTimeout(resolve, 1000));

    let adminUsername = (process.env.ADMIN_USERNAME || '').trim();
    let adminPassword = (process.env.ADMIN_PASSWORD || '').trim();

    // Strip surrounding quotes if the user entered them in Vercel settings
    if (adminUsername.startsWith('"') && adminUsername.endsWith('"')) {
      adminUsername = adminUsername.slice(1, -1);
    } else if (adminUsername.startsWith("'") && adminUsername.endsWith("'")) {
      adminUsername = adminUsername.slice(1, -1);
    }

    if (adminPassword.startsWith('"') && adminPassword.endsWith('"')) {
      adminPassword = adminPassword.slice(1, -1);
    } else if (adminPassword.startsWith("'") && adminPassword.endsWith("'")) {
      adminPassword = adminPassword.slice(1, -1);
    }

    if (username === adminUsername && password === adminPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
