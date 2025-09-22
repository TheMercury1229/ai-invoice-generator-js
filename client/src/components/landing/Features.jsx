import { ArrowRight } from "lucide-react";
import { FEATURES } from "../../utils/data";

export const Features = () => {
  return (
    <section className="py-20 lg:py-28 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Powerful Features to Run Your Business
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage your invoices and get paid
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 lg:last:mx-auto lg:last:col-span-3"
            >
              <div className="size-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                <feature.icon className="size-8 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
              <a
                href="#"
                className="inline-flex items-center text-blue-900 font-medium mt-4 hover:text-black transition-colors duration-200"
              >
                Learn More
                <ArrowRight className={""} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
