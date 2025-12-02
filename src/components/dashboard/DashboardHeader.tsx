import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserMenu } from "./UserMenu";

export const DashboardHeader = () => {
  return (
    <header className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-card/50">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns, members, rewards..."
            className="pl-10 bg-background/50"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
        </Button>

        <div className="h-8 w-px bg-border"></div>

        <UserMenu />
      </div>
    </header>
  );
};
