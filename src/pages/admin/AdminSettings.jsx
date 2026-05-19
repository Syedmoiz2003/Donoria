import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Shield, Save, Key, BellRing, Database } from "lucide-react";
import { toast } from "sonner";

const AdminSettings = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ur';
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    systemName: "Donoria Network",
    maxRadius: "100",
    enableAutoBroadcasting: true,
    requireMultiDocVerify: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(isRtl ? "سسٹم کی ترتیبات محفوظ ہو گئی ہیں!" : "System settings updated successfully!");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/dashboard" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>{isRtl ? "ڈیش بورڈ پر واپس" : "Back to Dashboard"}</span>
            </Link>
          </Button>
          <h1 className="font-semibold text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            {isRtl ? "ایڈمنسٹریٹر ترتیبات" : "System Administration"}
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Settings Form */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="healthcare-card">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Core Settings */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                {isRtl ? "بنیادی سسٹم ترتیبات" : "Core System Parameters"}
              </h3>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">{isRtl ? "نیٹ ورک کا نام" : "Network Name"}</label>
                <Input 
                  type="text" 
                  value={settings.systemName} 
                  onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Smart Broadcasting Limits */}
            <div className="space-y-4 pt-4">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <BellRing className="w-4 h-4 text-secondary" />
                {isRtl ? "براڈکاسٹ کی حدود" : "Safety Verification Rules"}
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl border border-border bg-muted/20">
                  <div>
                    <p className="text-xs font-bold text-foreground">{isRtl ? "خودکار الرٹس کی اجازت دیں" : "Enable Auto-Broadcasting"}</p>
                    <p className="text-[10px] text-muted-foreground">{isRtl ? "تصدیق شدہ ہسپتالوں کو الرٹ بھیجنے کی خودکار اجازت دیں۔" : "Permit verified medical institutions to broadcast immediately."}</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings.enableAutoBroadcasting}
                    onChange={(e) => setSettings({ ...settings, enableAutoBroadcasting: e.target.checked })}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl border border-border bg-muted/20">
                  <div>
                    <p className="text-xs font-bold text-foreground">{isRtl ? "سخت دستاویزات کی تصدیق" : "Require Multi-Doc Verification"}</p>
                    <p className="text-[10px] text-muted-foreground">{isRtl ? "ہسپتالوں کی رجسٹریشن کے لیے متعدد دستاویزات لازمی قرار دیں۔" : "Verify clinical compliance before activating credentials."}</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings.requireMultiDocVerify}
                    onChange={(e) => setSettings({ ...settings, requireMultiDocVerify: e.target.checked })}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Save */}
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              <Save className="w-4 h-4" />
              {loading 
                ? (isRtl ? "تبدیلیاں محفوظ ہو رہی ہیں..." : "Saving Parameters...") 
                : (isRtl ? "سیٹنگز محفوظ کریں" : "Apply Administrator Overrides")}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
