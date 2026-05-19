import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, Shield, UserCog } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Settings = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/donor/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{t('healthChatbot.backToDashboard') || 'Back to Dashboard'}</span>
              </Button>
            </Link>
          </div>
          <h1 className="font-semibold text-lg">Settings & Notifications</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          <div className="p-6 bg-card border rounded-xl flex items-start gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Notifications</h2>
              <p className="text-muted-foreground mb-4">Manage how you receive alerts for critical blood and organ requests in your area.</p>
              <Button variant="outline">Manage Preferences</Button>
            </div>
          </div>
          
          <div className="p-6 bg-card border rounded-xl flex items-start gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Privacy & Security</h2>
              <p className="text-muted-foreground mb-4">Update your password and secure your account.</p>
              <Button variant="outline">Security Settings</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
