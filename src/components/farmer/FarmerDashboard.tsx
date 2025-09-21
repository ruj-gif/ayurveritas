import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import LanguageSelector from '@/components/ui/language-selector';
import MyBatches from './MyBatches';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  IndianRupee, 
  TrendingUp,
  Plus,
  QrCode,
  MapPin,
  Calendar,
  User,
  Eye,
  Edit
} from 'lucide-react';
import { mockBatches, mockPayments } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const userBatches = mockBatches.filter(batch => batch.farmerId === user?.id);
  const userPayments = mockPayments.filter(payment => 
    userBatches.some(batch => batch.id === payment.batchId)
  );

  const stats = {
    totalBatches: userBatches.length,
    verified: userBatches.filter(b => b.status === 'verified').length,
    pending: userBatches.filter(b => b.status === 'pending').length,
    rejected: userBatches.filter(b => b.status === 'rejected').length,
    totalEarnings: userPayments.reduce((sum, p) => p.status === 'paid' ? sum + p.amount : sum, 0),
    pendingPayments: userPayments.reduce((sum, p) => p.status === 'pending' ? sum + p.amount : sum, 0)
  };

  const recentBatches = userBatches.slice(0, 3);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Language Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{t('farmerWelcome', { name: user?.name || 'Farmer' })}</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">{t('farmerSubtitle')}</p>
        </div>
        <LanguageSelector />
      </div>

      {/* Welcome Section */}
      <div className="gradient-primary rounded-lg p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2">{t('farmerWelcome', { name: user?.name || 'Farmer' })}</h2>
            <p className="text-white/80 text-sm sm:text-base">
              {t('farmerSubtitle')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs sm:text-sm text-white/80">{t('totalEarnings')}</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold">₹{stats.totalEarnings.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('totalBatches')}</CardTitle>
            <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.totalBatches}</div>
            <p className="text-xs text-muted-foreground">
              {t('allRegisteredHarvests')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('verified')}</CardTitle>
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-success">{stats.verified}</div>
            <p className="text-xs text-muted-foreground">
              {t('approvedByDistributors')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('pending')}</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-warning">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              {t('awaitingVerification')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('earnings')}</CardTitle>
            <IndianRupee className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">₹{stats.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ₹{stats.pendingPayments.toLocaleString()} {t('pendingPayments')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">{t('quickActions')}</CardTitle>
          <CardDescription className="text-sm">
            {t('fastTrackFarming')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Link to="/register-harvest">
              <Button variant="farmer" size="lg" className="h-12 sm:h-16 w-full">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="text-sm sm:text-base">{t('registerNewHarvest')}</span>
              </Button>
            </Link>
            <Button variant="distributor" size="lg" className="h-12 sm:h-16">
              <QrCode className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="text-sm sm:text-base">{t('generateQRCodes')}</span>
            </Button>
            <Button variant="consumer" size="lg" className="h-12 sm:h-16 sm:col-span-2 lg:col-span-1">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="text-sm sm:text-base">{t('viewAnalytics')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* My Batches */}
      <MyBatches />

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">{t('verificationRate')}</CardTitle>
            <CardDescription className="text-sm">{t('batchApprovalSuccessRate')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('successRate')}</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round((stats.verified / stats.totalBatches) * 100)}%
                </span>
              </div>
              <Progress value={(stats.verified / stats.totalBatches) * 100} className="h-2" />
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-sm">
                <div className="text-center">
                  <p className="font-medium text-success text-sm sm:text-base">{stats.verified}</p>
                  <p className="text-muted-foreground text-xs">{t('verified')}</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-warning text-sm sm:text-base">{stats.pending}</p>
                  <p className="text-muted-foreground text-xs">{t('pending')}</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-destructive text-sm sm:text-base">{stats.rejected}</p>
                  <p className="text-muted-foreground text-xs">{t('rejected')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">{t('recognition')}</CardTitle>
            <CardDescription className="text-sm">{t('yourEarnedBadgesAndCertifications')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user?.badges?.map((badge, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
                  <span className="font-medium text-sm sm:text-base">{badge}</span>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-4">
                {t('viewAllAchievements')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FarmerDashboard;