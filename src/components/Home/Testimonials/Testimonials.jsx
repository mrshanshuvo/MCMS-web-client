import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Nazmul Huda",
    role: "Chief Medical Officer",
    quote: "MCMS has revolutionized our approach to community healthcare.",
    rating: 5,
    image: "👨‍⚕️",
  },
  {
    name: "Shila Akter",
    role: "Health Advocate",
    quote:
      "Connected me with nearby medical camps and transformed access to healthcare.",
    rating: 5,
    image: "👩‍💼",
  },
  {
    name: "Rafsan Jamil",
    role: "Program Director",
    quote:
      "Streamlined everything from volunteer coordination to supply management.",
    rating: 5,
    image: "👨‍💻",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-[#F5F7F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#495E57]/10 text-[#495E57] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star
              size={16}
              className="text-[#F4CE14]"
              fill="#F4CE14"
              aria-hidden="true"
            />
            Testimonials
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#45474B] mb-4">
            Trusted by Healthcare
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#495E57] to-[#F4CE14]">
              {" "}
              Leaders
            </span>
          </h2>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <li
              key={t.name}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-[#495E57]/10 group"
            >
              <div className="flex items-center mb-4">
                <div
                  className="text-3xl mr-4 bg-[#495E57]/10 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300"
                  aria-hidden="true"
                >
                  {t.image}
                </div>
                <div>
                  <h4 className="font-bold text-[#45474B]">{t.name}</h4>
                  <p className="text-[#495E57] text-sm">{t.role}</p>
                </div>
              </div>

              <div
                className="flex mb-4 items-center"
                aria-label={`${t.rating} out of 5 stars`}
              >
                <span className="sr-only">{t.rating} out of 5 stars</span>
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="text-[#F4CE14] fill-current"
                    size={16}
                    aria-hidden="true"
                  />
                ))}
              </div>

              <blockquote className="text-[#45474B]/70 italic leading-relaxed">
                “{t.quote}”
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default React.memo(Testimonials);
