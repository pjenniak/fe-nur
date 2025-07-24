import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";

export const DashboardLayout = ({ children, childredHeader, title }) => {
  useAuth();
  return (
    <div className="flex w-full">
      <AppSidebar />
      <div className="flex flex-col gap-4 w-full min-h-screen px-4 md:px-8 py-8">
        <SidebarTrigger />
        <div className="flex flex-row justify-between">
          <h1 className="text-3xl font-bold">{title}</h1>
          <div>{childredHeader}</div>
        </div>
        <div className="w-full flex flex-col gap-2">{children}</div>
      </div>
    </div>
  );
};
