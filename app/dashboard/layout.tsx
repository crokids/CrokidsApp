import { Suspense } from "react";
import Spinner from "@/components/ui/spinner";
import DashboardLoader from "@/components/dashboard/dashboard-loader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Spinner />}>
      <DashboardLoader>{children}</DashboardLoader>
    </Suspense>
  );
}