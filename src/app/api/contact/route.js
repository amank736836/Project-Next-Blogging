import { NextResponse } from "next/server";

// BUG-010 fix: a real backend for the contact form.
// In production this would forward to a mail provider (SendGrid, Resend, etc.).
// For now it logs the message server-side and returns success — the important
// thing is that the client actually makes a network request.

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, message, topic } = body;

        // Basic validation (mirrors the client-side rules).
        if (!name || typeof name !== "string" || name.trim().length < 2) {
            return NextResponse.json(
                { error: "Please provide your name (at least 2 characters)." },
                { status: 400 }
            );
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
            return NextResponse.json(
                { error: "Please provide a valid email address." },
                { status: 400 }
            );
        }
        if (!message || typeof message !== "string" || message.trim().length < 12) {
            return NextResponse.json(
                { error: "Please provide a message (at least 12 characters)." },
                { status: 400 }
            );
        }

        // Log the message. In production, replace this with a mail API call.
        console.log(
            `[Contact] topic=${topic || "A bug"} from=${name} <${email}>: ${message.trim()}`
        );

        return NextResponse.json({ ok: true, message: "Message received" });
    } catch (error) {
        console.error("POST /api/contact error:", error);
        return NextResponse.json(
            { error: "Could not send your message. Please try again." },
            { status: 500 }
        );
    }
}
