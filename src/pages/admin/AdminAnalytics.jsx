import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Activity, ShieldAlert, BarChart3, TrendingUp, Users, Heart, CheckCircle2 } from "lucide-react";

const AdminAnalytics = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ur';

  const stats = [
    { label: isRtl ? "کل رجسٹرڈ ڈونرز" : "Total Network Donors", value: "52,480", growth: "+450 this week" },
    { label: isRtl ? "تصدیق شدہ ہسپتال" : "Verified Hospitals", value: "215", growth: "+4 new approvals" },
    { label: isRtl ? "بچائی گئی زندگیاں" : "Lives Transformed", value: "12,480", growth: "All-time network impact" },
    { label: isRtl ? "فعال ہنگامی درخواستیں" : "Active Emergency Alerts", value: "47", growth: "Real-time broadcasts" },
  ];

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
            <Activity className="w-5 h-5 text-primary" />
            {isRtl ? "نیٹ ورک اینالیٹکس" : "System Analytics"}
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Core Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="healthcare-card">
              <p className="text-xs text-muted-foreground font-semibold mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-foreground mb-2">{stat.value}</h3>
              <span className="text-[10px] text-success font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                {stat.growth}
              </span>
            </div>
          ))}
        </div>

        {/* Analytics Breakdown */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* regional distributions */}
          <div className="healthcare-card">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-foreground">
              <Heart className="w-5 h-5 text-primary" />
              {isRtl ? "صوبائی سطح پر فعال ڈونرز" : "Regional Active Donor Ratio"}
            </h3>

            <div className="space-y-4">
              {[
                { region: "Punjab", percentage: 45, color: "bg-red-500" },
                { region: "Sindh", percentage: 28, color: "bg-primary" },
                { region: "KPK", percentage: 17, color: "bg-secondary" },
                { region: "Balochistan / Capital", percentage: 10, color: "bg-muted-foreground/30" },
              ].map((item) => (
                <div key={item.region} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-foreground">
                    <span>{item.region}</span>
                    <span>{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full`} 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* network emergency speed */}
          <div className="healthcare-card">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-foreground">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
              {isRtl ? "نیٹ ورک رسپانس کی رفتار" : "Emergency Broadcast Response Time"}
            </h3>

            <div className="space-y-4">
              {[
                { label: isRtl ? "پہلا ڈونر رسپانس (10 منٹ کے اندر)" : "Under 10 Mins Response Rate", rate: "84%" },
                { label: isRtl ? "تصدیق شدہ مماثلت کی شرح" : "Successful Clinical Match Ratio", rate: "91%" },
                { label: isRtl ? "عطیہ کی حاضری" : "Final Attendance Verification", rate: "88%" },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-xl border border-border bg-muted/20 flex justify-between items-center">
                  <span className="text-sm font-semibold text-muted-foreground">{item.label}</span>
                  <span className="text-lg font-black text-primary">{item.rate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
