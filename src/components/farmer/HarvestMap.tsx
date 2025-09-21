import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Navigation, Save, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface HarvestMapProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number; address: string } | null;
}

const MapEvents: React.FC<{ onLocationSelect: (location: { lat: number; lng: number; address: string }) => void }> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      // Mock reverse geocoding (in real app, use a geocoding service)
      const mockAddress = `Farm Location, ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      onLocationSelect({ lat, lng, address: mockAddress });
    },
  });
  return null;
};

const HarvestMap: React.FC<HarvestMapProps> = ({ onLocationSelect, initialLocation }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const mapRef = useRef<L.Map>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(initialLocation || null);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: t('geolocationNotSupported'),
        description: t('browserNotSupportLocation'),
        variant: "destructive"
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Mock reverse geocoding (in real app, use a geocoding service)
        const mockAddress = `Farm Location, ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        
        const location = { lat: latitude, lng: longitude, address: mockAddress };
        setSelectedLocation(location);
        
        // Center map on location
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15);
        }
        
        setIsGettingLocation(false);
        toast({
          title: t('locationCaptured'),
          description: t('gpsCoordinatesRecorded'),
          variant: "default"
        });
      },
      (error) => {
        setIsGettingLocation(false);
        toast({
          title: t('locationError'),
          description: t('unableToGetLocation'),
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setSelectedLocation(location);
  };

  const saveLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      toast({
        title: t('locationSaved'),
        description: t('farmLocationSaved'),
        variant: "default"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
          {t('farmLocation')}
        </CardTitle>
        <CardDescription className="text-sm">
          {t('selectFarmLocationOnMap')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location Controls */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button 
            variant="outline" 
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="flex-1 sm:flex-none"
          >
            {isGettingLocation ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4 mr-2" />
            )}
            {isGettingLocation ? t('gettingLocation') : t('getCurrentLocation')}
          </Button>
          
          {selectedLocation && (
            <Button 
              variant="default" 
              onClick={saveLocation}
              className="flex-1 sm:flex-none"
            >
              <Save className="h-4 w-4 mr-2" />
              {t('saveLocation')}
            </Button>
          )}
        </div>

        {/* Selected Location Info */}
        {selectedLocation && (
          <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
            <div className="flex items-center gap-2 text-success mb-2">
              <MapPin className="h-4 w-4" />
              <span className="font-medium text-sm sm:text-base">{t('locationSelected')}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{selectedLocation.address}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Lat: {selectedLocation.lat.toFixed(6)}</span>
              <span>Lng: {selectedLocation.lng.toFixed(6)}</span>
            </div>
          </div>
        )}

        {/* Map */}
        <div className="h-64 sm:h-80 w-full rounded-lg border overflow-hidden">
          <MapContainer
            center={[20.5937, 78.9629]} // Center of India
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {selectedLocation && (
              <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-medium">{t('farmLocation')}</p>
                    <p className="text-muted-foreground">{selectedLocation.address}</p>
                  </div>
                </Popup>
              </Marker>
            )}
            
            <MapEvents onLocationSelect={handleLocationSelect} />
          </MapContainer>
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• {t('clickOnMapToSelectLocation')}</p>
          <p>• {t('useGetCurrentLocationForGPS')}</p>
          <p>• {t('adjustMarkerByDragging')}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HarvestMap;
