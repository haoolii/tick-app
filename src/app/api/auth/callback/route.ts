import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url || "");
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) {
      return NextResponse.json({ error: "Code parameter is missing" }, { status: 400 });
    }

    if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.REDIRECT_URL || !process.env.BASE_URL) {
      return NextResponse.json({ error: "Environment variables are missing" }, { status: 500 });
    }

    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.set(
      "Authorization",
      "Basic " +
        Buffer.from(
          `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
        ).toString("base64")
    );

    const urlencoded = new URLSearchParams();
    urlencoded.append("code", code);
    urlencoded.append("scope", "tasks:write tasks:read");
    urlencoded.append("grant_type", "authorization_code");
    urlencoded.append("redirect_uri", process.env.REDIRECT_URL);

    const response = await fetch("https://ticktick.com/oauth/token", {
      method: "POST",
      headers,
      body: urlencoded,
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`Error fetching token: ${response.statusText}`);
    }

    const json = await response.json();

    if (json.access_token) {
      const cookieStore = cookies();
      cookieStore.set("authorization", JSON.stringify(json, null, 2));
    }

    return NextResponse.redirect(process.env.BASE_URL);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
