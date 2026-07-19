import { useGetMe, useListOrders } from "@workspace/api-client-react";
import { AppLayout } from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { DollarSign, Gift, Star, Users, ArrowRight, ShoppingBag } from "lucide-react";
import { format } from "date-fns";

export default function DashboardPage() {
  const { data: user } = useGetMe();
  const { data: orders } = useListOrders({ userId: user?.id });

  if (!user) return null;

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-tight mb-2 text-white">
              Welcome back, <span className="font-medium">{user.firstName}</span>
            </h1>
            <p className="text-muted-foreground">Your premium ecosystem is ready.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white tracking-[0.1em] uppercase font-medium rounded-sm h-11 px-8 signal-glow">
            Browse Marketplace
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Available Balance" 
            value={`$${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={<DollarSign className="text-primary" />} 
          />
          <StatCard 
            title="Active Entries" 
            value={user.rewardPoints > 500 ? 5 : 2} 
            icon={<Gift className="text-primary" />} 
          />
          <StatCard 
            title="Reward Points" 
            value={user.rewardPoints.toLocaleString()} 
            icon={<Star className="text-primary" />} 
          />
          <StatCard 
            title="Referrals" 
            value={user.referralCount} 
            icon={<Users className="text-primary" />} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          {/* Left Column - Digital Card */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Digital Identity</h3>
            <Card className="glass overflow-hidden border-white/10 relative group aspect-[1.58/1]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0" />
              {/* Card texture/pattern could go here */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
              
              <CardContent className="p-6 md:p-8 flex flex-col h-full justify-between relative z-10">
                <div className="flex justify-between items-start">
                  <div className="font-sans font-bold tracking-[0.2em] text-lg text-white">TESLA PRO</div>
                  <div className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest rounded-sm border border-primary/20">
                    Premium
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Member Code</div>
                  <div className="font-mono text-lg text-white tracking-widest opacity-80 mb-6">{user.memberCode || "TP-0000-0000"}</div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white font-medium border border-white/20">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-muted-foreground">Joined {format(new Date(user.createdAt), "yyyy")}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Giveaways & Activity */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Active Draws</h3>
              <Card className="glass border-white/10 p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-[100px] -mr-16 -mt-16 pointer-events-none" />
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-1 space-y-4 w-full">
                    <div>
                      <div className="text-primary text-sm font-bold uppercase tracking-widest mb-1">Draw #42</div>
                      <h4 className="text-2xl font-light text-white mb-2">Tesla Model S Plaid</h4>
                      <p className="text-muted-foreground text-sm">You currently have 5 entries in this draw. The draw takes place on Dec 31, 2025.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Entry Progress</span>
                        <span className="text-white font-medium">5 / 10 Entries</span>
                      </div>
                      <Progress value={50} className="h-2 bg-white/5" />
                    </div>
                    
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 tracking-[0.1em] uppercase font-medium rounded-sm mt-2 w-full sm:w-auto">
                      Get More Entries
                    </Button>
                  </div>
                  
                  {/* Visual placeholder for the car */}
                  <div className="w-full md:w-1/3 aspect-[4/3] bg-gradient-to-br from-white/5 to-white/0 rounded-lg border border-white/5 flex items-center justify-center relative overflow-hidden">
                    <div className="text-muted-foreground/50 rotate-[-10deg] font-bold text-xl tracking-widest">PLAID</div>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Recent Activity</h3>
                <Button variant="link" className="text-primary p-0 h-auto font-normal hover:no-underline hover:text-primary/80">
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
              
              <Card className="glass border-white/10">
                <CardContent className="p-0">
                  {orders && orders.length > 0 ? (
                    <div className="divide-y divide-white/5">
                      {orders.slice(0, 4).map(order => (
                        <div key={order.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                              {order.type === 'giveaway' ? <Gift className="h-4 w-4 text-primary" /> : 
                               order.type === 'investment' ? <DollarSign className="h-4 w-4 text-emerald-500" /> :
                               <ShoppingBag className="h-4 w-4 text-blue-500" />}
                            </div>
                            <div>
                              <div className="text-white font-medium">{order.description}</div>
                              <div className="text-xs text-muted-foreground">{format(new Date(order.createdAt), "MMM dd, yyyy")}</div>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-1">
                            <div className="font-mono text-white">${order.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                            <StatusBadge status={order.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      No recent activity found.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
