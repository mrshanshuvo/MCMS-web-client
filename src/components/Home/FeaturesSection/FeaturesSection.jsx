import React from 'react';
import { MapPin, Shield, Users, ChevronRight, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    title: 'Real-time Camp Tracking',
    description: 'Advanced dashboard with live updates and comprehensive analytics.',
    icon: MapPin,
    stats: '99.9% Uptime',
  },
  {
    title: 'Enterprise Security',
    description: 'Bank-grade encryption and HIPAA compliance for medical data.',
    icon: Shield,
    stats: 'ISO 27001 Certified',
  },
  {
    title: 'Smart Role Management',
    description: 'Customizable permissions for doctors, patients, and staff.',
    icon: Users,
    stats: '50+ Role Types',
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-[#F5F7F8] dark:bg-slate-900 border-y border-slate-200/60 dark:border-slate-800/80 py-16 sm:py-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Minimalist Header Line */}
        <div className="flex items-end justify-between pb-3 mb-10 border-b border-slate-300/70 dark:border-slate-800">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors">
            <ShieldCheck size={20} className="text-[#F4CE14]" aria-hidden="true" />
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#495E57] dark:text-slate-100">
              Why Choose CareCamp
            </span>
          </div>

          <div className="hidden sm:block text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Cutting-Edge Medical Operations
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <li key={feature.title}>
                <Card className="bg-white dark:bg-slate-950 p-6 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 border border-slate-200/80 dark:border-slate-800 group h-full flex flex-col justify-between">
                  <CardContent className="p-0 space-y-4">
                    <div className="inline-flex p-3 rounded-2xl bg-[#495E57] dark:bg-slate-800 text-[#F4CE14] mb-2 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <Icon size={24} aria-hidden="true" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-snug">
                      {feature.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-4">
                    <Badge
                      variant="outline"
                      className="text-xs font-semibold text-[#495E57] dark:text-[#F4CE14] bg-[#F4CE14]/15 dark:bg-[#F4CE14]/10 border-transparent rounded-full px-3 py-1"
                    >
                      {feature.stats}
                    </Badge>
                    <ChevronRight
                      className="text-[#495E57] dark:text-[#F4CE14] group-hover:translate-x-1 transition-transform duration-300"
                      size={18}
                      aria-hidden="true"
                    />
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default React.memo(FeaturesSection);
