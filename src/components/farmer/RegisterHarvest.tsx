import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { herbTypes } from '@/data/mockData';
import QRGenerator from '@/components/qr/QRGenerator';
import * as EXIF from 'exif-js';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Package, 
  Plus,
  CheckCircle,
  Upload,
  Loader2,
  X,
  Eye,
  Edit,
  Navigation
} from 'lucide-react';

interface HarvestData {
  herbType: string;
  quantity: number;
  unit: string;
  harvestDate: string;
  photo: string | null;
  location: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  notes: string;
  exifLocation?: {
    lat: number;
    lng: number;
  } | null;
}

const RegisterHarvest: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Debug logging
  console.log('RegisterHarvest component rendering', { user, isLoading, t });
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please wait while we load your information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Handle no user state
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please log in to register a harvest.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedBatchId, setGeneratedBatchId] = useState<string | null>(null);
  
  const [harvestData, setHarvestData] = useState<HarvestData>({
    herbType: '',
    quantity: 0,
    unit: 'kg',
    harvestDate: new Date().toISOString().split('T')[0],
    photo: null,
    location: null,
    notes: '',
    exifLocation: null
  });
  
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [exifStatus, setExifStatus] = useState<'none' | 'found' | 'not-found'>('none');

  const generateBatchId = (): string => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `AYUR-${year}${month}${day}-${random}`;
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: t('fileTooLarge'),
          description: t('pleaseSelectSmallerImage'),
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        
        // Extract EXIF data
        EXIF.getData(file as any, function() {
          const lat = EXIF.getTag(this, "GPSLatitude");
          const latRef = EXIF.getTag(this, "GPSLatitudeRef");
          const lng = EXIF.getTag(this, "GPSLongitude");
          const lngRef = EXIF.getTag(this, "GPSLongitudeRef");
          
          let exifLocation = null;
          let status: 'none' | 'found' | 'not-found' = 'none';
          
          if (lat && lng && latRef && lngRef) {
            // Convert GPS coordinates to decimal degrees
            const latDecimal = convertDMSToDD(lat, latRef);
            const lngDecimal = convertDMSToDD(lng, lngRef);
            
            exifLocation = {
              lat: latDecimal,
              lng: lngDecimal
            };
            status = 'found';
            
            toast({
              title: t('exifLocationFound'),
              description: t('exifDataExtracted'),
              variant: "default"
            });
          } else {
            status = 'not-found';
            toast({
              title: t('exifLocationNotFound'),
              description: t('fallbackToMapLocation'),
              variant: "default"
            });
          }
          
          setHarvestData(prev => ({
            ...prev,
            photo: imageData,
            exifLocation
          }));
          setExifStatus(status);
        });
      };
      reader.readAsDataURL(file);
      
      toast({
        title: t('photoUploaded'),
        description: t('harvestPhotoAttached'),
        variant: "default"
      });
    }
  };

  // Helper function to convert GPS coordinates from DMS to decimal degrees
  const convertDMSToDD = (dms: number[], ref: string): number => {
    let dd = dms[0] + dms[1]/60 + dms[2]/(60*60);
    if (ref === "S" || ref === "W") {
      dd = dd * -1;
    }
    return dd;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!harvestData.herbType || !harvestData.quantity || (!harvestData.location && !harvestData.exifLocation)) {
      toast({
        title: t('incompleteInformation'),
        description: t('pleaseFillAllRequiredFields'),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const batchId = generateBatchId();
    setGeneratedBatchId(batchId);
    
    // Use EXIF location if available, otherwise use map location
    const finalLocation = harvestData.location || (harvestData.exifLocation ? {
      lat: harvestData.exifLocation.lat,
      lng: harvestData.exifLocation.lng,
      address: `Farm Location, ${harvestData.exifLocation.lat.toFixed(4)}, ${harvestData.exifLocation.lng.toFixed(4)}`
    } : null);
    
    // Simulate blockchain transaction
    const blockchainHash = `0x${Math.random().toString(16).substr(2, 32)}`;
    
    // Add to mock data (in real app, this would be an API call)
    const newBatch = {
      id: batchId,
      farmerId: user?.id || '1',
      farmerName: user?.name || 'Unknown Farmer',
      herbType: harvestData.herbType,
      quantity: harvestData.quantity,
      unit: harvestData.unit,
      harvestDate: harvestData.harvestDate,
      location: finalLocation,
      status: 'pending' as const,
      qrCode: '', // Will be generated by QRGenerator
      photo: harvestData.photo || undefined,
      blockchainHash,
      price: Math.floor(Math.random() * 1000) + 500,
      paymentStatus: 'pending' as const
    };
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: t('harvestRegisteredWithLocationAndImage'),
      description: `Batch ${batchId} has been created with location and image data.`,
      variant: "default"
    });
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setGeneratedBatchId(null);
    setExifStatus('none');
    setHarvestData({
      herbType: '',
      quantity: 0,
      unit: 'kg',
      harvestDate: new Date().toISOString().split('T')[0],
      photo: null,
      location: null,
      notes: '',
      exifLocation: null
    });
  };

  if (isSubmitted && generatedBatchId) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-success">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <CardTitle className="text-success">{t('harvestRegisteredSuccessfullyMessage')}</CardTitle>
            <CardDescription>
              Your batch has been recorded on the blockchain and is pending verification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <Badge variant="success" className="text-lg px-4 py-2">
                {generatedBatchId}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Your unique batch identifier
              </p>
            </div>

            <QRGenerator 
              batchId={generatedBatchId}
              data={{
                herbType: harvestData.herbType,
                quantity: harvestData.quantity,
                unit: harvestData.unit,
                farmerName: user?.name,
                harvestDate: new Date().toISOString()
              }}
            />

            <div className="space-y-4">
              <h4 className="font-medium">Next Steps:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Batch recorded on blockchain</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span>Awaiting distributor verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted rounded-full"></div>
                  <span>Payment will be released after verification</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
            <Button variant="outline" onClick={resetForm} className="flex-1">
              {t('registerNewHarvest')}
            </Button>
            <Button variant="farmer" className="flex-1">
              {t('viewAll')}
            </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Register New Harvest
          </CardTitle>
          <CardDescription>
            Record your herbal harvest details and generate a blockchain-verified batch ID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Welcome {user.name}! Please fill in your harvest details below.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Herb Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="herbType">{t('cropHerbName')} *</Label>
              <Select 
                value={harvestData.herbType} 
                onValueChange={(value) => setHarvestData(prev => ({ ...prev, herbType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select herb type" />
                </SelectTrigger>
                <SelectContent>
                  {herbTypes.map((herb) => (
                    <SelectItem key={herb} value={herb}>
                      {herb}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Harvest Date */}
            <div className="space-y-2">
              <Label htmlFor="harvestDate">{t('harvestDate')} *</Label>
              <Input
                id="harvestDate"
                type="date"
                value={harvestData.harvestDate}
                onChange={(e) => setHarvestData(prev => ({ ...prev, harvestDate: e.target.value }))}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">{t('harvestQuantity')} *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  step="0.1"
                  value={harvestData.quantity || ''}
                  onChange={(e) => setHarvestData(prev => ({ 
                    ...prev, 
                    quantity: parseFloat(e.target.value) || 0 
                  }))}
                  placeholder="Enter quantity"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">{t('quantity')}</Label>
                <Select 
                  value={harvestData.unit} 
                  onValueChange={(value) => setHarvestData(prev => ({ ...prev, unit: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">{t('kg')}</SelectItem>
                    <SelectItem value="tons">{t('tons')}</SelectItem>
                    <SelectItem value="pounds">{t('pounds')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label>{t('farmImageUpload')}</Label>
              <div className="space-y-4">
                {harvestData.photo ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <img 
                        src={harvestData.photo} 
                        alt="Harvest preview"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => setShowImagePreview(true)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>{t('imagePreview')}</DialogTitle>
                            </DialogHeader>
                            <img 
                              src={harvestData.photo} 
                              alt="Full harvest preview"
                              className="w-full h-auto rounded-lg"
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setHarvestData(prev => ({ ...prev, photo: null, exifLocation: null }));
                            setExifStatus('none');
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* EXIF Status */}
                    {exifStatus !== 'none' && (
                      <div className={`p-3 rounded-lg border ${
                        exifStatus === 'found' 
                          ? 'bg-success/5 border-success/20 text-success' 
                          : 'bg-warning/5 border-warning/20 text-warning'
                      }`}>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {exifStatus === 'found' ? t('exifLocationFound') : t('exifLocationNotFound')}
                          </span>
                        </div>
                        {harvestData.exifLocation && (
                          <p className="text-xs mt-1">
                            GPS: {harvestData.exifLocation.lat.toFixed(6)}, {harvestData.exifLocation.lng.toFixed(6)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">{t('uploadFarmImage')}</p>
                    <p className="text-xs text-muted-foreground mb-2">JPG, PNG up to 5MB</p>
                    <Badge variant="outline" className="text-xs">
                      {t('geotaggingEnabled')}
                    </Badge>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Location Input */}
            <div className="space-y-2">
              <Label>{t('farmLocation')}</Label>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      placeholder="e.g., 20.5937"
                      value={harvestData.location?.lat || ''}
                      onChange={(e) => {
                        const lat = parseFloat(e.target.value);
                        if (!isNaN(lat)) {
                          setHarvestData(prev => ({
                            ...prev,
                            location: {
                              lat,
                              lng: prev.location?.lng || 78.9629,
                              address: prev.location?.address || `Farm Location, ${lat.toFixed(4)}, ${(prev.location?.lng || 78.9629).toFixed(4)}`
                            }
                          }));
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      placeholder="e.g., 78.9629"
                      value={harvestData.location?.lng || ''}
                      onChange={(e) => {
                        const lng = parseFloat(e.target.value);
                        if (!isNaN(lng)) {
                          setHarvestData(prev => ({
                            ...prev,
                            location: {
                              lat: prev.location?.lat || 20.5937,
                              lng,
                              address: `Farm Location, ${(prev.location?.lat || 20.5937).toFixed(4)}, ${lng.toFixed(4)}`
                            }
                          }));
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address (Optional)</Label>
                  <Input
                    id="address"
                    placeholder="Enter farm address or location description"
                    value={harvestData.location?.address || ''}
                    onChange={(e) => {
                      setHarvestData(prev => ({
                        ...prev,
                        location: prev.location ? {
                          ...prev.location,
                          address: e.target.value
                        } : null
                      }));
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      // Get current location using browser geolocation
                      if (navigator.geolocation) {
                        toast({
                          title: 'Getting location...',
                          description: 'Please allow location access when prompted',
                          variant: "default"
                        });
                        
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            const { latitude, longitude, accuracy } = position.coords;
                            setHarvestData(prev => ({
                              ...prev,
                              location: {
                                lat: latitude,
                                lng: longitude,
                                address: `GPS Location (Accuracy: ${Math.round(accuracy)}m), ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                              }
                            }));
                            toast({
                              title: 'Location captured successfully!',
                              description: `GPS coordinates recorded with ${Math.round(accuracy)}m accuracy`,
                              variant: "default"
                            });
                          },
                          (error) => {
                            let errorMessage = 'Unable to get your current location';
                            switch(error.code) {
                              case error.PERMISSION_DENIED:
                                errorMessage = 'Location access denied. Please enable location permissions in your browser.';
                                break;
                              case error.POSITION_UNAVAILABLE:
                                errorMessage = 'Location information is unavailable.';
                                break;
                              case error.TIMEOUT:
                                errorMessage = 'Location request timed out. Please try again.';
                                break;
                            }
                            toast({
                              title: 'Location Error',
                              description: errorMessage,
                              variant: "destructive"
                            });
                          },
                          {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 300000 // 5 minutes
                          }
                        );
                      } else {
                        toast({
                          title: 'Geolocation not supported',
                          description: 'Your browser does not support location services. Please enter coordinates manually.',
                          variant: "destructive"
                        });
                      }
                    }}
                    className="flex-1"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Get GPS Location
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => {
                      // Set a default location for India
                      setHarvestData(prev => ({
                        ...prev,
                        location: {
                          lat: 20.5937,
                          lng: 78.9629,
                          address: 'Default Farm Location, India (20.5937, 78.9629)'
                        }
                      }));
                      toast({
                        title: 'Default location set',
                        description: 'Using default farm location in India',
                        variant: "default"
                      });
                    }}
                  >
                    Use Default
                  </Button>
                </div>

                {harvestData.location && (
                  <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-2 text-success mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium text-sm">Location Selected</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{harvestData.location.address}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Lat: {harvestData.location.lat.toFixed(6)}</span>
                      <span>Lng: {harvestData.location.lng.toFixed(6)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">{t('notes')}</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information about this harvest..."
                value={harvestData.notes}
                onChange={(e) => setHarvestData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="farmer" 
              size="lg" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Registering Harvest...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  {t('registerHarvest')} & Generate QR
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterHarvest;