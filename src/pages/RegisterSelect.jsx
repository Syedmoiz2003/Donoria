import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Building2, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const RegisterSelect = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ur';
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'donor') {
        navigate("/donor/dashboard");
      } else if (user.role === 'hospital') {
        navigate("/hospital/dashboard");
      } else if (user.role === 'admin') {
        navigate("/admin/dashboard");
      }
    }
  }, [user, navigate]);

  const roles = [
    {
      id: "donor",
      icon: Heart,
      title: isRtl ? "بطور ڈونر رجسٹر کریں" : "Register as a Donor",
      description: isRtl 
        ? "خون یا اعضاء کے عطیہ کے لیے بطور رضاکار رجسٹر ہو کر قیمتی انسانی زندگیاں بچائیں۔" 
        : "Save lives by volunteering to donate blood or organs to patients in critical emergency.",
      color: "bg-primary",
      hoverBg: "group-hover:bg-primary/10",
      link: "/register/donor",
    },
    {
      id: "hospital",
      icon: Building2,
      title: isRtl ? "بطور ہسپتال رجسٹر کریں" : "Register as a Hospital",
      description: isRtl 
        ? "ہنگامی طور پر خون اور اعضاء کے میچز کا انتظام کریں اور فعال عطیہ دہندگان سے رابطہ کریں۔" 
        : "Broadcast urgent requests, match compatibility scores, and connect with live network donors.",
      color: "bg-secondary",
      hoverBg: "group-hover:bg-secondary/10",
      link: "/register/hospital",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-10" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-8 relative z-10 flex-1 flex flex-col justify-center">
        {/* Back Button */}
        <Button variant="ghost" size="sm" className="self-start mb-8" asChild>
          <Link to="/role-select" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>{isRtl ? "واپس جائیں" : "Back"}</span>
          </Link>
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
              <img src="/favicon.ico" alt="Donoria Logo" className="w-7 h-7 object-contain" />
            </div>            <span className="font-bold text-xl">
              Donoria
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {isRtl ? "رجسٹریشن کی قسم منتخب کریں" : "Select Registration Profile"}
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {isRtl 
              ? "قیمتی جانوں کو بچانے کے لیے اپنی متعلقہ کیٹیگری کے مطابق اپنا اکاؤنٹ بنائیں۔" 
              : "Create your verified clinical account to participate in matches or manage active broadcasts."}
          </p>
        </div>

        {/* Option Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
          {roles.map((role) => (
            <Link
              key={role.id}
              to={role.link}
              className="group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="healthcare-card h-full flex flex-col p-8 border border-border group-hover:border-primary/30">
                <div className={`w-16 h-16 rounded-2xl ${role.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                  <role.icon className="w-8 h-8 text-primary-foreground" />
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {role.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-6 flex-1 leading-relaxed">
                  {role.description}
                </p>

                <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                  <span>{isRtl ? "شروع کریں" : "Get Started"}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Alternate login link */}
        <p className="text-center text-sm text-muted-foreground mt-12">
          {isRtl ? "پہلے سے ہی اکاؤنٹ موجود ہے؟" : "Already have an account?"}{" "}
          <Link to="/login" className="text-primary hover:underline font-semibold">
            {isRtl ? "لاگ ان کریں" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterSelect;
