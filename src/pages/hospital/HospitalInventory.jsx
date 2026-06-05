import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Plus, Minus, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { hospitalApi } from "@/lib/api";

const bloodGroups = ["A", "B", "AB", "O"];
const rhFactors = ["+", "-"];

const HospitalInventory = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ur';
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await hospitalApi.getInventory();
      
      // Map backend data to our matrix structure, ensuring all types are represented
      const matrix = [];
      bloodGroups.forEach(bg => {
        rhFactors.forEach(rh => {
          const bloodType = `${bg}${rh}`;
          const existing = data.find(item => item.blood_group === bg && item.rh_factor === rh);
          matrix.push({
            bloodType,
            bg,
            rh,
            bags: existing ? existing.quantity : 0,
            status: existing ? (existing.quantity <= 3 ? "critical" : existing.quantity <= 6 ? "low" : "safe") : "critical"
          });
        });
      });
      
      setStock(matrix);
    } catch (error) {
      toast.error(isRtl ? "انوینٹری لوڈ کرنے میں ناکامی" : "Failed to load inventory");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStock = async (item, amount) => {
    try {
      const newBags = Math.max(0, item.bags + amount);
      
      await hospitalApi.updateInventory({
        blood_group: item.bg,
        rh_factor: item.rh,
        quantity: newBags
      });

      setStock(prev => prev.map(s => {
        if (s.bloodType === item.bloodType) {
          const newStatus = newBags <= 3 ? "critical" : newBags <= 6 ? "low" : "safe";
          return { ...s, bags: newBags, status: newStatus };
        }
        return s;
      }));

      toast.success(isRtl 
        ? `${item.bloodType} اسٹاک کی کامیاب ایڈجسٹمنٹ!` 
        : `Inventory adjustment for ${item.bloodType} successful!`);
    } catch (error) {
      toast.error(isRtl ? "ایڈجسٹمنٹ میں ناکامی" : "Adjustment failed");
      console.error(error);
    }
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
          <div className="w-10">
            {loading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
          </div>
        </div>
      </header>

      {/* Matrix */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {loading && stock.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground">{isRtl ? "لوڈ ہو رہا ہے..." : "Synchronizing stock data..."}</p>
          </div>
        ) : (
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
                    onClick={() => handleAdjustStock(item, -1)} 
                    variant="outline" 
                    size="icon" 
                    className="w-8 h-8 rounded-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => handleAdjustStock(item, 1)} 
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
        )}
      </main>
    </div>
  );
};

export default HospitalInventory;
