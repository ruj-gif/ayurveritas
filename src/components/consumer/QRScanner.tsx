import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { mockBatches } from '@/data/mockData';
import { 
  QrCode, 
  Camera, 
  Search, 
  MapPin, 
  Calendar, 
  User,
  Package,
  Shield,
  CheckCircle,
  Leaf,
  FileText,
  Clock
} from 'lucide-react';

const QRScanner: React.FC = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [manualBatchId, setManualBatchId] = useState('');
  const [scannedBatch, setScannedBatch] = useState<any>(null);
  const [scanHistory, setScanHistory] = useState<string[]>([]);

  // Mock QR scanner (in real app, use react-qr-reader or similar)
  const startScanning = () => {
    setIsScanning(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      // Simulate finding a batch (pick random verified batch)
      const verifiedBatches = mockBatches.filter(b => b.status === 'verified');
      const randomBatch = verifiedBatches[Math.floor(Math.random() * verifiedBatches.length)];
      
      if (randomBatch) {
        handleBatchFound(randomBatch.id);
      }
      setIsScanning(false);
    }, 3000);
  };

  const handleBatchFound = (batchId: string) => {
    const batch = mockBatches.find(b => b.id === batchId);
    
    if (batch) {
      setScannedBatch(batch);
      if (!scanHistory.includes(batchId)) {
        setScanHistory(prev => [batchId, ...prev.slice(0, 4)]); // Keep last 5
      }
      
      toast({
        title: "Batch Found! ✅",
        description: `${batch.herbType} from ${batch.farmerName}`,
        variant: "default"
      });
    } else {
      toast({
        title: "Batch Not Found",
        description: "This batch ID doesn't exist in our system.",
        variant: "destructive"
      });
    }
  };

  const getScanOptions = (batch: any) => [
    {
      id: 'farmer',
      title: 'Farmer Details',
      description: `View ${batch.farmerName}'s farm information and harvest details`,
      icon: <Leaf className="h-4 w-4 text-success" />,
      available: true
    },
    {
      id: 'distributor', 
      title: 'Distributor Records',
      description: 'Quality verification and distribution information',
      icon: <Package className="h-4 w-4 text-primary" />,
      available: batch.status === 'verified'
    },
    {
      id: 'lab-report',
      title: 'Lab Reports',
      description: 'Quality analysis and certification documents',
      icon: <FileText className="h-4 w-4 text-accent" />,
      available: !!batch.labReport
    },
    {
      id: 'blockchain',
      title: 'Blockchain Records',
      description: 'Immutable transaction history and verification',
      icon: <Shield className="h-4 w-4 text-purple-500" />,
      available: !!batch.blockchainHash
    }
  ];

  const handleScanOptionClick = (batchId: string) => {
    window.location.href = `/product-trace?batch=${batchId}`;
  };

  const handleManualSearch = () => {
    if (!manualBatchId.trim()) {
      toast({
        title: "Enter Batch ID",
        description: "Please enter a batch ID to search.",
        variant: "destructive"
      });
      return;
    }
    
    handleBatchFound(manualBatchId.trim());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTraceabilitySteps = (batch: any) => {
    const steps = [
      {
        title: 'Harvest Registered',
        description: `${batch.farmerName} registered ${batch.quantity}${batch.unit} of ${batch.herbType}`,
        date: batch.harvestDate,
        icon: <Leaf className="h-5 w-5 text-success" />,
        completed: true
      },
      {
        title: 'Quality Verification',
        description: batch.verifiedBy ? `Verified by ${batch.verifiedBy}` : 'Pending verification',
        date: batch.verificationDate,
        icon: <Shield className="h-5 w-5 text-primary" />,
        completed: batch.status === 'verified'
      },
      {
        title: 'Lab Testing',
        description: batch.labReport || 'Lab analysis pending',
        date: batch.verificationDate,
        icon: <FileText className="h-5 w-5 text-accent" />,
        completed: !!batch.labReport
      },
      {
        title: 'Blockchain Record',
        description: batch.blockchainHash ? 'Immutably recorded' : 'Recording in progress',
        date: batch.verificationDate,
        icon: <Package className="h-5 w-5 text-purple-500" />,
        completed: !!batch.blockchainHash
      }
    ];
    
    return steps;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Scanner Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-6 w-6 text-primary" />
            QR Code Scanner
          </CardTitle>
          <CardDescription>
            Scan QR codes or enter batch IDs to verify product authenticity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Scanner */}
          <div className="text-center">
            {isScanning ? (
              <div className="space-y-4">
                <div className="w-64 h-64 border-2 border-dashed border-primary mx-auto rounded-lg flex items-center justify-center bg-primary/5">
                  <div className="text-center">
                    <div className="animate-pulse">
                      <Camera className="h-16 w-16 text-primary mx-auto mb-4" />
                    </div>
                    <p className="text-primary font-medium">Scanning QR Code...</p>
                    <p className="text-sm text-muted-foreground">Position the QR code in the frame</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setIsScanning(false)}>
                  Cancel Scan
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-64 h-64 border-2 border-dashed border-muted-foreground/25 mx-auto rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Click to start scanning</p>
                  </div>
                </div>
                <Button variant="farmer" size="lg" onClick={startScanning}>
                  <Camera className="h-5 w-5 mr-2" />
                  Start QR Scanner
                </Button>
              </div>
            )}
          </div>

          {/* Manual Entry */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="batchId" className="sr-only">Batch ID</Label>
              <Input
                id="batchId"
                placeholder="Enter Batch ID (e.g., AYUR-2024-001)"
                value={manualBatchId}
                onChange={(e) => setManualBatchId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
              />
            </div>
            <Button variant="distributor" onClick={handleManualSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Recent Scans */}
          {scanHistory.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Recent Scans</Label>
              <div className="flex flex-wrap gap-2">
                {scanHistory.map((batchId, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => handleBatchFound(batchId)}
                  >
                    {batchId}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Batch Results */}
      {scannedBatch && (
        <div className="space-y-6">
          {/* Scan Options */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-6 w-6 text-primary" />
                    {scannedBatch.herbType}
                  </CardTitle>
                  <CardDescription>Batch ID: {scannedBatch.id} - Select information to view</CardDescription>
                </div>
                <Badge variant={getStatusColor(scannedBatch.status)} className="text-sm">
                  {scannedBatch.status.charAt(0).toUpperCase() + scannedBatch.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getScanOptions(scannedBatch).map((option) => (
                  <Card 
                    key={option.id}
                    className={`cursor-pointer transition-colors hover:border-primary/50 ${
                      option.available ? 'opacity-100' : 'opacity-50'
                    }`}
                    onClick={() => option.available && handleScanOptionClick(scannedBatch.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {option.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium mb-1">{option.title}</h4>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                          {!option.available && (
                            <Badge variant="secondary" className="text-xs mt-2">Not Available</Badge>
                          )}
                        </div>
                        {option.available && (
                          <div className="text-primary">→</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button 
                  variant="farmer" 
                  onClick={() => handleScanOptionClick(scannedBatch.id)}
                  className="w-full md:w-auto"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  View Complete Product Trace
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Batch Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{scannedBatch.farmerName}</p>
                    <p className="text-sm text-muted-foreground">Farmer</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{new Date(scannedBatch.harvestDate).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">Harvest Date</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{scannedBatch.quantity} {scannedBatch.unit}</p>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                  </div>
                </div>
              </div>

              {scannedBatch.location && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">Farm Location</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{scannedBatch.location.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Traceability Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Product Journey</CardTitle>
              <CardDescription>Complete traceability from farm to consumer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {getTraceabilitySteps(scannedBatch).map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-success/10' : 'bg-muted'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.title}
                        </h4>
                        {step.date && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(step.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <Card>
            <CardHeader>
              <CardTitle>Trust & Certifications</CardTitle>
              <CardDescription>Verified quality and authenticity indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-success/5 rounded-lg border border-success/20">
                  <Shield className="h-8 w-8 text-success mx-auto mb-2" />
                  <h4 className="font-medium text-success">Authentic</h4>
                  <p className="text-xs text-muted-foreground">Blockchain verified</p>
                </div>
                
                <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <Leaf className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-medium text-primary">Organic</h4>
                  <p className="text-xs text-muted-foreground">Certified organic</p>
                </div>
                
                <div className="text-center p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <CheckCircle className="h-8 w-8 text-accent mx-auto mb-2" />
                  <h4 className="font-medium text-accent">Fair Trade</h4>
                  <p className="text-xs text-muted-foreground">Ethically sourced</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QRScanner;