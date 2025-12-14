export default function DoctorPage()
{
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
                    بحث الملفات
                </div>
                <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
                    احصائيات المرضى
                </div>
                <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
                    المواعيد القادمة
                </div>
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
                <h1 className="text-2xl font-bold mb-4">لوحة تحكم الطبيب</h1>
                <p>مرحباً بك دكتور، هنا يمكنك إدارة المرضى والمواعيد.</p>
            </div>
        </div>
    )
}
