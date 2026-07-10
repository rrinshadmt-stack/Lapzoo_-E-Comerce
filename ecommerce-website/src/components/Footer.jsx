function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="text-white font-bold text-lg">
            LAP<span className="text-blue-500">ZO</span>
          </h2>
          <p className="text-sm mt-2">
            Your one-stop shop for laptops.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">Links</h3>
          <p>About</p>
          <p>Contact</p>
          <p>Privacy Policy</p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">Support</h3>
          <p>Email: support@lapzo.com</p>
          <p>Phone: +91 90700 70070</p>
        </div>
      </div>

      <div className="text-center text-sm py-4 border-t border-zinc-800">
        © 2026 LapZO. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
