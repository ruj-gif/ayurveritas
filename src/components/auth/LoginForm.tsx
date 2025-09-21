import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Leaf, Truck, ShoppingCart, Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(credentials.email, credentials.password);
    
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome to Ayur-Veritas!",
        variant: "default"
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Try: farmer@ayur.com, distributor@ayur.com, or consumer@ayur.com with password 'demo123'",
        variant: "destructive"
      });
    }
  };

  const quickLogin = (email: string) => {
    setCredentials({ email, password: 'demo123' });
  };

  const getPortalEmail = (portal: string) => {
    switch (portal) {
      case 'farmer': return 'farmer@ayur.com';
      case 'distributor': return 'distributor@ayur.com';
      case 'consumer': return 'consumer@ayur.com';
      default: return '';
    }
  };

  const getPortalVariant = (portal: string) => {
    switch (portal) {
      case 'farmer': return 'farmer';
      case 'distributor': return 'distributor';
      case 'consumer': return 'consumer';
      default: return 'default';
    }
  };

  const portals = [
    {
      id: 'farmer',
      title: 'Farmer Portal',
      icon: Leaf,
      description: 'Register your authentic Ayurvedic harvests on the blockchain. Track from seed to shelf with GPS verification and quality assurance.',
      features: [
        'GPS-Tagged Harvest Registration',
        'Blockchain Certification',
        'Quality Verification',
        'Real-time Tracking'
      ],
      buttonText: 'ACCESS FARMER DASHBOARD',
      buttonVariant: 'farmer'
    },
    {
      id: 'distributor',
      title: 'Distributor Portal',
      icon: Truck,
      description: 'Manage the supply chain from farm to market. Process, package, and distribute authentic Ayurvedic products with full transparency.',
      features: [
        'Batch Processing Management',
        'Quality Control Systems',
        'Supply Chain Optimization',
        'Shipment Tracking'
      ],
      buttonText: 'ACCESS DISTRIBUTOR DASHBOARD',
      buttonVariant: 'distributor'
    },
    {
      id: 'consumer',
      title: 'Consumer Portal',
      icon: ShoppingCart,
      description: 'Verify the authenticity of your Ayurvedic products. Trace the complete journey from farm to your hands with blockchain verification.',
      features: [
        'QR Code Verification',
        'Complete Product Journey',
        'Authenticity Guarantee',
        'Lab Test Results'
      ],
      buttonText: 'VERIFY PRODUCTS',
      buttonVariant: 'consumer'
    }
  ];

  if (selectedPortal) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Leaf className="h-10 w-10 text-white animate-float" />
              <h1 className="text-4xl font-bold text-white">Ayur-Veritas</h1>
            </div>
            <p className="text-white/80 text-lg">Blockchain-Powered Herbal Traceability</p>
          </div>

          <Card className="shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedPortal(null)}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="capitalize">{selectedPortal} Login</CardTitle>
                  <CardDescription>Sign in to your {selectedPortal} account</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                  variant={getPortalVariant(selectedPortal) as any}
                  size="lg"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Quick Demo Access</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => quickLogin(getPortalEmail(selectedPortal))}
              >
                Quick Demo Login
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Demo credentials: Use {getPortalEmail(selectedPortal)} with password "demo123"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-primary flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-6">
          <Leaf className="h-12 w-12 text-white animate-float" />
          <h1 className="text-5xl font-bold text-white">Ayur-Veritas</h1>
        </div>
        <p className="text-white/90 text-xl mb-2">From Soil to Soul, Trust Assured</p>
        <p className="text-white/70 text-lg italic">Blockchain-Powered Ayurvedic Supply Chain Transparency</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {portals.map((portal) => {
          const IconComponent = portal.icon;
          return (
            <Card key={portal.id} className="shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 rounded-full bg-success/10">
                  <IconComponent className="h-12 w-12 text-success" />
                </div>
                <CardTitle className="text-xl text-success mb-2">{portal.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {portal.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {portal.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full mt-6" 
                  variant={portal.buttonVariant as any}
                  size="lg"
                  onClick={() => {
                    setSelectedPortal(portal.id);
                    setCredentials({ email: getPortalEmail(portal.id), password: 'demo123' });
                  }}
                >
                  {portal.buttonText}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LoginForm;