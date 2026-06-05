import { Link } from "react-router-dom";
import { Droplet, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                <Droplet className="w-7 h-7 fill-current" />
              </div>
              <span className="font-bold text-xl">
                {t('home.brandName')}
              </span>
            </Link>
            <p className="text-background/70 text-sm mb-6">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-background/70 hover:text-primary transition-colors text-sm">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-background/70 hover:text-primary transition-colors text-sm">
                  {t('nav.howItWorks')}
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-background/70 hover:text-primary transition-colors text-sm">
                  {t('cta.forDonors')}
                </Link>
              </li>
              <li>
                <Link to="/hospital-register" className="text-background/70 hover:text-primary transition-colors text-sm">
                  {t('cta.hospitalRegistration')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-background/70 hover:text-primary transition-colors text-sm">
                  {t('footer.faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Hospitals */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('footer.forHospitals')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/hospital/login" className="text-background/70 hover:text-primary transition-colors text-sm">
                  {t('login.hospitalTitle')}
                </Link>
              </li>
              <li>
                <Link to="/verification" className="text-background/70 hover:text-primary transition-colors text-sm">
                  {t('footer.verificationProcess')}
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-background/70 hover:text-primary transition-colors text-sm">
                  {t('footer.donationGuidelines')}
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-background/70 hover:text-primary transition-colors text-sm">
                  {t('footer.supportCenter')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('footer.contactUs')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{t('footer.emergencyHelpline')}</p>
                  <p className="text-background/70 text-sm">1-800-DONORIA</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{t('profile.email')}</p>
                  <p className="text-background/70 text-sm">support@donoria.com</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{t('footer.headquarters')}</p>
                  <p className="text-background/70 text-sm">{t('footer.address')}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-sm">
            {t('footer.rightsReserved')}
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-background/50 hover:text-primary transition-colors text-sm">
              {t('register.privacyPolicy')}
            </Link>
            <Link to="/terms" className="text-background/50 hover:text-primary transition-colors text-sm">
              {t('register.termsOfService')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
