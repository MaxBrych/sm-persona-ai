import { createServerSupabase } from "@/lib/supabase/server";
import { SEED_PERSONAS } from "@/lib/personas-data";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = createServerSupabase();

  // Check if personas already exist
  const { data: existing } = await supabase
    .from("personas")
    .select("id")
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json(
      { message: "Personas already seeded", count: existing.length },
      { status: 200 }
    );
  }

  const { data, error } = await supabase
    .from("personas")
    .insert(SEED_PERSONAS)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { message: `Seeded ${data.length} personas`, data },
    { status: 201 }
  );
}
