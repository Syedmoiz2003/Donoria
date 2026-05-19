import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users, Hospital } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const stats = [
    {
      image: "/donation-1.jpg",
      title: t('howItWorks.bloodDonation'),
      description: t('howItWorks.bloodDonationDesc'),
      stat: "15,000+",
      statLabel: t('howItWorks.livesSaved'),
    },
    {
      image: "/donation-2.jpg",
      title: t('howItWorks.organDonation'),
      description: t('howItWorks.organDonationDesc'),
      stat: "2,500+",
      statLabel: t('howItWorks.organTransplants'),
    },
    {
      image: "/donation-3.jpg",
      title: t('howItWorks.hospitalNetwork'),
      description: t('howItWorks.hospitalNetworkDesc'),
      stat: "200+",
      statLabel: t('howItWorks.partnerHospitals'),
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t('howItWorks.ourImpact')}
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('howItWorks.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((item, index) => (
            <div key={index} className="healthcare-card overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-destructive" />
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <div className="text-2xl font-bold text-primary">{item.stat}</div>
                  <div className="text-sm text-muted-foreground">{item.statLabel}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="healthcare-card p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">50,000+</h4>
            <p className="text-sm text-muted-foreground">{t('howItWorks.registeredDonors')}</p>
          </div>
          <div className="healthcare-card p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <Hospital className="w-6 h-6 text-secondary" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">50+</h4>
            <p className="text-sm text-muted-foreground">{t('howItWorks.citiesCovered')}</p>
          </div>
          <div className="healthcare-card p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-destructive" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">24/7</h4>
            <p className="text-sm text-muted-foreground">{t('howItWorks.emergencySupport')}</p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button variant="hero" size="lg" asChild>
            <Link to="/register">
              {t('howItWorks.joinNetwork')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
