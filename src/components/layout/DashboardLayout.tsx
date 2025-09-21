import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LogOut, 
  User, 
  Bell, 
  Leaf, 
  Truck, 
  ShoppingCart,
  Home,
  Package,
  QrCode,
  CreditCard,
  Settings,
  HelpCircle,
  Shield
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'farmer': return <Leaf className="h-5 w-5" />;
      case 'distributor': return <Truck className="h-5 w-5" />;
      case 'consumer': return <ShoppingCart className="h-5 w-5" />;
      default: return <User className="h-5 w-5" />;
    }
  };

  const getRoleColor = (): "success" | "warning" | "secondary" => {
    switch (user?.role) {
      case 'farmer': return 'success';
      case 'distributor': return 'warning';
      case 'consumer': return 'secondary';
      default: return 'secondary';
    }
  };

  const getNavItems = () => {
    const baseItems = [
      { icon: <Home className="h-4 w-4" />, label: 'Dashboard', path: '/' }
    ];

    switch (user?.role) {
      case 'farmer':
        return [
          ...baseItems,
          { icon: <Shield className="h-4 w-4" />, label: 'KYC Verification', path: '/farmer-kyc' },
          { icon: <Package className="h-4 w-4" />, label: 'Register Harvest', path: '/register-harvest' },
          { icon: <QrCode className="h-4 w-4" />, label: 'My Batches', path: '/my-batches' },
          { icon: <HelpCircle className="h-4 w-4" />, label: 'Help & Training', path: '/help' }
        ];
      case 'distributor':
        return [
          ...baseItems,
          { icon: <Shield className="h-4 w-4" />, label: 'KYC Verification', path: '/distributor-kyc' },
          { icon: <QrCode className="h-4 w-4" />, label: 'Scan & Update', path: '/scan-update' },
          { icon: <Package className="h-4 w-4" />, label: 'Update Batch', path: '/update-batch' },
          { icon: <Settings className="h-4 w-4" />, label: 'Lab Reports', path: '/lab-reports' }
        ];
      case 'consumer':
        return [
          ...baseItems,
          { icon: <QrCode className="h-4 w-4" />, label: 'QR Scanner', path: '/scanner' },
          { icon: <Package className="h-4 w-4" />, label: 'Product Trace', path: '/trace' },
          { icon: <ShoppingCart className="h-4 w-4" />, label: 'Marketplace', path: '/marketplace' }
        ];
      default:
        return baseItems;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-2 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-primary animate-float" />
              <span className="text-lg sm:text-2xl font-bold text-primary">Ayur-Veritas</span>
            </div>
            <div className="hidden lg:block text-muted-foreground">|</div>
            <h1 className="hidden lg:block text-sm sm:text-lg font-medium">{title}</h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            
            <Card className="p-1 sm:p-2">
              <CardContent className="p-0 flex items-center gap-1 sm:gap-3">
                {getRoleIcon()}
                <div className="hidden sm:block">
                  <p className="text-xs sm:text-sm font-medium">{user?.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" size="sm" onClick={logout} className="h-8 px-2 sm:h-10 sm:px-4">
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-muted/30">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center gap-1 py-1 sm:py-2 overflow-x-auto">
            {getNavItems().map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={index} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-1 sm:gap-2 whitespace-nowrap h-8 sm:h-10 px-2 sm:px-4"
                  >
                    <span className="h-3 w-3 sm:h-4 sm:w-4">{item.icon}</span>
                    <span className="hidden sm:inline text-xs sm:text-sm">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {children}
      </main>

      {/* User Badges */}
      {user?.badges && user.badges.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="p-2 shadow-lg">
            <CardContent className="p-0">
              <div className="flex flex-wrap gap-1">
                {user.badges.map((badge, index) => (
                  <Badge key={index} variant={getRoleColor()} className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;