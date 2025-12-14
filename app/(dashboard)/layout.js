import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({ children })
{
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <div className="p-4 flex items-center gap-4">
                    <SidebarTrigger />
                    <span className="font-semibold">لوحة التحكم</span>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}
