import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Dr. Nazmul Huda",
    role: "Chief Medical Officer",
    quote: "MCMS has revolutionized our approach to community healthcare.",
    rating: 5,
    image: "👨‍⚕️"
  },
  {
    name: "Shila Akter",
    role: "Health Advocate",
    quote: "Connected me with nearby medical camps and transformed access to healthcare.",
    rating: 5,
    image: "👩‍💼"
  },
  {
    name: "Rafsan Jamil",
    role: "Program Director",
    quote: "Streamlined everything from volunteer coordination to supply management.",
    rating: 5,
    image: "👨‍💻"
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Healthcare
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Leaders</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">{testimonial.image}</div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-blue-600 text-sm">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={16} />
                ))}
              </div>

              <p className="text-gray-700 italic">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Testimonials);