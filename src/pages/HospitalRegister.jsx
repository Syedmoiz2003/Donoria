import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { 
  Building2, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  CheckCircle,
  FileText,
  Shield,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const defaultStates = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Azad Kashmir",
  "Gilgit-Baltistan"
];

const HospitalRegister = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const hospitalTypes = [
    t('hospitalRegister.typeGovernment'),
    t('hospitalRegister.typePrivate'),
    t('hospitalRegister.typeSpecialty'),
    t('hospitalRegister.typeBloodBank'),
    t('hospitalRegister.typeClinic'),
    t('hospitalRegister.typeNursingHome')
  ];

  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    hospitalName: "",
    registrationNumber: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    hospitalType: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    contactPerson: "",
    contactPersonRole: "",
    emergencyContact: "",
    bedCapacity: "",
    icuCapacity: "",
    latitude: null,
    longitude: null,
  });
  const [dynamicStates, setDynamicStates] = useState(defaultStates);

  useEffect(() => {
    // Only load autocomplete if we are on Step 2 where the address input is rendered
    if (step !== 2) return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn("Google Maps API key not found in env configuration.");
      return;
    }

    // Set configuration options for the loader (v2 API)
    setOptions({
      key: apiKey,
      apiKey: apiKey,
      version: "weekly"
    });

    let autocomplete = null;

    // Load Places and Geocoding libraries dynamically
    Promise.all([
      importLibrary("places"),
      importLibrary("geocoding")
    ]).then(() => {
      const addressInput = document.getElementById("address");
      if (!addressInput) return;

      // Default country is Pakistan
      let detectedCountryCode = "pk";
      let detectedCountryName = "Pakistan";

      // Helper function to fetch states/provinces dynamically for the active country
      const fetchStatesForCountry = (countryName) => {
        try {
          const dummyElement = document.createElement("div");
          const placesService = new window.google.maps.places.PlacesService(dummyElement);
          placesService.textSearch(
            {
              query: `provinces and states and territories of ${countryName}`,
            },
            (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                const fetched = results
                  .map((place) => {
                    const name = place.name || "";
                    // Strip the country name from predictions
                    return name.replace(new RegExp(`,?\\s*${countryName}$`, "i"), "").trim();
                  })
                  .filter((name) => name && name.toLowerCase() !== countryName.toLowerCase() && name.length > 2);
                
                if (fetched.length > 0) {
                  const unique = [...new Set(fetched)].sort();
                  setDynamicStates(unique);
                }
              }
            }
          );
        } catch (err) {
          console.error("Error fetching states dynamically:", err);
        }
      };

      // Helper to initialize Autocomplete restricted to the detected country code
      const initAutocomplete = (countryCode) => {
        if (autocomplete) {
          window.google.maps.event.clearInstanceListeners(autocomplete);
        }
        autocomplete = new window.google.maps.places.Autocomplete(addressInput, {
          componentRestrictions: { country: countryCode },
          fields: ["address_components", "geometry", "formatted_address"],
          types: ["address"]
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.address_components) return;

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          let streetAddress = "";
          let city = "";
          let state = "";
          let zipCode = "";

          place.address_components.forEach((component) => {
            const types = component.types;
            if (types.includes("street_number")) streetAddress = component.long_name + " " + streetAddress;
            if (types.includes("route")) streetAddress += component.long_name;
            if (types.includes("locality") || types.includes("sublocality") || types.includes("administrative_area_level_2")) {
              if (!city) city = component.long_name;
            }
            if (types.includes("administrative_area_level_1")) state = component.long_name;
            if (types.includes("postal_code")) zipCode = component.long_name;
          });

          if (!streetAddress) streetAddress = place.formatted_address.split(",")[0];

          setFormData((prev) => ({
            ...prev,
            address: streetAddress || prev.address,
            city: city || prev.city,
            state: state || prev.state,
            zipCode: zipCode || prev.zipCode,
            latitude: lat,
            longitude: lng,
          }));
        });
      };

      // Initialize with default (Pakistan) first
      initAutocomplete(detectedCountryCode);
      fetchStatesForCountry(detectedCountryName);

      // Attempt device location detection (HTML5 Geolocation)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // Reverse Geocode the coordinates to find the country and local details
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              if (status === "OK" && results[0]) {
                let countryCode = "";
                let countryName = "";
                let city = "";
                let state = "";
                let streetAddress = "";
                let zipCode = "";

                results[0].address_components.forEach((component) => {
                  const types = component.types;
                  if (types.includes("country")) {
                    countryCode = component.short_name.toLowerCase();
                    countryName = component.long_name;
                  }
                  if (types.includes("locality") || types.includes("sublocality") || types.includes("administrative_area_level_2")) {
                    if (!city) city = component.long_name;
                  }
                  if (types.includes("administrative_area_level_1")) {
                    state = component.long_name;
                  }
                  if (types.includes("postal_code")) {
                    zipCode = component.long_name;
                  }
                });

                streetAddress = results[0].formatted_address.split(",")[0];

                if (countryCode) {
                  detectedCountryCode = countryCode;
                  detectedCountryName = countryName;

                  // Update autocomplete and fetch provinces for their active country!
                  initAutocomplete(detectedCountryCode);
                  fetchStatesForCountry(detectedCountryName);

                  // Auto-populate detected location fields
                  setFormData((prev) => ({
                    ...prev,
                    address: streetAddress || prev.address,
                    city: city || prev.city,
                    state: state || prev.state,
                    zipCode: zipCode || prev.zipCode,
                    latitude: lat,
                    longitude: lng,
                  }));
                }
              }
            });
          },
          (error) => {
            console.log("Device Geolocation permission denied or unavailable. Using default (Pakistan) settings.");
          }
        );
      }
    }).catch((err) => {
      console.error("Error loading Google Maps APIs:", err);
    });

    return () => {
      if (autocomplete && window.google) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [step]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (step === 1) {
      if (!formData.hospitalName || !formData.registrationNumber || !formData.hospitalType || 
          !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
        setError(t('hospitalRegister.fillAllFields'));
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError(t('hospitalRegister.passwordsNotMatch'));
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!formData.address || !formData.city || !formData.state || !formData.zipCode ||
          !formData.contactPerson || !formData.contactPersonRole || !formData.emergencyContact) {
        setError(t('hospitalRegister.fillAllFields'));
        return;
      }
      setStep(3);
      return;
    }

    if (!formData.bedCapacity || !formData.icuCapacity) {
      setError(t('hospitalRegister.fillBedCapacity'));
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        full_name: formData.hospitalName, // Maps to users.full_name
        phone: formData.phone,           // Maps to users.phone
        role: 'hospital',
        // Hospital profile data
        hospital_name: formData.hospitalName,
        license_number: formData.registrationNumber,
        hospital_type: formData.hospitalType,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        contact_person: formData.contactPerson,
        contact_person_role: formData.contactPersonRole,
        emergency_contact: formData.emergencyContact,
        bed_capacity: parseInt(formData.bedCapacity) || 0,
        icu_capacity: parseInt(formData.icuCapacity) || 0,
      };

      const { error: registerError } = await signUp(userData);

      if (registerError) {
        setError(registerError.message || t('hospitalRegister.unexpectedError'));
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      alert(t('hospitalRegister.success'));
      navigate("/hospital/dashboard");
    } catch (err) {
      console.error('Registration error:', err);
      setError(t('hospitalRegister.unexpectedError'));
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('role.backToHome')}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      step > stepNumber ? "bg-primary" : "bg-muted"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg border border-border p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-primary-foreground mb-2">
                {t('hospitalRegister.title')}
              </h1>
              <p className="text-primary-foreground/80">
                {step === 1 && t('hospitalRegister.step1Desc')}
                {step === 2 && t('hospitalRegister.step2Desc')}
                {step === 3 && t('hospitalRegister.step3Desc')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="hospitalName" className="text-primary-foreground">{t('hospitalRegister.hospitalName')}</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 w-4 h-4 text-primary-foreground/60" />
                        <Input
                          id="hospitalName"
                          type="text"
                          placeholder={t('hospitalRegister.placeholderHospitalName')}
                          className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                          value={formData.hospitalName}
                          onChange={(e) => handleInputChange("hospitalName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="registrationNumber" className="text-primary-foreground">{t('hospitalRegister.registrationNumber')}</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-primary-foreground/60" />
                        <Input
                          id="registrationNumber"
                          type="text"
                          placeholder={t('hospitalRegister.placeholderRegistrationNumber')}
                          className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                          value={formData.registrationNumber}
                          onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-primary-foreground">{t('hospitalRegister.emailAddress')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-primary-foreground/60" />
                        <Input
                          id="email"
                          type="email"
                          placeholder={t('hospitalRegister.placeholderEmail')}
                          className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-primary-foreground">{t('hospitalRegister.phoneNumber')}</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-primary-foreground/60" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder={t('hospitalRegister.placeholderPhone')}
                          className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="hospitalType" className="text-primary-foreground">{t('hospitalRegister.hospitalType')}</Label>
                      <Select value={formData.hospitalType} onValueChange={(value) => handleInputChange("hospitalType", value)}>
                        <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                          <SelectValue placeholder={t('hospitalRegister.selectHospitalType')} />
                        </SelectTrigger>
                        <SelectContent>
                          {hospitalTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-primary-foreground">{t('hospitalRegister.password')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-primary-foreground/60" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={t('hospitalRegister.placeholderPassword')}
                          className="pl-10 pr-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-primary-foreground/60 hover:text-primary-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword" className="text-primary-foreground">{t('hospitalRegister.confirmPassword')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-primary-foreground/60" />
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder={t('hospitalRegister.placeholderConfirmPassword')}
                          className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address" className="text-primary-foreground">{t('hospitalRegister.streetAddress')}</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-primary-foreground/60" />
                        <Input
                          id="address"
                          type="text"
                          placeholder={t('hospitalRegister.placeholderAddress')}
                          className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-primary-foreground">{t('hospitalRegister.city')}</Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder={t('hospitalRegister.placeholderCity')}
                          className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="state" className="text-primary-foreground">{t('hospitalRegister.state')}</Label>
                        <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                          <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                            <SelectValue placeholder={t('hospitalRegister.selectState')} />
                          </SelectTrigger>
                          <SelectContent>
                            {dynamicStates.map((state) => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="zipCode" className="text-primary-foreground">{t('hospitalRegister.zipCode')}</Label>
                      <Input
                        id="zipCode"
                        type="text"
                        placeholder={t('hospitalRegister.placeholderZip')}
                        className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactPerson" className="text-primary-foreground">{t('hospitalRegister.contactPerson')}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-primary-foreground/60" />
                        <Input
                          id="contactPerson"
                          type="text"
                          placeholder={t('hospitalRegister.placeholderContactPerson')}
                          className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                          value={formData.contactPerson}
                          onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="contactPersonRole" className="text-primary-foreground">{t('hospitalRegister.contactPersonRole')}</Label>
                      <Input
                        id="contactPersonRole"
                        type="text"
                        placeholder={t('hospitalRegister.placeholderRole')}
                        className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                        value={formData.contactPersonRole}
                        onChange={(e) => handleInputChange("contactPersonRole", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="emergencyContact" className="text-primary-foreground">{t('hospitalRegister.emergencyContact')}</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-primary-foreground/60" />
                        <Input
                          id="emergencyContact"
                          type="tel"
                          placeholder={t('hospitalRegister.placeholderEmergencyContact')}
                          className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                          value={formData.emergencyContact}
                          onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bedCapacity" className="text-primary-foreground">{t('hospitalRegister.bedCapacity')}</Label>
                        <Input
                          id="bedCapacity"
                          type="number"
                          placeholder={t('hospitalRegister.placeholderBedCapacity')}
                          className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                          value={formData.bedCapacity}
                          onChange={(e) => handleInputChange("bedCapacity", e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="icuCapacity" className="text-primary-foreground">{t('hospitalRegister.icuCapacity')}</Label>
                        <Input
                          id="icuCapacity"
                          type="number"
                          placeholder={t('hospitalRegister.placeholderIcuCapacity')}
                          className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                          value={formData.icuCapacity}
                          onChange={(e) => handleInputChange("icuCapacity", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="bg-primary-foreground/10 rounded-lg p-4 border border-primary-foreground/20">
                      <h3 className="font-medium text-primary-foreground mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary-foreground" />
                        {t('hospitalRegister.verificationRequirements')}
                      </h3>
                      <ul className="text-sm text-primary-foreground/80 space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-primary-foreground" />
                          {t('hospitalRegister.validLicense')}
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-primary-foreground" />
                          {t('hospitalRegister.bloodBankCert')}
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-primary-foreground" />
                          {t('hospitalRegister.emergencyCapability')}
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-primary-foreground" />
                          {t('hospitalRegister.availabilityConfirmation')}
                        </li>
                      </ul>
                    </div>

                    <div className="bg-primary-foreground/10 rounded-lg p-4 border border-primary-foreground/20">
                      <h3 className="font-medium text-primary-foreground mb-2">{t('hospitalRegister.nextSteps')}</h3>
                      <p className="text-sm text-primary-foreground/80">
                        {t('hospitalRegister.nextStepsDesc')}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {error && (
                <div className="p-3 text-sm text-red-300 bg-red-900/30 rounded-md border border-red-500/30">
                  {error}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {t('hospitalRegister.previous')}
                  </Button>
                )}
                <Button type="submit" className="flex-1 bg-primary-foreground text-primary hover:bg-primary-foreground/90" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('hospitalRegister.creatingAccount')}
                    </>
                  ) : (
                    step === 3 ? t('hospitalRegister.completeRegistration') : t('hospitalRegister.nextStep')
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="text-center mt-6">
            <p className="text-primary-foreground/80">
              {t('hospitalRegister.alreadyHaveAccount')}{" "}
              <Link to="/login?role=hospital" className="text-primary-foreground hover:underline">
                {t('hospitalRegister.signInHere')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalRegister;
