import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Heart, Users, Shield, Award, Target, Globe, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  const stats = [
    { label: t('about.livesSaved'), value: "50,000+", icon: Heart },
    { label: t('about.activeDonors'), value: "10,000+", icon: Users },
    { label: t('about.partnerHospitals'), value: "500+", icon: Shield },
    { label: t('about.citiesCovered'), value: "100+", icon: Globe },
  ];

  const values = [
    {
      icon: Heart,
      title: t('about.saveLives'),
      description: t('about.saveLivesDesc')
    },
    {
      icon: Shield,
      title: t('about.safetyFirst'),
      description: t('about.safetyFirstDesc')
    },
    {
      icon: Users,
      title: t('about.communityDriven'),
      description: t('about.communityDrivenDesc')
    },
    {
      icon: Target,
      title: t('about.efficiency'),
      description: t('about.efficiencyDesc')
    },
  ];

  const team = [
    {
      name: t('about.team.name1'),
      role: t('about.team.role1'),
      description: t('about.team.desc1')
    },
    {
      name: t('about.team.name2'),
      role: t('about.team.role2'),
      description: t('about.team.desc2')
    },
    {
      name: t('about.team.name3'),
      role: t('about.team.role3'),
      description: t('about.team.desc3')
    },
  ];
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{ backgroundImage: "url('/donation-1.jpg')" }} />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-2xl">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  {t('about.title')}
                </span>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
                  {t('about.heroTitle')}
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  {t('about.heroDescription')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="hero" size="lg" asChild>
                    <Link to="/how-it-works">
                      {t('nav.howItWorks')}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/register">
                      {t('about.joinUs')}
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <img src="/hero-bg.jpg" alt="Blood Donation" className="rounded-2xl shadow-2xl w-full h-auto object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 lg:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {t('about.missionVision')}
                </h2>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="healthcare-card">
                  <h3 className="text-2xl font-semibold text-foreground mb-4">
                    {t('about.mission')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('about.missionText')}
                  </p>
                </div>
                
                <div className="healthcare-card">
                  <h3 className="text-2xl font-semibold text-foreground mb-4">
                    {t('about.vision')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('about.visionText')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {t('about.coreValues')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('about.valuesDescription')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="healthcare-card text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 lg:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {t('about.meetTeam')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('about.teamDescription')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {team.map((member, index) => (
                <div key={index} className="healthcare-card text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {t('about.getInTouch')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('about.contactDescription')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t('about.phone')}
                </h3>
                <p className="text-muted-foreground">
                  1-800-DONORIA
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t('about.email')}
                </h3>
                <p className="text-muted-foreground">
                  info@donoria.com
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t('about.headquarters')}
                </h3>
                <p className="text-muted-foreground">
                  San Francisco, CA
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {t('about.joinMission')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                {t('about.joinMissionDesc')}
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/register">
                  {t('about.becomeDonorToday')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
