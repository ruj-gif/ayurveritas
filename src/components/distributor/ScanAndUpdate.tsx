import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockBatches } from '@/data/mockData';
import { 
  QrCode, 
  Camera, 
  Search, 
  ArrowRight,
  Package,
  User,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';

const ScanAndUpdate: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [isScanning, setIsScanning] = useState(false);
  const [manualBatchId, setManualBatchId] = useState('');
  const [scannedBatch, setScannedBatch] = useState<any>(null);
  const [transferTo, setTransferTo] = useState('');
  const [transferType, setTransferType] = useState<'distributor' | 'retailer' | 'consumer'>('distributor');
  const [updating, setUpdating] = useState(false);

  // Mock QR scanner
  const startScanning = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      // Simulate finding a batch
      const availableBatches = mockBatches.filter(b => b.status === 'verified');
      const randomBatch = availableBatches[Math.floor(Math.random() * availableBatches.length)];
      
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
      toast({
        title: t('batchScanned'),
        description: `${batch.herbType} from ${batch.farmerName}`,
        variant: "default"
      });
    } else {
      toast({
        title: t('batchNotFound'),
        description: t('batchIdNotExist'),
        variant: "destructive"
      });
    }
  };

  const handleManualSearch = () => {
    if (!manualBatchId.trim()) {
      toast({
        title: t('enterBatchId'),
        description: t('pleaseEnterBatchId'),
        variant: "destructive"
      });
      return;
    }
    
    handleBatchFound(manualBatchId.trim());
  };

  const handleUpdate = async () => {
    if (!scannedBatch || !transferTo.trim()) {
      toast({
        title: t('incompleteInformation'),
        description: "Please specify transfer destination.",
        variant: "destructive"
      });
      return;
    }

    setUpdating(true);

    // Simulate update process
    await new Promise(resolve => setTimeout(resolve, 2000));

    setUpdating(false);
    
    toast({
      title: t('batchUpdatedSuccessfully'),
      description: `${scannedBatch.id} transferred to ${transferTo}`,
      variant: "default"
    });

    // Reset form
    setScannedBatch(null);
    setTransferTo('');
    setManualBatchId('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Scanner Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-6 w-6 text-primary" />
            {t('scanAndUpdate')}
          </CardTitle>
          <CardDescription>
            {t('scanQrCode')} to update batch transfers in the supply chain
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
                    <p className="text-primary font-medium">{t('scanningQrCode')}</p>
                    <p className="text-sm text-muted-foreground">{t('positionQrCodeInFrame')}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setIsScanning(false)}>
                  {t('cancelScan')}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-64 h-64 border-2 border-dashed border-muted-foreground/25 mx-auto rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{t('clickToStartScanning')}</p>
                  </div>
                </div>
                <Button variant="distributor" size="lg" onClick={startScanning}>
                  <Camera className="h-5 w-5 mr-2" />
                  {t('startQrScanner')}
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
              <span className="bg-background px-2 text-muted-foreground">{t('orEnterManually')}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Enter Batch ID (e.g., AYUR-2024-001)"
              value={manualBatchId}
              onChange={(e) => setManualBatchId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
            />
            <Button variant="distributor" onClick={handleManualSearch}>
              <Search className="h-4 w-4 mr-2" />
              {t('search')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Update Form */}
      {scannedBatch && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-6 w-6 text-primary" />
              {t('updateBatchTransfer')}
            </CardTitle>
            <CardDescription>
              {t('updateTransferDetailsForBatch')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Batch Info */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">{t('currentBatch')}</h4>
                <Badge variant={getStatusColor(scannedBatch.status)}>
                  {t(scannedBatch.status)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{scannedBatch.herbType}</p>
                    <p className="text-sm text-muted-foreground">{t('herbType')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{scannedBatch.farmerName}</p>
                    <p className="text-sm text-muted-foreground">{t('from')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{scannedBatch.quantity} {scannedBatch.unit}</p>
                    <p className="text-sm text-muted-foreground">{t('quantity')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transfer Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transferType">{t('transferTo')}</Label>
                  <Select 
                    value={transferType} 
                    onValueChange={(value: 'distributor' | 'retailer' | 'consumer') => 
                      setTransferType(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distributor">{t('anotherDistributor')}</SelectItem>
                      <SelectItem value="retailer">{t('retailer')}</SelectItem>
                      <SelectItem value="consumer">{t('consumer')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transferTo">{t('recipientName')}</Label>
                  <Input
                    id="transferTo"
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    placeholder="Enter recipient name"
                  />
                </div>
              </div>

              <Button 
                variant="distributor" 
                size="lg" 
                className="w-full"
                onClick={handleUpdate}
                disabled={updating || !transferTo.trim()}
              >
                {updating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {t('updatingTransfer')}
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    {t('updateBatchTransfer')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScanAndUpdate;