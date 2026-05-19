import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
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
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">
                {t('home.brandName')}
              </span>
            </Link>
            <p className="text-background/70 text-sm mb-6">
              Connecting donors with hospitals to save lives through secure, verified blood and organ donation coordination.
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
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-background/70 hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-background/70 hover:text-primary transition-colors text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Become a Donor
                </Link>
              </li>
              <li>
                <Link to="/hospital-register" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Hospital Registration
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-background/70 hover:text-primary transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* For Hospitals */}
          <div>
            <h4 className="font-semibold text-lg mb-4">For Hospitals</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/hospital-login" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Hospital Login
                </Link>
              </li>
              <li>
                <Link to="/verification" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Verification Process
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Donation Guidelines
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Support Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Emergency Helpline</p>
                  <p className="text-background/70 text-sm">1-800-DONORIA</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-background/70 text-sm">support@donoria.com</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Headquarters</p>
                  <p className="text-background/70 text-sm">Healthcare District, Medical City</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-sm">
            © 2025 Donoria. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-background/50 hover:text-primary transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-background/50 hover:text-primary transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
