import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Building2, Shield, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const RoleSelect = () => {
  const { t } = useLanguage();
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
      title: t('roleSelect.donor'),
      description: t('role.donorDesc'),
      color: "bg-primary",
      hoverBg: "group-hover:bg-primary/10",
      link: "/login?role=donor",
      features: [t('role.browseRequests'), t('role.aiAssistant'), t('role.trackDonations')],
    },
    {
      id: "hospital",
      icon: Building2,
      title: t('roleSelect.hospital'),
      description: t('role.hospitalDesc'),
      color: "bg-secondary",
      hoverBg: "group-hover:bg-secondary/10",
      link: "/login?role=hospital",
      features: [t('role.postRequests'), t('role.verifyCompatibility'), t('role.realTimeMatching')],
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-8 relative z-10 flex-1 flex flex-col">
        {/* Back Button */}
        <Button variant="ghost" size="sm" className="self-start mb-8" asChild>
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('role.backToHome')}
          </Link>
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
              <img src="/favicon.ico" alt="Donoria Logo" className="w-7 h-7 object-contain" />
            </div>            <span className="font-bold text-xl">
              {t('home.brandName')}
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t('role.selectRole')}
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t('role.selectDesc')}
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto flex-1">
          {roles.map((role, index) => (
            <Link
              key={role.id}
              to={role.link}
              className="group fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="role-card h-full flex flex-col">
                <div className={`w-16 h-16 rounded-2xl ${role.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                  <role.icon className="w-8 h-8 text-primary-foreground" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">
                  {role.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-6 flex-1">
                  {role.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {role.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center text-primary font-medium group-hover:gap-3 transition-all">
                  {t('role.continueAs')} {role.title}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          {t('role.noAccount')}{" "}
          <Link to="/register" className="text-primary hover:underline font-medium">
            {t('role.registerHere')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RoleSelect;
