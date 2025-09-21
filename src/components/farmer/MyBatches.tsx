import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockBatches } from '@/data/mockData';
import { 
  Package, 
  Calendar, 
  MapPin, 
  Eye, 
  Edit, 
  X,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';

interface Batch {
  id: string;
  farmerId: string;
  farmerName: string;
  herbType: string;
  quantity: number;
  unit: string;
  harvestDate: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'pending' | 'verified' | 'rejected';
  qrCode: string;
  photo?: string;
  verifiedBy?: string;
  verificationDate?: string;
  labReport?: string;
  blockchainHash?: string;
  price?: number;
  paymentStatus?: 'pending' | 'paid';
  rejectionReason?: string;
}

const MyBatches: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [showBatchDetails, setShowBatchDetails] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);

  const userBatches = mockBatches.filter(batch => batch.farmerId === user?.id);

  const handleViewDetails = (batch: Batch) => {
    setSelectedBatch(batch);
    setShowBatchDetails(true);
  };

  const handleEditBatch = (batch: Batch) => {
    toast({
      title: t('editUpdate'),
      description: `Edit functionality for batch ${batch.id} will be implemented soon.`,
      variant: "default"
    });
  };

  const handleViewOnMap = (batch: Batch) => {
    const { lat, lng } = batch.location;
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(mapUrl, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  if (userBatches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {t('myBatches')}
          </CardTitle>
          <CardDescription>
            {t('yourRegisteredHarvestBatches')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {t('noBatchesFound')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('registerYourFirstHarvest')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {t('myBatches')}
          </CardTitle>
          <CardDescription>
            {t('yourRegisteredHarvestBatches')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('cropHerbName')}</TableHead>
                    <TableHead>{t('quantity')}</TableHead>
                    <TableHead>{t('harvestDate')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('harvestImage')}</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userBatches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.herbType}</TableCell>
                      <TableCell>{batch.quantity} {batch.unit}</TableCell>
                      <TableCell>{formatDate(batch.harvestDate)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(batch.status)}>
                          {t(batch.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {batch.photo ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedBatch(batch);
                              setShowImagePreview(true);
                            }}
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(batch)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditBatch(batch)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {userBatches.map((batch) => (
                <Card key={batch.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium">{batch.herbType}</h4>
                      <p className="text-sm text-muted-foreground">
                        {batch.quantity} {batch.unit} • {formatDate(batch.harvestDate)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(batch.status)}>
                      {t(batch.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {batch.photo && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedBatch(batch);
                            setShowImagePreview(true);
                          }}
                        >
                          <ImageIcon className="h-4 w-4 mr-1" />
                          {t('previewFullImage')}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOnMap(batch)}
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        {t('viewOnMap')}
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(batch)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditBatch(batch)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batch Details Dialog */}
      <Dialog open={showBatchDetails} onOpenChange={setShowBatchDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t('batchDetails')} - {selectedBatch?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedBatch && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    {t('cropHerbName')}
                  </h4>
                  <p>{selectedBatch.herbType}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    {t('quantity')}
                  </h4>
                  <p>{selectedBatch.quantity} {selectedBatch.unit}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    {t('harvestDate')}
                  </h4>
                  <p>{formatDate(selectedBatch.harvestDate)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    {t('status')}
                  </h4>
                  <Badge className={getStatusColor(selectedBatch.status)}>
                    {t(selectedBatch.status)}
                  </Badge>
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                  {t('location')}
                </h4>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm">{selectedBatch.location.address}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span>Lat: {selectedBatch.location.lat.toFixed(6)}</span>
                    <span>Lng: {selectedBatch.location.lng.toFixed(6)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewOnMap(selectedBatch)}
                      className="h-6 px-2"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {t('viewOnMap')}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Harvest Image */}
              {selectedBatch.photo && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">
                    {t('harvestImage')}
                  </h4>
                  <div className="relative">
                    <img 
                      src={selectedBatch.photo} 
                      alt="Harvest image"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setShowBatchDetails(false);
                        setShowImagePreview(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Verification Information */}
              {selectedBatch.status === 'verified' && selectedBatch.verifiedBy && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">
                    {t('verificationDetails')}
                  </h4>
                  <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">{t('verifiedBy')}:</span> {selectedBatch.verifiedBy}
                    </p>
                    {selectedBatch.verificationDate && (
                      <p className="text-sm text-muted-foreground">
                        {t('verifiedOn')}: {formatDate(selectedBatch.verificationDate)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Rejection Information */}
              {selectedBatch.status === 'rejected' && selectedBatch.rejectionReason && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">
                    {t('rejectionReason')}
                  </h4>
                  <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <p className="text-sm">{selectedBatch.rejectionReason}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t('imagePreview')}</DialogTitle>
          </DialogHeader>
          {selectedBatch?.photo && (
            <img 
              src={selectedBatch.photo} 
              alt="Full harvest preview"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyBatches;
