import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Shield } from "lucide-react";

const Privacy = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ur';

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>{isRtl ? "ہوم پر واپس جائیں" : "Back to Home"}</span>
            </Link>
          </Button>
          <h1 className="font-semibold text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            {isRtl ? "پرائیویسی پالیسی" : "Confidentiality & Security"}
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="healthcare-card space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">1. {isRtl ? "طبی معلومات کا تحفظ" : "PHI Protection Protocols"}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isRtl 
                ? "آپ کا تمام طبی ڈیٹا، بشمول خون اور اعضاء کے گروپ کی معلومات، جدید انکرپشن ٹیکنالوجی کے تحت محفوظ رکھا جاتا ہے۔" 
                : "Protected Health Information (PHI) is isolated using military-grade AES-256 state encryption protocols. Your matching profiles are only visible to certified healthcare coordinators during emergency operations."}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">2. {isRtl ? "معلومات کی شیئرنگ" : "Regulatory Sharing Disclosures"}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isRtl 
                ? "طبی معلومات صرف اور صرف متعلقہ اور تصدیق شدہ ہسپتالوں کے ساتھ میچنگ کے وقت شیئر کی جاتی ہیں۔" 
                : "Information is solely transmitted to verified surgical units or medical emergency clinics who require matching stats to save patient lives."}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">3. {isRtl ? "صارف کا حق" : "Donor Privacy Controls"}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isRtl 
                ? "ہر ڈونر کو اختیار حاصل ہے کہ وہ کسی بھی وقت اپنے پروفائل کو عارضی طور پر معطل یا مستقل حذف کر سکے۔" 
                : "Every donor maintains the sovereign right to suspend profile matching, opt-out of emergency broadcasts, or permanently purge health records from our system at any index."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
