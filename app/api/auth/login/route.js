import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const body = await req.json();
    const identifier = body?.identifier || body?.email;
    const password = body?.password;

    if (!identifier || !password) {
      return Response.json(
        { error: { message: "الرجاء إدخال البريد الإلكتروني وكلمة المرور" } },
        { status: 400 }
      );
    }

    const base = process.env.NEXT_STRAPI_URL;
    console.log("[AUTH] Using NEXT_STRAPI_URL:", base);

    if (!base) {
      return Response.json(
        { error: { message: "Server config error: NEXT_STRAPI_URL not set" } },
        { status: 500 }
      );
    }

    // ========================================
    // خطوة 1: تسجيل الدخول
    // ========================================
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
    } catch (e) {
      console.error("[AUTH] Network error calling /auth/local:", e);
      return Response.json(
        { error: { message: "تعذر الاتصال بخادم المصادقة" } },
        { status: 502 }
      );
    }
    console.log("[AUTH] Login response:", {
      status: res.status,
      hasJWT: !!data?.jwt,
    });
    console.log(
      "[AUTH] Full user data from /auth/local:",
      JSON.stringify(data.user, null, 2)
    );

    if (!res.ok) {
      const msg = data?.error?.message || data?.message || "فشل تسجيل الدخول";
      return Response.json({ error: { message: msg } }, { status: res.status });
    }

    if (!data?.jwt || !data?.user?.id) {
      console.error("[AUTH] Missing jwt or user.id in /auth/local response", {
        hasJWT: !!data?.jwt,
        hasUser: !!data?.user,
        userKeys: data?.user ? Object.keys(data.user) : [],
      });
      return Response.json(
        { error: { message: "استجابة غير صحيحة من الخادم (لا يوجد JWT أو معرف مستخدم)" } },
        { status: 500 }
      );
    }

    const isProd = process.env.NODE_ENV === "production";
    const jwt = data.jwt;
    const userId = data.user.id;

    // ========================================
    // خطوة 2: حفظ JWT
    // ========================================
    try {
      cookies().set({
        name: "token",
        value: jwt,
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        path: "/",
      });
    } catch (e) {
      console.error("[AUTH] Failed to set token cookie:", e);
    }

    // ========================================
    // خطوة 3: جلب بيانات المستخدم الكاملة عبر /users/me?populate=role
    // ========================================
    let roleName = "";
    try {
      const meRes = await fetch(`${base}/api/users/me?populate=role`, {
        headers: { Authorization: `Bearer ${jwt}` },
        cache: "no-store",
      });
      const me = await meRes.json();
      console.log("[AUTH] /users/me status:", meRes.status);
      if (process.env.DEBUG_AUTH === "verbose") {
        console.log("[AUTH] /users/me payload:", JSON.stringify(me, null, 2));
      }
      if (meRes.ok) {
        // حسب الصورة: الدور يأتي كـ me.role.name
        roleName = me?.role?.name || me?.role?.type || "";
      } else {
        console.warn("[AUTH] /users/me failed:", me);
      }
    } catch (e) {
      console.warn("[AUTH] /users/me error:", e);
    }

    // ========================================
    // خطوة 4: حفظ الدور
    // ========================================
    try {
      cookies().set({
        name: "role",
        value: roleName || "",
        sameSite: "lax",
        secure: isProd,
        path: "/",
      });
    } catch (e) {
      console.error("[AUTH] Failed to set role cookie:", e);
    }

    // ========================================
    // خطوة 5: تحديد الـ redirect
    // ========================================
    let redirectPath = "/doctor"; // Default
    if (roleName) {
      const r = String(roleName).toLowerCase();
      if (r.includes("patient") || r.includes("مريض")) {
        redirectPath = "/patient";
      } else if (r.includes("doctor") || r.includes("طبيب")) {
        redirectPath = "/doctor";
      }
    }

    console.log("[AUTH] Final result:", {
      userId,
      username: data.user?.username,
      roleName,
      redirectPath,
    });

    return Response.json({
      ok: true,
      role: roleName,
      redirect: redirectPath,
    });
  } catch (err) {
    console.error("[AUTH] Unexpected error:", err);
    const message = err?.message || "تعذر معالجة الطلب. حاول لاحقاً";
    return Response.json({ error: { message } }, { status: 500 });
  }
}
