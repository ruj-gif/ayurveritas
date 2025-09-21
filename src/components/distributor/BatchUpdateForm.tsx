import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { herbTypes, mockBatches } from '@/data/mockData';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Package, 
  Plus,
  CheckCircle,
  Upload,
  Loader2,
  Search,
  ArrowRight,
  Edit,
  Save
} from 'lucide-react';

interface BatchUpdateData {
  batchId: string;
  herbType: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'verified' | 'rejected';
  transferTo: string;
  transferType: 'distributor' | 'retailer' | 'consumer';
  notes: string;
}

const BatchUpdateForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchBatchId, setSearchBatchId] = useState('');
  const [foundBatch, setFoundBatch] = useState<any>(null);
  
  const [updateData, setUpdateData] = useState<BatchUpdateData>({
    batchId: '',
    herbType: '',
    quantity: 0,
    unit: 'kg',
    status: 'pending',
    transferTo: '',
    transferType: 'distributor',
    notes: ''
  });

  const searchBatch = () => {
    if (!searchBatchId.trim()) {
      toast({
        title: t('enterBatchId'),
        description: t('pleaseEnterBatchId'),
        variant: "destructive"
      });
      return;
    }

    const batch = mockBatches.find(b => b.id === searchBatchId.trim());
    
    if (batch) {
      setFoundBatch(batch);
      setUpdateData({
        batchId: batch.id,
        herbType: batch.herbType,
        quantity: batch.quantity,
        unit: batch.unit,
        status: batch.status,
        transferTo: '',
        transferType: 'distributor',
        notes: ''
      });
      
      toast({
        title: t('batchFound'),
        description: `${batch.herbType} from ${batch.farmerName}`,
        variant: "default"
      });
    } else {
      toast({
        title: t('batchNotFound'),
        description: t('batchIdNotExist'),
        variant: "destructive"
      });
      setFoundBatch(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foundBatch || !updateData.transferTo) {
      toast({
        title: t('incompleteInformation'),
        description: t('pleaseSearchBatchAndSpecifyTransfer'),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    
    toast({
      title: t('batchUpdatedSuccessfully'),
      description: `Batch ${updateData.batchId} has been transferred successfully.`,
      variant: "default"
    });

    // Reset form
    setSearchBatchId('');
    setFoundBatch(null);
    setUpdateData({
      batchId: '',
      herbType: '',
      quantity: 0,
      unit: 'kg',
      status: 'pending',
      transferTo: '',
      transferType: 'distributor',
      notes: ''
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" />
            {t('findBatchToUpdate')}
          </CardTitle>
          <CardDescription>
            Enter a batch ID to update its status and transfer ownership
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Batch ID (e.g., AYUR-2024-001)"
              value={searchBatchId}
              onChange={(e) => setSearchBatchId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchBatch()}
            />
            <Button variant="distributor" onClick={searchBatch}>
              <Search className="h-4 w-4 mr-2" />
              {t('search')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Batch Found - Update Form */}
      {foundBatch && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              {t('updateBatchTransfer')}
            </CardTitle>
            <CardDescription>
              Update batch status and transfer to next party in the supply chain
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Current Batch Info */}
            <div className="mb-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-3">{t('currentBatchInformation')}</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{t('batchId')}:</span>
                  <p className="font-medium">{foundBatch.id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t('herbType')}:</span>
                  <p className="font-medium">{foundBatch.herbType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t('quantity')}:</span>
                  <p className="font-medium">{foundBatch.quantity} {foundBatch.unit}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t('currentStatus')}:</span>
                  <Badge variant={foundBatch.status === 'verified' ? 'verified' : foundBatch.status === 'pending' ? 'pending' : 'destructive'}>
                    {t(foundBatch.status)}
                  </Badge>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transfer Details */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  {t('transferDetails')}
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transferType">{t('transferType')} *</Label>
                    <Select 
                      value={updateData.transferType} 
                      onValueChange={(value: 'distributor' | 'retailer' | 'consumer') => 
                        setUpdateData(prev => ({ ...prev, transferType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select transfer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="distributor">{t('anotherDistributor')}</SelectItem>
                        <SelectItem value="retailer">{t('retailer')}</SelectItem>
                        <SelectItem value="consumer">{t('consumer')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transferTo">{t('recipientName')} *</Label>
                    <Input
                      id="transferTo"
                      value={updateData.transferTo}
                      onChange={(e) => setUpdateData(prev => ({ 
                        ...prev, 
                        transferTo: e.target.value 
                      }))}
                      placeholder="Enter recipient name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">{t('updateStatus')}</Label>
                  <Select 
                    value={updateData.status} 
                    onValueChange={(value: 'pending' | 'verified' | 'rejected') => 
                      setUpdateData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{t('pending')}</SelectItem>
                      <SelectItem value="verified">{t('verified')}</SelectItem>
                      <SelectItem value="rejected">{t('rejected')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">{t('transferNotes')}</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any notes about this transfer..."
                    value={updateData.notes}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="distributor" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Updating Batch...
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-5 w-5 mr-2" />
                    {t('updateTransferBatch')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BatchUpdateForm;