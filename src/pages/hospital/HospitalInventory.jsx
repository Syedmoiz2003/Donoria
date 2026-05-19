import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Plus, Minus, ShieldAlert, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const initialStock = [
  { bloodType: "A+", bags: 12, status: "safe" },
  { bloodType: "A-", bags: 2, status: "critical" },
  { bloodType: "B+", bags: 15, status: "safe" },
  { bloodType: "B-", bags: 4, status: "low" },
  { bloodType: "AB+", bags: 8, status: "safe" },
  { bloodType: "AB-", bags: 1, status: "critical" },
  { bloodType: "O+", bags: 22, status: "safe" },
  { bloodType: "O-", bags: 3, status: "critical" },
];

const HospitalInventory = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ur';
  const [stock, setStock] = useState(initialStock);

  const handleAdjustStock = (bloodType, amount) => {
    setStock(prev => prev.map(s => {
      if (s.bloodType === bloodType) {
        let newBags = Math.max(0, s.bags + amount);
        let newStatus = newBags <= 3 ? "critical" : newBags <= 6 ? "low" : "safe";
        return { ...s, bags: newBags, status: newStatus };
      }
      return s;
    }));
    toast.success(isRtl 
      ? `${bloodType} اسٹاک کی کامیاب ایڈجسٹمنٹ!` 
      : `Inventory adjustment for ${bloodType} successful!`);
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
          <h1 className="font-semibold text-lg">
            {isRtl ? "بلڈ بنک انوینٹری" : "Blood Bank Stock Matrix"}
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Matrix */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stock.map((item) => (
            <div 
              key={item.bloodType} 
              className={`healthcare-card !p-5 text-center relative overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] ${
                item.status === "critical" 
                  ? "border-destructive/30 bg-destructive/[0.02]" 
                  : item.status === "low" 
                  ? "border-warning/30 bg-warning/[0.02]" 
                  : "border-border"
              }`}
            >
              <span className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${
                item.status === "critical" ? "bg-destructive animate-ping" : item.status === "low" ? "bg-warning" : "bg-success"
              }`} />

              <h2 className="text-3xl font-black text-foreground mb-1">{item.bloodType}</h2>
              
              <p className="text-2xl font-bold text-foreground mb-4">
                {item.bags} <span className="text-xs text-muted-foreground font-semibold">{isRtl ? "یونٹس" : "Bags"}</span>
              </p>

              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => handleAdjustStock(item.bloodType, -1)} 
                  variant="outline" 
                  size="icon" 
                  className="w-8 h-8 rounded-lg"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => handleAdjustStock(item.bloodType, 1)} 
                  variant="outline" 
                  size="icon" 
                  className="w-8 h-8 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {item.status === "critical" && (
                <p className="text-[10px] text-destructive font-bold uppercase tracking-wider mt-3 flex items-center justify-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {isRtl ? "فوری ضرورت" : "Critical Shortage"}
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HospitalInventory;
