import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle, Phone, ArrowRight } from "lucide-react";

const EmergencyBanner = () => {
  const { t } = useLanguage();

  return (
    <section className="py-8 bg-destructive relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-destructive-foreground blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-destructive-foreground blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center lg:text-left">
            <div className="w-12 h-12 rounded-xl bg-destructive-foreground/20 flex items-center justify-center animate-pulse-soft">
              <AlertTriangle className="w-6 h-6 text-destructive-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-destructive-foreground">
                {t('emergencyBanner.emergencyBloodNeeded')}
              </h3>
              <p className="text-destructive-foreground/80 text-sm">
                {t('emergencyBanner.description')}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="glass" size="lg" className="bg-destructive-foreground/10 text-destructive-foreground border-destructive-foreground/20 hover:bg-destructive-foreground/20" asChild>
              <Link to="/emergency">
                <Phone className="w-5 h-5 mr-2" />
                {t('emergencyBanner.callHelpline')}
              </Link>
            </Button>
            <Button variant="default" size="lg" className="bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90" asChild>
              <Link to="/donate-now">
                {t('emergencyBanner.respondNow')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencyBanner;
