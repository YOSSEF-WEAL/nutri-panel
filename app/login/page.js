"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginClient } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialError = searchParams?.get("error") || null;
  const [error, setError] = useState(initialError);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      console.log("[AUTH][client] submitting:", {
        identifier: formData.get("identifier"),
        // do not log password
      });
    } catch {}
    const res = await loginClient(formData);
    try {
      console.log("[AUTH][client] result:", res);
    } catch {}
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error || "حدث خطأ");
      return;
    }
    router.replace(res.redirect || "/");
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50 direction-rtl">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
          <CardDescription>
            أدخل بريدك الإلكتروني وكلمة المرور للمتابعة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="identifier">اسم المستخدم / البريد الإلكتروني</Label>
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="email"
                  placeholder="username أو name@example.com"
                  required
                  className="text-right"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="text-right"
                />
              </div>
              {error ? (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="text-sm text-destructive"
                >
                  {error}
                </div>
              ) : null}

              <div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "جاري الدخول..." : "دخول"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2"></CardFooter>
      </Card>
    </div>
  );
}
