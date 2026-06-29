import React from 'react';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { 
  Building2, Scissors, Sparkles, SmilePlus, 
  Droplets, Truck, Utensils, Wrench, 
  Stethoscope, Car, Search, ShieldCheck, 
  MousePointerClick, Tag, RefreshCcw, TrendingUp 
} from 'lucide-react';

interface HomeProps {
  onStart: () => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  const industries = [
    { name: 'Massage Spa', icon: Sparkles },
    { name: 'Nail Salon', icon: Scissors },
    { name: 'Beauty Salon', icon: Sparkles },
    { name: 'Med Spa', icon: SmilePlus },
    { name: 'Cleaning Service', icon: Droplets },
    { name: 'Moving Company', icon: Truck },
    { name: 'Restaurant', icon: Utensils },
    { name: 'Contractor', icon: Wrench },
    { name: 'Dental Clinic', icon: Stethoscope },
    { name: 'Auto Repair', icon: Car },
    { name: 'Wellness Center', icon: Building2 },
  ];

  const checks = [
    {
      title: 'Visibility',
      desc: 'Can local customers find your business?',
      icon: Search,
    },
    {
      title: 'Trust',
      desc: 'Do customers feel confident enough to call or book?',
      icon: ShieldCheck,
    },
    {
      title: 'Conversion',
      desc: 'Is your website turning visitors into calls and bookings?',
      icon: MousePointerClick,
    },
    {
      title: 'Offer',
      desc: 'Do customers see a clear reason to choose you?',
      icon: Tag,
    },
    {
      title: 'Retention',
      desc: 'Are you bringing previous customers back?',
      icon: RefreshCcw,
    },
    {
      title: 'Competition',
      desc: 'Are nearby competitors winning customers online?',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
          Why Is Your Local Business Not Getting More Customers?
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
          Take this free 2-minute diagnostic to find out if your business is losing customers because of weak visibility, low trust, poor website conversion, missing offers, or stronger competitors.
        </p>
        <div className="flex flex-col items-center gap-4">
          <Button size="lg" onClick={onStart} className="text-lg h-14 px-10">
            Start Free Diagnostic
          </Button>
          <p className="text-sm text-slate-500">
            No signup required. Built for local service businesses.
          </p>
        </div>
      </section>

      {/* Industries Section */}
      <section className="bg-white py-16 px-6 border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-slate-900 mb-10">
            Built for Local Service Businesses
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {industries.map((ind, i) => (
              <Card key={i} className="bg-slate-50 border-none shadow-none text-center">
                <CardContent className="p-4 flex flex-col items-center justify-center gap-2 h-full">
                  <ind.icon className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-slate-800 leading-tight">{ind.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Checks Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-slate-900 mb-10">
            What This Tool Checks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {checks.map((check, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <check.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{check.title}</h3>
                  <p className="text-slate-600">{check.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
