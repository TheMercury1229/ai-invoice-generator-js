import { Quote } from "lucide-react";
import { TESTIMONIALS } from "../../utils/data";

export const Testimonials = () => {
  return (
    <section id="testimonial" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            What our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are trusted by thousands of small businesses.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 relative"
            >
              <div className="absolute -top-4 left-8 size-8 bg-gradient-to-br from-blue-950 to-blue-900 rounded-full flex items-center justify-center text-white">
                <Quote className="size-5" />
              </div>
              <p className="text-gray-700 mb-6 italic text-lg">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="size-12 rounded-full object-cover border border-gray-100"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-gray-500 text-sm">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
