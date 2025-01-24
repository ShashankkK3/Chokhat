import logo from "../assets/chokhatLogo.png";
import "../styles/land.css";

export default function Land() {
  return (
    <>
    <div className="container">
    
      <div className="center-content">
        <div className="hero-text-left">
          <div className="get-line">Get</div>

          <div className="everything-line">
            <span className="everything">Everything</span>
            <span className="you-need">You Need</span>
          </div>

          <div className="inside-line">Inside Your</div>

          <img src={logo} alt="Chokhat Logo" className="chokhat-logo" />
        </div>
      </div>
    </div>
    
    {/* ==== STATS & CTA SECTION ==== */}
<div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12 px-4">
  <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
    <div>
      <div className="text-3xl md:text-4xl font-bold">10,000+</div>
      <div className="text-sm mt-1">Home Items</div>
    </div>
    <div>
      <div className="text-3xl md:text-4xl font-bold">5,000+</div>
      <div className="text-sm mt-1">Design Ideas</div>
    </div>
    <div>
      <div className="text-3xl md:text-4xl font-bold">1,000+</div>
      <div className="text-sm mt-1">Service Providers</div>
    </div>
    <div>
      <div className="text-3xl md:text-4xl font-bold">50,000+</div>
      <div className="text-sm mt-1">Happy Customers</div>
    </div>
  </div>
</div>

<div className="bg-white py-16 text-center px-4">
  <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Home?</h2>
  <p className="text-gray-600 mb-6 max-w-xl mx-auto">
    Join thousands of homeowners who trust Chokhat for their home improvement journey
  </p>
  <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-md transition duration-300">
    Start Your Journey
  </button>
</div>
</>

  );
}


