"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData) {
  const identifier = formData.get("identifier") || formData.get("email");
  const password = formData.get("password");

  const base = process.env.NEXT_STRAPI_URL;
  if (!base) {
    redirect(`/login?error=${encodeURIComponent("Server config error: NEXT_STRAPI_URL not set")}`);
  }

  let res;
  let data;
  try {
    res = await fetch(`${base}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
      cache: "no-store",
    });
    data = await res.json();
  } catch (err) {
    console.error("Network/Fetch error:", err);
    redirect(`/login?error=${encodeURIComponent("تعذر الاتصال بالخادم. حاول لاحقا")}`);
  }

  // log response for debugging
  console.log("Strapi response:", { status: res.status, body: data });

  if (!res.ok) {
    const msg = data?.error?.message || data?.message || "Login failed";
    console.error("Login error:", msg);
    // redirect back to login with error message
    redirect(`/login?error=${encodeURIComponent(msg)}`);
  }

  // set cookies
  const isProd = process.env.NODE_ENV === "production";
  try {
    cookies().set({
      name: "token",
      value: data.jwt,
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
    });
  } catch (e) {
    // ignore non-fatal cookie set errors
  }

  let roleName = "";
  try {
    roleName = data?.user?.role?.name || "";
    cookies().set({ name: "role", value: roleName, path: "/", sameSite: "lax", secure: isProd });
  } catch (e) {}

  console.log("Login success, user:", data.user);
  // Route groups are not part of the URL; existing pages are /doctor and /patient
  let redirectPath = "/doctor";
  if (roleName) {
    const r = String(roleName).toLowerCase();
    if (r.includes("patient")) redirectPath = "/patient";
    else if (r.includes("doctor")) redirectPath = "/doctor";
  }
  redirect(redirectPath);
}
