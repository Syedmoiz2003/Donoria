import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import allRequests from "@/data/requests";
import {
  Heart,
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  Building,
  AlertTriangle,
  Activity,
  Droplets,
  Calendar,
  User,
  Navigation,
} from "lucide-react";

const HospitalMap = ({ hospital }) => {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        // Load Google Maps script if not already loaded
        if (!window.google?.maps) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        if (!mapRef.current) return;

        const hospitalPosition = { lat: hospital.lat, lng: hospital.lng };

        const map = new window.google.maps.Map(mapRef.current, {
          center: hospitalPosition,
          zoom: 14,
          mapTypeControl: false,
          fullscreenControl: true,
          streetViewControl: false,
        });

        // Hospital marker
        const hospitalMarker = new window.google.maps.Marker({
          position: hospitalPosition,
          map,
          title: hospital.name,
          icon: {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="#ef4444" stroke="white" stroke-width="2"/>
                <text x="20" y="26" text-anchor="middle" fill="white" font-size="18" font-weight="bold">+</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(40, 40),
          },
        });

        // Info window content adapts to request type
        const infoContent = hospital.type === "organ"
          ? `
            <div style="padding:8px;max-width:200px;">
              <h3 style="margin:0 0 4px;font-weight:bold;color:#1f2937;">${hospital.name}</h3>
              <p style="margin:0;font-size:12px;color:#6b7280;">${hospital.address}</p>
              <p style="margin:4px 0 0;font-size:12px;color:#ef4444;font-weight:bold;">
                ❤️ ${hospital.organType} Donor Needed
              </p>
            </div>
          `
          : `
            <div style="padding:8px;max-width:200px;">
              <h3 style="margin:0 0 4px;font-weight:bold;color:#1f2937;">${hospital.name}</h3>
              <p style="margin:0;font-size:12px;color:#6b7280;">${hospital.address}</p>
              <p style="margin:4px 0 0;font-size:12px;color:#ef4444;font-weight:bold;">
                🩸 ${hospital.bloodType} Blood Needed — ${hospital.units} units
              </p>
            </div>
          `;

        // Info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: infoContent,
        });

        hospitalMarker.addListener("click", () => infoWindow.open(map, hospitalMarker));
        infoWindow.open(map, hospitalMarker);

        // Get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              setUserLocation(userPos);

              // User marker
              new window.google.maps.Marker({
                position: userPos,
                map,
                title: "Your Location",
                icon: {
                  url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                      <circle cx="16" cy="16" r="14" fill="#3b82f6" stroke="white" stroke-width="2"/>
                      <circle cx="16" cy="16" r="5" fill="white"/>
                    </svg>
                  `),
                  scaledSize: new window.google.maps.Size(32, 32),
                },
              });

              // Draw route
              const directionsService = new window.google.maps.DirectionsService();
              const directionsRenderer = new window.google.maps.DirectionsRenderer({
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: "#ef4444",
                  strokeWeight: 4,
                  strokeOpacity: 0.8,
                },
              });
              directionsRenderer.setMap(map);

              directionsService.route(
                {
                  origin: userPos,
                  destination: hospitalPosition,
                  travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                  if (status === "OK") {
                    directionsRenderer.setDirections(result);
                    const leg = result.routes[0].legs[0];
                    setDistance(leg.distance.text + " — " + leg.duration.text + " drive");
                  }
                }
              );

              // Fit bounds to show both markers
              const bounds = new window.google.maps.LatLngBounds();
              bounds.extend(userPos);
              bounds.extend(hospitalPosition);
              map.fitBounds(bounds);
            },
            () => console.log("Location access denied")
          );
        }
      } catch (err) {
        console.error("Map error:", err);
        setMapError("Failed to load map");
      }
    };

    initMap();
  }, []);

  const openGoogleMaps = () => {
    const url = userLocation
      ? `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${hospital.lat},${hospital.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lng}`;
    window.open(url, "_blank");
  };

  if (mapError) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Map unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {distance && (
        <div className="mb-3 p-3 bg-primary/10 rounded-lg flex items-center gap-2">
          <Navigation className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">{distance}</span>
        </div>
      )}

      <div
        ref={mapRef}
        className="w-full rounded-lg overflow-hidden border border-border"
        style={{ height: "280px" }}
      />

      <div className="flex gap-2 mt-3">
        <Button variant="default" className="flex-1" onClick={openGoogleMaps}>
          <Navigation className="w-4 h-4 mr-2" />
          Get Directions
        </Button>
      </div>

      {!userLocation && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Allow location access to see route and distance
        </p>
      )}
    </div>
  );
};

export default function RequestDetails() {
  const { t, language } = useLanguage();
  const { id } = useParams();
  const [consent, setConsent] = useState(false);
  const [availability, setAvailability] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Find the request by ID from URL
  const requestData = allRequests.find(r => r.id === parseInt(id)) || allRequests[0];

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const isOrgan = requestData.type === "organ";

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="healthcare-card max-w-md text-center !p-8">
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t('requestDetails.responseSubmitted')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t('requestDetails.thankYouMessage')}
          </p>
          <div className="space-y-3">
            <Button className="w-full" asChild>
              <Link to="/donor/dashboard">{t('requestDetails.returnToDashboard')}</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/donor/dashboard">{t('requestDetails.browseMoreRequests')}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/donor/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{t('requestDetails.backToRequests')}</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="font-semibold text-foreground">{t('requestDetails.title')}</h1>
          </div>
          <div className="w-24" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* Request Card */}
            <div className={`healthcare-card !p-6 ${requestData.urgency === "critical" ? "border-2 border-destructive/30" : ""
              }`}>
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center font-bold ${requestData.urgency === "critical"
                    ? "bg-destructive text-destructive-foreground"
                    : requestData.urgency === "high"
                      ? "bg-warning text-warning-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}>
                  {isOrgan ? (
                    <>
                      <Heart className="w-6 h-6" />
                      <span className="text-[10px] mt-0.5">Organ</span>
                    </>
                  ) : (
                    <>
                      <Droplets className="w-6 h-6" />
                      <span className="text-sm mt-1">{requestData.bloodType}</span>
                    </>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-foreground">{requestData.hospital}</h2>
                    {requestData.verified && (
                      <CheckCircle className="w-5 h-5 text-success" />
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {isOrgan
                      ? (language === 'ur'
                        ? `${requestData.organType} کا عطیہ درکار ہے (عمر: ${requestData.recipientAge}، بلڈ گروپ: ${requestData.bloodType})`
                        : `${requestData.organType} donor needed (Recipient Age: ${requestData.recipientAge}, Blood Type: ${requestData.bloodType})`)
                      : (language === 'ur'
                        ? `${requestData.bloodType} بلڈ گروپ کے ${requestData.units} یونٹس درکار ہیں`
                        : `${requestData.units} units of ${requestData.bloodType} blood needed`)
                    }
                  </p>
                </div>

                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${requestData.urgency === "critical"
                    ? "bg-destructive/10 text-destructive"
                    : requestData.urgency === "high"
                      ? "bg-warning/10 text-warning"
                      : "bg-primary/10 text-primary"
                  }`}>
                  {requestData.urgency.toUpperCase()}
                </span>
              </div>

              <p className="text-foreground mb-4">{requestData.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {requestData.distance} {t('requestDetails.away')}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {t('requestDetails.posted')} {requestData.time}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {requestData.postedBy}
                </div>
                {isOrgan && (
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-destructive" />
                    Organ Donation
                  </div>
                )}
              </div>
            </div>

            {/* Compatibility */}
            <div className="healthcare-card !p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                {t('requestDetails.compatibilityCheck')}
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all"
                    style={{ width: `${requestData.compatibility}%` }}
                  />
                </div>
                <span className="text-2xl font-bold text-success">{requestData.compatibility}%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('requestDetails.compatibilityMessage')}
              </p>
            </div>

            {/* Requirements */}
            <div className="healthcare-card !p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                {t('requestDetails.donationRequirements')}
              </h3>
              <ul className="space-y-3">
                {requestData.requirements.map((req, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit Response CTA */}
            <div className="healthcare-card !p-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Ready to Make a Difference?</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Your {isOrgan ? "organ" : "blood"} donation can save lives. Submit your response now and the hospital will coordinate with you.
                </p>
                <Button
                  variant="emergency"
                  size="lg"
                  className="w-full text-base"
                  asChild
                >
                  <Link to={`/donor/request/${id}/respond`}>
                    <Heart className="w-5 h-5 mr-2" />
                    Submit Response & Save a Life
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hospital Info */}
            <div className="healthcare-card !p-6">
              <h3 className="font-semibold text-foreground mb-4">{t('requestDetails.hospitalInformation')}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('requestDetails.address')}</p>
                    <p className="text-foreground">{requestData.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('requestDetails.phone')}</p>
                    <p className="text-foreground">{requestData.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('requestDetails.email')}</p>
                    <p className="text-foreground">{requestData.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('requestDetails.postedOn')}</p>
                    <p className="text-foreground">{requestData.postedDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="healthcare-card !p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {t('requestDetails.location')}
              </h3>
              <HospitalMap
                hospital={{
                  name: requestData.hospital,
                  address: requestData.address,
                  lat: requestData.lat,
                  lng: requestData.lng,
                  bloodType: requestData.bloodType,
                  units: requestData.units,
                  type: requestData.type,
                  organType: requestData.organType,
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
