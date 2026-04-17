import { Component } from "@/components/ui/switch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RockerSwitchDemoPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-heading mb-8 text-text">Rocker Switch Demo</h1>
        <p className="mb-12 text-lg text-text">
          A 3D rocker switch component with skew-based transform animations.
        </p>
        <Component />
      </div>
      <Footer />
    </div>
  );
}
