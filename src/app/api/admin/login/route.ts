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

    // DIAGNOSTIC: Log lengths and first/last chars to Vercel Function Logs
    console.log('[AUTH_DIAG] envUser len:', adminUsername.length, '| first:', adminUsername.charCodeAt(0), '| last:', adminUsername.charCodeAt(adminUsername.length - 1));
    console.log('[AUTH_DIAG] envPass len:', adminPassword.length, '| first:', adminPassword.charCodeAt(0), '| last:', adminPassword.charCodeAt(adminPassword.length - 1));
    console.log('[AUTH_DIAG] inputUser len:', username.length, '| first:', username.charCodeAt(0), '| last:', username.charCodeAt(username.length - 1));
    console.log('[AUTH_DIAG] inputPass len:', password.length, '| first:', password.charCodeAt(0), '| last:', password.charCodeAt(password.length - 1));
    console.log('[AUTH_DIAG] userMatch:', username === adminUsername, '| passMatch:', password === adminPassword);

    if (username === adminUsername && password === adminPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
