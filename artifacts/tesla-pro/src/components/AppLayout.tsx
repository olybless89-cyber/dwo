import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { clearToken } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { 
  LayoutDashboard, 
  CreditCard, 
  Gift, 
  ShoppingBag, 
  Hexagon, 
  Settings,
  ShieldAlert,
  Users,
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: LayoutProps) {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading } = useGetMe();
  const logoutMutation = useLogout();

  if (isLoading) {
    return <div className="min-h-[100dvh] bg-background flex items-center justify-center"><LoadingSpinner /></div>;
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        clearToken();
        setLocation("/login");
      }
    });
  };

  const isAdmin = user.role === "admin";
  
  const userLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/card", label: "Digital Card", icon: CreditCard },
    { href: "/entries", label: "Giveaway Entries", icon: Gift },
    { href: "/orders", label: "My Orders", icon: ShoppingBag },
    { href: "/assets", label: "Digital Assets", icon: Hexagon },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const adminLinks = [
    { href: "/admin/overview", label: "Command Center", icon: ShieldAlert },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 border-r border-border bg-card/30 hidden md:flex flex-col">
        <div className="h-24 flex items-center px-8">
          <Link href="/dashboard" className="font-sans font-bold tracking-[0.2em] text-lg text-white hover:text-primary transition-colors cursor-pointer">
            TESLA PRO
          </Link>
        </div>

        <div className="px-8 pb-8 pt-4">
          <div className="flex items-center gap-4 mb-2">
            <Avatar className="h-12 w-12 border border-white/10">
              <AvatarFallback className="bg-primary/20 text-primary">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-white">{user.firstName} {user.lastName}</div>
              <div className="text-xs text-primary font-medium tracking-wider uppercase mt-1">
                {isAdmin ? "Administrator" : "Premium Member"}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = location === link.href || location.startsWith(link.href + "/");
            const Icon = link.icon;
            
            return (
              <Link key={link.href} href={link.href}>
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-colors cursor-pointer group relative",
                  isActive 
                    ? "text-white bg-white/5" 
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-md" />}
                  <Icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{link.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-white"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-card/50">
        {children}
      </main>
    </div>
  );
}
