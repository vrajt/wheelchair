"use client"; // For form interactions

import React, { useState } from 'react';
import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: "Wheelchair Rental Hub",
    maintenanceMode: false,
    defaultCurrency: "USD",
    itemsPerPage: 10,
    adminEmail: "admin@example.com",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
     setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Settings saved:", settings);
    toast({
      title: "Settings Saved",
      description: "Your changes have been successfully saved.",
      className: "bg-green-500 text-white",
    });
  };

  return (
    <>
      <PageTitle title="System Settings" />
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage basic site configurations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" name="siteName" value={settings.siteName} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="adminEmail">Administrator Email</Label>
                <Input id="adminEmail" name="adminEmail" type="email" value={settings.adminEmail} onChange={handleInputChange} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-xs text-muted-foreground">
                        Temporarily disable public access to the site.
                    </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSwitchChange('maintenanceMode', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Localization &amp; Display</CardTitle>
              <CardDescription>Configure currency and display preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="defaultCurrency">Default Currency</Label>
                 <Select name="defaultCurrency" value={settings.defaultCurrency} onValueChange={(value) => handleSelectChange('defaultCurrency', value)}>
                    <SelectTrigger id="defaultCurrency">
                        <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="itemsPerPage">Items Per Page (Tables)</Label>
                <Input id="itemsPerPage" name="itemsPerPage" type="number" value={settings.itemsPerPage} onChange={handleInputChange} min="5" max="50" />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Save Settings
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
