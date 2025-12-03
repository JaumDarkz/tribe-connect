import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { EngagementChart } from "@/components/dashboard/EngagementChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TopPerformers } from "@/components/dashboard/TopPerformers";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your community engagement and performance
            </p>
          </div>

          {/* TODO: Replace with actual data from backend API */}
          <StatsCards data={null} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* TODO: Replace with actual data from backend API */}
              <EngagementChart weeklyData={null} stats={null} />
            </div>
            <div>
              {/* TODO: Replace with actual data from backend API */}
              <TopPerformers performers={null} />
            </div>
          </div>

          {/* TODO: Replace with actual data from backend API */}
          <RecentActivity activities={null} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
