import { Heart, Users, Building2, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const StatsSection = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Heart,
      value: "15,000+",
      label: t('stats.livesSaved'),
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      icon: Users,
      value: "50,000+",
      label: t('stats.registeredDonors'),
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Building2,
      value: "200+",
      label: t('stats.verifiedHospitals'),
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Clock,
      value: "< 2 hrs",
      label: t('stats.avgResponseTime'),
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t('stats.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('stats.description')}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card text-center hover:-translate-y-1 transition-transform duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <p className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
