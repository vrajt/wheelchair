import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wheelchair, ShoppingCart, CreditCard, Star, MapPin, AlertTriangle } from "lucide-react";
import { PageTitle } from "@/components/page-title";

const overviewItems = [
  { title: "Total Users", value: "1,234", icon: Users, change: "+5%", changeType: "positive" as const, hint: "active users" },
  { title: "Pending KYC", value: "56", icon: AlertTriangle, change: "+2", changeType: "neutral" as const, hint: "kyc verification" },
  { title: "Active Rentals", value: "78", icon: ShoppingCart, change: "-3%", changeType: "negative" as const, hint: "rented wheelchairs" },
  { title: "Total Transactions", value: "$56,789", icon: CreditCard, change: "+10%", changeType: "positive" as const, hint: "financial transactions" },
  { title: "Average Rating", value: "4.5", icon: Star, change: "+0.1", changeType: "positive" as const, hint: "customer reviews" },
  { title: "Service Cities", value: "12", icon: MapPin, change: "+1", changeType: "positive" as const, hint: "operational cities" },
];

export default function DashboardPage() {
  return (
    <>
      <PageTitle title="Dashboard Overview" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {overviewItems.map((item) => (
          <Card key={item.title} className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <item.icon className="h-5 w-5 text-muted-foreground" aria-label={item.hint} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{item.value}</div>
              <p className={`text-xs ${item.changeType === 'positive' ? 'text-green-600' : item.changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground'} pt-1`}>
                {item.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                {user: "Alice", action: "rented Model X", time: "5m ago"},
                {user: "Bob", action: "submitted KYC", time: "15m ago"},
                {user: "Charlie", action: "left a 5-star review", time: "1h ago"},
              ].map(activity => (
                <li key={activity.action} className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{activity.user}</span> {activity.action} - <span className="text-xs">{activity.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-medium text-foreground">API:</span> <span className="text-green-600">Operational</span></p>
              <p className="text-sm"><span className="font-medium text-foreground">Database:</span> <span className="text-green-600">Operational</span></p>
              <p className="text-sm"><span className="font-medium text-foreground">Payment Gateway:</span> <span className="text-yellow-600">Degraded Performance</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
