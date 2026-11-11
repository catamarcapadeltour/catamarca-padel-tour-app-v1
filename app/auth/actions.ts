"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function safeNextPath(value: FormDataEntryValue | null) {
  const path = typeof value === "string" ? value : "/mi-cuenta";
  return path.startsWith("/") && !path.startsWith("//") ? path : "/mi-cuenta";
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));
  if (!email || !password) redirect("/ingresar?error=Completa%20email%20y%20contrase%C3%B1a");

  let client;
  try { client = await createClient(); } catch { redirect("/ingresar?error=Supabase%20a%C3%BAn%20no%20est%C3%A1%20configurado"); }
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) redirect(`/ingresar?error=${encodeURIComponent("No se pudo iniciar sesión. Revisa tus datos e inténtalo nuevamente.")}`);
  redirect(next);
}

export async function signUp(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (fullName.length < 2 || !email || password.length < 8) {
    redirect("/registro?error=Completa%20los%20campos%20y%20usa%20una%20contrase%C3%B1a%20de%208%20caracteres%20o%20m%C3%A1s");
  }

  let client;
  try { client = await createClient(); } catch { redirect("/registro?error=Supabase%20a%C3%BAn%20no%20est%C3%A1%20configurado"); }
  const { error } = await client.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
  if (error) redirect(`/registro?error=${encodeURIComponent("No se pudo crear la cuenta. Verifica el email e inténtalo nuevamente.")}`);
  redirect("/registro?created=1");
}

export async function signOut() {
  const client = await createClient();
  await client.auth.signOut();
  redirect("/");
}

export async function updateProfile(formData: FormData) {
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/ingresar");

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const city = String(formData.get("city") ?? "Catamarca").trim();
  if (fullName.length < 2) redirect("/mi-cuenta?error=El%20nombre%20debe%20tener%20al%20menos%202%20caracteres");

  const { error } = await client.from("profiles").upsert({ id: user.id, full_name: fullName, phone: phone || null, city: city || "Catamarca" });
  if (error) redirect("/mi-cuenta?error=No%20se%20pudo%20guardar%20el%20perfil.%20Configura%20el%20esquema%20de%20Supabase.");
  revalidatePath("/mi-cuenta");
  redirect("/mi-cuenta?saved=1");
}
