'use client';

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LogOut, Copy, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleCopyUid = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Account Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email Address</label>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border">
              <span className="text-sm text-foreground flex-1">{user?.email}</span>
              <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                Verified
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Account ID</label>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border">
              <span className="text-sm text-muted-foreground font-mono flex-1">
                {user?.uid}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyUid}
                className="h-8 w-8 p-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <label className="text-sm font-medium text-foreground">Account Created</label>
            <p className="text-sm text-muted-foreground">
              {user?.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* App Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>App Preferences</CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Dark Mode</p>
              <p className="text-xs text-muted-foreground">
                Automatically follows system preference
              </p>
            </div>
            <div className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
              Auto
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Currency</p>
              <p className="text-xs text-muted-foreground">
                Default currency for new expenses
              </p>
            </div>
            <div className="text-sm font-medium text-foreground">USD</div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Data & Privacy */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>Manage your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your expense and budget data is securely stored in our encrypted database. We never share your information with third parties.
          </p>
          <Button variant="outline" className="w-full" disabled>
            Download My Data
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Danger Zone */}
      <Card className="border-destructive/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Once you sign out, you'll need to sign in again with your email and password.
          </p>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
