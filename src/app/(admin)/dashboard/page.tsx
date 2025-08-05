
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Accessibility, ShoppingCart, MapPin, LineChart as LineChartIcon, PieChart as PieChartIcon } from "lucide-react";
import { PageTitle } from "@/components/page-title";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Legend as RechartsLegend } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { format, parse } from 'date-fns';

// Define interfaces for the fetched data
interface DashboardSummary {
  totalUsers: number;
  activeUsers: number;
  totalCities: number;
  totalWheelchairs: number;
  totalOrders: number;
  rentOrdersByStatus: { order_status: string; count: string }[];
  transactionsByStatus: { transaction_status: string; count: string }[];
}

interface MonthlyOrder {
    month: string; // e.g., "2025-06"
    order_count: number;
}


const PIE_CHART_COLORS = ['#3F51B5', '#9C27B0', '#FFC107', '#4CAF50', '#F44336'];


export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [monthlyOrders, setMonthlyOrders] = useState<MonthlyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [summaryRes, monthlyOrdersRes] = await Promise.all([
          fetch(`${baseUrl}/admin/api/getDashboardSummary`),
          fetch(`${baseUrl}/admin/api/getMonthlyRentalOrderCount`) // Assuming this is the new endpoint
        ]);

        const summaryData = await summaryRes.json();
        const monthlyOrdersData = await monthlyOrdersRes.json();

        if (summaryData.success) {
          setSummary(summaryData.data);
        }
        if (monthlyOrdersData.success) {
          setMonthlyOrders(monthlyOrdersData.data);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl]);

  const overviewItems = summary ? [
    { title: "Total Users", value: summary.totalUsers, icon: Users },
    { title: "Total Wheelchairs", value: summary.totalWheelchairs, icon: Accessibility },
    { title: "Total Rentals", value: summary.totalOrders, icon: ShoppingCart },
    { title: "Service Cities", value: summary.totalCities, icon: MapPin },
  ] : [];

  const rentStatusData = summary?.rentOrdersByStatus.map(item => ({
    name: item.order_status,
    value: parseInt(item.count, 10),
  })) || [];
  
  const monthlyData = monthlyOrders.map(item => ({
    month: format(parse(item.month, 'yyyy-MM', new Date()), 'MMM yy'),
    orders: Number(item.order_count),
  }));

  if (loading) {
    return (
      <>
        <PageTitle title="Dashboard Overview" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
           <Skeleton className="h-80 w-full" />
           <Skeleton className="h-80 w-full" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle title="Dashboard Overview" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {overviewItems.map((item) => (
          <Card key={item.title} className="shadow-lg border-l-4 border-primary transition-transform transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <item.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{item.value?.toLocaleString() || '0'}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg"><PieChartIcon className="mr-2 h-5 w-5 text-accent" />Rental Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={rentStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {rentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} className="focus:outline-none focus:ring-2 focus:ring-ring" />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent hideLabel />} />
                    <RechartsLegend iconSize={12} />
                  </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg"><LineChartIcon className="mr-2 h-5 w-5 text-accent" />Monthly Rental Orders</CardTitle>
          </CardHeader>
          <CardContent>
             <ChartContainer config={{ orders: { label: "Orders", color: "hsl(var(--primary))" } }} className="h-72 w-full">
                <ResponsiveContainer>
                    <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <defs>
                          <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} activeDot={{r: 6}}/>
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

