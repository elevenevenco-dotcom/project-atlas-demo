import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "Eleven Even Studio API Ready",
  });
}
