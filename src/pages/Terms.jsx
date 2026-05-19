import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const Terms = () => {
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
            <ShieldCheck className="w-5 h-5 text-primary" />
            {isRtl ? "شرائط و ضوابط" : "Terms & Compliance"}
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="healthcare-card space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">1. {isRtl ? "کلینیکل نیٹ ورک قواعد" : "Clinical Network Rules"}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isRtl 
                ? "اس پلیٹ فارم پر درج تمام معلومات کو طبی ضابطہ اخلاق اور ڈیٹا سیکیورٹی کے تحت رکھا جاتا ہے۔ کسی بھی غلط دعوے یا ہسپتال کی رجسٹریشن منسوخ کی جا سکتی ہے۔" 
                : "All health network operations must strictly correspond to healthcare guidelines. Any false credentials supplied by donors or medical entities will result in immediate termination of the accounts."}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">2. {isRtl ? "رضاکارانہ اعضاء اور خون کا عطیہ" : "Voluntary Blood & Organ Care"}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isRtl 
                ? "تمام عطیات خالصتاً انسانی بنیادوں اور رضاکارانہ طور پر ہونے چاہئیں۔ نیٹ ورک پر کسی بھی مالیاتی لین دین کی سخت ممانعت ہے۔" 
                : "Donations initiated on this network are strictly voluntary and philanthropic. Any monetary exchange, request for commercialization, or solicitation of assets is strictly prohibited and prosecuted under regional penal codes."}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">3. {isRtl ? "صحت کے بیانات" : "Medical Attestations"}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isRtl 
                ? "ڈونرز اپنے طبی ڈیٹا، لیبارٹری رپورٹ اور سابقہ امراض کی مکمل درستگی کے ذمہ دار ہیں۔" 
                : "Donors must provide correct laboratory profiles, diagnostic history, and medical records to ensure recipient safety during clinical matching operations."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Terms;
