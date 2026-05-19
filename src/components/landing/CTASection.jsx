import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, Building2, Shield, ArrowRight } from "lucide-react";

const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            {t('cta.joinNetwork')}
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t('cta.readyToMakeDifference')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="role-card group">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              {t('cta.forDonors')}
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              {t('cta.donorDescription')}
            </p>
            <Button variant="default" className="w-full" asChild>
              <Link to="/register">
                {t('cta.registerNow')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="role-card group">
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
              <Building2 className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              {t('cta.forHospitals')}
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              {t('cta.hospitalDescription')}
            </p>
            <Button variant="secondary" className="w-full" asChild>
              <Link to="/hospital-register">
                {t('cta.hospitalRegistration')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="role-card group md:col-span-2 lg:col-span-1">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:bg-muted/80 transition-colors">
              <Shield className="w-8 h-8 text-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              {t('cta.forAdministrators')}
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              {t('cta.adminDescription')}
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/admin/login">
                {t('cta.adminPortal')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
