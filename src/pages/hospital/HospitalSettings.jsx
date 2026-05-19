import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Settings, Save, MapPin } from "lucide-react";
import { toast } from "sonner";

const HospitalSettings = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ur';
  const [loading, setLoading] = useState(false);

  const [radius, setRadius] = useState("25");
  const [phone, setPhone] = useState("+92 300 1234567");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(isRtl ? "ہسپتال کی ترتیبات کامیابی سے اپ ڈیٹ ہو گئیں!" : "Settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/hospital/dashboard" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>{isRtl ? "ڈیش بورڈ پر واپس" : "Back to Dashboard"}</span>
            </Link>
          </Button>
          <h1 className="font-semibold text-lg flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            {isRtl ? "ہسپتال کی ترتیبات" : "Institution Parameters"}
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main settings container */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="healthcare-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Radius Configuration */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{isRtl ? "تلاش کا دائرہ (کلومیٹر)" : "Donor Search Radius (km)"}</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    className="flex-1 accent-primary cursor-pointer"
                  />
                  <span className="font-bold text-lg text-foreground w-12 text-right">
                    {radius}km
                  </span>
                </div>
              </div>

              {/* Coordinator contact */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {isRtl ? "ہنگامی رابطہ نمبر" : "Active Emergency Coordinator Contact"}
                </label>
                <Input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            {/* Submit settings */}
            <Button type="submit" className="w-full gap-2 py-6 text-sm font-bold bg-primary hover:bg-primary/90" disabled={loading}>
              <Save className="w-4 h-4" />
              {loading 
                ? (isRtl ? "تبدیلیاں محفوظ ہو رہی ہیں..." : "Applying parameters...") 
                : (isRtl ? "تبدیلیاں محفوظ کریں" : "Apply Administrator Overrides")}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default HospitalSettings;
