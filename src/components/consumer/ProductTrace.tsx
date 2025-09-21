import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Calendar, 
  User, 
  Package, 
  FileText, 
  Truck,
  Store,
  Leaf,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { mockBatches, mockTransactions } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ProductTraceProps {
  batchId?: string;
}

const ProductTrace: React.FC<ProductTraceProps> = ({ batchId }) => {
  const navigate = useNavigate();
  const [batch, setBatch] = useState<any>(null);
  const [traceabilityPoints, setTraceabilityPoints] = useState<any[]>([]);

  useEffect(() => {
    if (batchId) {
      const foundBatch = mockBatches.find(b => b.id === batchId);
      if (foundBatch) {
        setBatch(foundBatch);
        
        // Mock traceability points for the supply chain
        const points = [
          {
            id: 1,
            type: 'farm',
            name: foundBatch.farmerName,
            location: foundBatch.location,
            date: foundBatch.harvestDate,
            description: `Harvested ${foundBatch.quantity}${foundBatch.unit} of ${foundBatch.herbType}`,
            icon: 'farm'
          },
          {
            id: 2,
            type: 'distributor',
            name: 'Green Valley Distributors',
            location: {
              lat: 28.7041,
              lng: 77.1025,
              address: 'Distribution Center, Delhi, India'
            },
            date: new Date(new Date(foundBatch.harvestDate).getTime() + 2*24*60*60*1000).toISOString(),
            description: 'Quality verification and lab testing completed',
            icon: 'truck'
          },
          {
            id: 3,
            type: 'retailer',
            name: 'Ayurvedic Health Store',
            location: {
              lat: 19.0760,
              lng: 72.8777,
              address: 'Retail Outlet, Mumbai, Maharashtra'
            },
            date: new Date(new Date(foundBatch.harvestDate).getTime() + 5*24*60*60*1000).toISOString(),
            description: 'Ready for consumer purchase',
            icon: 'store'
          }
        ];
        
        setTraceabilityPoints(points);
      }
    }
  }, [batchId]);

  const createCustomIcon = (type: string) => {
    const colors = {
      farm: '#22c55e',
      distributor: '#3b82f6', 
      retailer: '#f59e0b'
    };
    
    return L.divIcon({
      html: `<div style="background: ${colors[type as keyof typeof colors]}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  const getPolylinePositions = () => {
    return traceabilityPoints.map(point => [point.location.lat, point.location.lng] as [number, number]);
  };

  if (!batch) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Product Selected</h3>
            <p className="text-muted-foreground mb-4">Please scan a QR code to view product traceability</p>
            <Button onClick={() => navigate('/qr-scanner')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Scanner
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Product Traceability - {batch.herbType}
              </CardTitle>
              <CardDescription>Complete supply chain journey</CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate('/qr-scanner')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Scanner
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map">Supply Chain Map</TabsTrigger>
          <TabsTrigger value="timeline">Journey Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-6">
          {/* Map View */}
          <Card>
            <CardHeader>
              <CardTitle>Supply Chain Journey Map</CardTitle>
              <CardDescription>Track the complete path from farm to consumer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 rounded-lg overflow-hidden">
                <MapContainer
                  center={[20.5937, 78.9629]} // Center of India
                  zoom={5}
                  className="w-full h-full"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* Supply chain path */}
                  {traceabilityPoints.length > 1 && (
                    <Polyline
                      positions={getPolylinePositions()}
                      pathOptions={{ 
                        color: '#3b82f6', 
                        weight: 3,
                        opacity: 0.7,
                        dashArray: '10, 10'
                      }}
                    />
                  )}
                  
                  {/* Location markers */}
                  {traceabilityPoints.map((point, index) => (
                    <Marker
                      key={point.id}
                      position={[point.location.lat, point.location.lng]}
                      icon={createCustomIcon(point.type)}
                    >
                      <Popup>
                        <div className="p-2 min-w-48">
                          <div className="flex items-center gap-2 mb-2">
                            {point.type === 'farm' && <Leaf className="h-4 w-4 text-success" />}
                            {point.type === 'distributor' && <Truck className="h-4 w-4 text-primary" />}
                            {point.type === 'retailer' && <Store className="h-4 w-4 text-accent" />}
                            <span className="font-medium">{point.name}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{point.description}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {new Date(point.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <MapPin className="h-3 w-3" />
                            {point.location.address}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          {/* Supply Chain Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {traceabilityPoints.map((point, index) => (
              <Card key={point.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      point.type === 'farm' ? 'bg-success/10' :
                      point.type === 'distributor' ? 'bg-primary/10' : 'bg-accent/10'
                    }`}>
                      {point.type === 'farm' && <Leaf className="h-4 w-4 text-success" />}
                      {point.type === 'distributor' && <Truck className="h-4 w-4 text-primary" />}
                      {point.type === 'retailer' && <Store className="h-4 w-4 text-accent" />}
                    </div>
                    <div>
                      <h4 className="font-medium">{point.name}</h4>
                      <p className="text-xs text-muted-foreground capitalize">{point.type}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{point.description}</p>
                  
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(point.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {point.location.address.split(',')[0]}
                    </div>
                  </div>
                  
                  {index < traceabilityPoints.length - 1 && (
                    <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-background border border-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{batch.herbType}</p>
                    <p className="text-sm text-muted-foreground">Product Type</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-success" />
                  <div>
                    <p className="font-medium">{batch.farmerName}</p>
                    <p className="text-sm text-muted-foreground">Source Farmer</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{batch.quantity} {batch.unit}</p>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline View */}
          <Card>
            <CardHeader>
              <CardTitle>Journey Timeline</CardTitle>
              <CardDescription>Step-by-step product journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {traceabilityPoints.map((point, index) => (
                  <div key={point.id} className="flex items-start gap-4 relative">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      point.type === 'farm' ? 'bg-success/10 border-success' :
                      point.type === 'distributor' ? 'bg-primary/10 border-primary' : 'bg-accent/10 border-accent'
                    }`}>
                      {point.type === 'farm' && <Leaf className="h-4 w-4 text-success" />}
                      {point.type === 'distributor' && <Truck className="h-4 w-4 text-primary" />}
                      {point.type === 'retailer' && <Store className="h-4 w-4 text-accent" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{point.name}</h4>
                        <Badge variant="outline" className="text-xs capitalize">{point.type}</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{point.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(point.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {point.location.address}
                        </div>
                      </div>
                    </div>
                    
                    {index < traceabilityPoints.length - 1 && (
                      <div className="absolute left-5 top-10 w-0.5 h-6 bg-muted"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Blockchain Records */}
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Records</CardTitle>
              <CardDescription>Immutable transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTransactions.filter(tx => tx.batchId === batch.id).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{tx.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.from} → {tx.to}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-xs font-mono text-primary">
                        {tx.blockchainHash.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductTrace;