import { Suspense } from "react";
import Spinner from "@/components/ui/spinner";
import DashboardLoader from "@/components/dashboard/dashboard-loader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Spinner  fullscreen/>}>
      <div className="min-h-screen bg-background text-foreground">
        <DashboardLoader>{children}</DashboardLoader>
      </div>
    </Suspense>
  );
}