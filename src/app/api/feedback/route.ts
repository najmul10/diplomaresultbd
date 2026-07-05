import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory feedback store (resets on serverless cold start).
// For production persistence on Vercel, swap with Vercel Postgres / KV.
const feedbackStore: Array<{
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}> = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: { count: feedbackStore.length },
  });
}

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; subject?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const subject = (body.subject || "").trim();
  const message = (body.message || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { success: false, error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return NextResponse.json(
      { success: false, error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  if (message.length < 10) {
    return NextResponse.json(
      { success: false, error: "Message must be at least 10 characters." },
      { status: 400 }
    );
  }

  const entry = {
    id: `fb-${Date.now()}`,
    name,
    email,
    subject: subject || "(no subject)",
    message,
    createdAt: new Date().toISOString(),
  };
  feedbackStore.push(entry);

  return NextResponse.json({
    success: true,
    data: { id: entry.id, message: "Thank you! Your message has been received." },
  });
}
