import { Faq } from "../../components/landing/Faq";
import { Features } from "../../components/landing/Features";
import { Footer } from "../../components/landing/Footer";
import { Header } from "../../components/landing/Header";
import { Hero } from "../../components/landing/Hero";
import { Testimonials } from "../../components/landing/Testimonials";

export default function LandingPage() {
  return (
    <div className="bg-[#ffffff] text-gray-600">
      <Header />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
