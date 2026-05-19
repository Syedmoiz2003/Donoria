import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { UserPlus, Search, CheckCircle, Heart, ArrowRight, Shield, Clock, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const steps = [
  {
    icon: UserPlus,
    title: "Register",
    description: "Create your donor profile with blood type, location, and contact details. Verification takes less than 5 minutes.",
    color: "bg-primary",
    details: [
      "Fill out your medical history",
      "Verify your identity",
      "Set your availability preferences"
    ]
  },
  {
    icon: Search,
    title: "Match",
    description: "Our AI system matches you with compatible requests from verified hospitals based on blood type and location.",
    color: "bg-secondary",
    details: [
      "Real-time matching algorithm",
      "Location-based filtering",
      "Emergency priority system"
    ]
  },
  {
    icon: CheckCircle,
    title: "Respond",
    description: "Accept donation requests and confirm your availability with one tap. Track your donation history.",
    color: "bg-accent",
    details: [
      "Instant notifications",
      "One-tap confirmation",
      "Real-time tracking"
    ]
  },
  {
    icon: Heart,
    title: "Donate",
    description: "Visit the hospital, complete your donation, and save lives. Receive updates on the impact of your donation.",
    color: "bg-destructive",
    details: [
      "Scheduled appointments",
      "Professional medical staff",
      "Post-donation care"
    ]
  },
];

const features = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "All donations are handled by certified medical professionals with strict safety protocols."
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Emergency requests are processed round the clock to save critical time."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join thousands of donors making a real difference in their communities."
  },
  {
    icon: Award,
    title: "Recognition Program",
    description: "Get recognized for your contributions with badges and impact metrics."
  }
];

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: UserPlus,
      title: t('step.register'),
      description: t('step.registerDesc'),
      color: "bg-primary",
      details: [
        "Fill out your medical history",
        "Verify your identity",
        "Set your availability preferences"
      ]
    },
    {
      icon: Search,
      title: t('step.match'),
      description: t('step.matchDesc'),
      color: "bg-secondary",
      details: [
        "Real-time matching algorithm",
        "Location-based filtering",
        "Emergency priority system"
      ]
    },
    {
      icon: CheckCircle,
      title: t('step.respond'),
      description: t('step.respondDesc'),
      color: "bg-accent",
      details: [
        "Instant notifications",
        "One-tap confirmation",
        "Real-time tracking"
      ]
    },
    {
      icon: Heart,
      title: t('step.donate'),
      description: t('step.donateDesc'),
      color: "bg-destructive",
      details: [
        "Scheduled appointments",
        "Professional medical staff",
        "Post-donation care"
      ]
    },
  ];

  const features = [
    {
      icon: Shield,
      title: t('feature.safeSecure'),
      description: t('feature.safeSecureDesc')
    },
    {
      icon: Clock,
      title: t('feature.availability'),
      description: t('feature.availabilityDesc')
    },
    {
      icon: Users,
      title: t('about.communityDriven'),
      description: t('about.communityDrivenDesc')
    },
    {
      icon: Award,
      title: t('feature.recognition'),
      description: t('feature.recognitionDesc')
    }
  ];
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{ backgroundImage: "url('/donation-3.jpg')" }} />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-2xl">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  {t('how.simpleProcess')}
                </span>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
                  {t('how.title')}
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  {t('how.description')}
                </p>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/register">
                    {t('how.startJourney')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
              <div className="hidden lg:block">
                <img src="/donation-1.jpg" alt="Donation Process" className="rounded-2xl shadow-2xl w-full h-auto object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {t('how.yourJourney')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('how.journeyDesc')}
              </p>
            </div>

            <div className="relative">
              {/* Connection Line */}
              <div className="hidden lg:block absolute top-24 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-primary via-secondary to-destructive" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="relative text-center fade-in"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    {/* Step Number */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-muted text-foreground flex items-center justify-center text-sm font-bold z-10">
                      {index + 1}
                    </div>

                    <div className="healthcare-card !pt-10 h-full">
                      <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <step.icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {step.description}
                      </p>
                      <ul className="text-left text-xs text-muted-foreground space-y-1">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Arrow for mobile/tablet */}
                    {index < steps.length - 1 && (
                      <div className="lg:hidden flex justify-center my-4">
                        <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {t('whyChooseDonoria')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('whyChooseDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {t('how.readyToSaveLives')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                {t('how.readyDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/register">
                    {t('how.becomeDonor')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/about">
                    {t('how.learnMore')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
