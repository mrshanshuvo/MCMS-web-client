import React from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Dr. Nazmul Huda',
    role: 'Chief Medical Officer',
    quote: 'CareCamp has revolutionized our approach to community healthcare and patient outreach.',
    rating: 5,
    avatar: '👨‍⚕️',
  },
  {
    name: 'Shila Akter',
    role: 'Health Advocate',
    quote: 'Connected me with nearby medical camps seamlessly and transformed access to care.',
    rating: 5,
    avatar: '👩‍💼',
  },
  {
    name: 'Rafsan Jamil',
    role: 'Program Director',
    quote: 'Streamlined everything from volunteer coordination to medical supply tracking.',
    rating: 5,
    avatar: '👨‍💻',
  },
];

const Testimonials = () => {
  return (
    <section className="bg-[#F5F7F8] dark:bg-slate-900 border-y border-slate-200/60 dark:border-slate-800/80 py-16 sm:py-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Minimalist Header Line */}
        <div className="flex items-end justify-between pb-3 mb-10 border-b border-slate-300/70 dark:border-slate-800">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors">
            <MessageSquareQuote size={20} className="text-[#F4CE14]" aria-hidden="true" />
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#495E57] dark:text-slate-100">
              Community Testimonials
            </span>
          </div>

          <div className="hidden sm:block text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Trusted by Healthcare Leaders
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <li key={item.name}>
              <Card className="bg-white dark:bg-slate-950 p-6 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 border border-slate-200/80 dark:border-slate-800 group h-full flex flex-col justify-between">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center gap-3 mb-1">
                    <div
                      className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-300 shadow-xs"
                      aria-hidden="true"
                    >
                      {item.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-xs font-semibold text-[#495E57] dark:text-[#F4CE14]">
                        {item.role}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-1 py-1"
                    aria-label={`${item.rating} out of 5 stars`}
                  >
                    {Array.from({ length: item.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="text-[#F4CE14] fill-current"
                        size={15}
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  <blockquote className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                    “{item.quote}”
                  </blockquote>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default React.memo(Testimonials);
