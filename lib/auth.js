export async function loginClient(input) {
  let payload;
  if (typeof FormData !== "undefined" && input instanceof FormData) {
    payload = Object.fromEntries(input.entries());
  } else if (typeof input === "object" && input) {
    payload = input;
  } else {
    throw new Error("Invalid login payload");
  }

  const res = await fetch(`/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || data?.message || "Login failed";
    return { ok: false, error: msg };
  }
  return { ok: true, ...data };
}
