import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const redirectLoggedInUser = async () => {
        const { data: donor } = await supabase.from('donors').select('id').eq('id', user.id).maybeSingle();
        if (donor) {
          navigate("/donor/dashboard");
          return;
        }
        const { data: hospital } = await supabase.from('hospitals').select('id').eq('id', user.id).maybeSingle();
        if (hospital) {
          navigate("/hospital/dashboard");
          return;
        }
      };
      redirectLoggedInUser();
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
