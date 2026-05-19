import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Droplets, 
  Calendar,
  Loader2,
  LogOut
} from "lucide-react";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{t('profile.notFound')}</p>
          <Button onClick={() => navigate("/")}>{t('profile.goHome')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/donor/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'ur' ? 'ڈیش بورڈ پر واپس جائیں' : 'Back to Dashboard'}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              {t('ui.logout')}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg border border-border p-8 text-primary-foreground">
            
            <div className="text-center mb-8">
              <div className="w-24 h-24 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold mb-1">{profile.name}</h1>
              <p className="text-primary-foreground/80">{t('profile.donorProfile')}</p>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold border-b border-primary-foreground/20 pb-3">
                {t('profile.personalInfo')}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                    <Mail className="w-4 h-4" />
                    {t('profile.email')}
                  </div>
                  <p className="font-medium text-lg">{profile.email}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                    <Phone className="w-4 h-4" />
                    {t('profile.phone')}
                  </div>
                  <p className="font-medium text-lg">{profile.phone}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                    <Droplets className="w-4 h-4" />
                    {t('profile.bloodGroup')}
                  </div>
                  <p className="font-medium">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground font-bold">
                      {profile.blood_group}
                    </span>
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                    <Calendar className="w-4 h-4" />
                    {t('profile.dateOfBirth')}
                  </div>
                  <p className="font-medium text-lg">{profile.date_of_birth || t('profile.notSet')}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                    <User className="w-4 h-4" />
                    {t('profile.gender')}
                  </div>
                  <p className="font-medium text-lg capitalize">{profile.gender || t('profile.notSet')}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                    <MapPin className="w-4 h-4" />
                    {t('profile.location')}
                  </div>
                  <p className="font-medium text-lg">{profile.location || t('profile.notSet')}</p>
                </div>
              </div>

              <div className="border-t border-primary-foreground/20 pt-6 mt-8">
                <p className="text-sm text-primary-foreground/60 text-center">
                  {t('profile.memberSince')} {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
