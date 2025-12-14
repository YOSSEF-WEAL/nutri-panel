import Link from "next/link"
import { Button } from "@/components/ui/button"
import
{
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage()
{
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
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">البريد الإلكتروني</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    className="text-right"
                                />
                            </div>
                            <div className="grid gap-2">

                                <Input id="password" type="password" required className="text-right" />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button type="submit" className="w-full">
                        دخول
                    </Button>

                </CardFooter>
            </Card>
        </div>
    )
}
