'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Mail, Shield, Bell, Loader2, Save } from 'lucide-react';
import { platformService } from '@/services/platform.service';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

export default function PlatformSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await platformService.getSettingsMap();
      if (response.success) {
        setSettings(response.data);
      }
    } catch (error) {
      toast.error('Failed to load settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await platformService.updateSettings(settings);
      if (response.success) {
        toast.success('Settings updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update settings');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader 
          title="Platform Settings" 
          description="Global configuration for the PathshalaPro platform."
        />
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> Email
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Configuration</CardTitle>
              <CardDescription>Branding and basic platform information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="PLATFORM_NAME">Platform Name</Label>
                  <Input 
                    id="PLATFORM_NAME" 
                    value={settings.PLATFORM_NAME || ''} 
                    onChange={(e) => handleChange('PLATFORM_NAME', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="SUPPORT_EMAIL">Support Email</Label>
                  <Input 
                    id="SUPPORT_EMAIL" 
                    value={settings.SUPPORT_EMAIL || ''} 
                    onChange={(e) => handleChange('SUPPORT_EMAIL', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="CONTACT_PHONE">Contact Phone</Label>
                  <Input 
                    id="CONTACT_PHONE" 
                    value={settings.CONTACT_PHONE || ''} 
                    onChange={(e) => handleChange('CONTACT_PHONE', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="BASE_CURRENCY">Base Currency</Label>
                  <Input 
                    id="BASE_CURRENCY" 
                    value={settings.BASE_CURRENCY || ''} 
                    onChange={(e) => handleChange('BASE_CURRENCY', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Settings</CardTitle>
              <CardDescription>Configure the email server for system notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="SMTP_HOST">SMTP Host</Label>
                  <Input 
                    id="SMTP_HOST" 
                    value={settings.SMTP_HOST || ''} 
                    onChange={(e) => handleChange('SMTP_HOST', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="SMTP_PORT">SMTP Port</Label>
                  <Input 
                    id="SMTP_PORT" 
                    value={settings.SMTP_PORT || ''} 
                    onChange={(e) => handleChange('SMTP_PORT', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="SMTP_USERNAME">SMTP Username</Label>
                  <Input 
                    id="SMTP_USERNAME" 
                    value={settings.SMTP_USERNAME || ''} 
                    onChange={(e) => handleChange('SMTP_USERNAME', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Policies</CardTitle>
              <CardDescription>Manage platform-wide security and authentication rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Multi-Factor Authentication (MFA)</Label>
                  <p className="text-sm text-muted-foreground">Require MFA for all administrative accounts.</p>
                </div>
                <Switch 
                  checked={settings.ENABLE_MFA === 'true'} 
                  onCheckedChange={(checked) => handleChange('ENABLE_MFA', checked.toString())}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="MAX_LOGIN_ATTEMPTS">Max Login Attempts</Label>
                <Input 
                  id="MAX_LOGIN_ATTEMPTS" 
                  type="number"
                  className="max-w-[200px]"
                  value={settings.MAX_LOGIN_ATTEMPTS || ''} 
                  onChange={(e) => handleChange('MAX_LOGIN_ATTEMPTS', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Account will be locked after this many failed attempts.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
