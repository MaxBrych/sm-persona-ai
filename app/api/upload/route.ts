import { createServerSupabase } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "Only images are allowed" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "png";
  const fileName = `chat-uploads/${crypto.randomUUID()}.${ext}`;

  const supabase = createServerSupabase();
  const { error } = await supabase.storage
    .from("images")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from("images")
    .getPublicUrl(fileName);

  return Response.json({
    url: urlData.publicUrl,
    mediaType: file.type,
    filename: file.name,
  });
}
