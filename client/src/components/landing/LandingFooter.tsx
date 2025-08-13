/**
 * Landing Footer Component
 * 
 * Displays the footer section with company information,
 * navigation links, and copyright notice.
 */
export function LandingFooter() {
  const footerSections = [
    {
      title: "Marketplace",
      links: [
        { href: "#", label: "Browse Assets" },
        { href: "#", label: "Sell Assets" },
        { href: "#", label: "How it Works" }
      ]
    },
    {
      title: "Support",
      links: [
        { href: "#", label: "Help Center" },
        { href: "#", label: "Safety Tips" },
        { href: "#", label: "Contact Us" }
      ]
    },
    {
      title: "Legal",
      links: [
        { href: "#", label: "Terms of Service" },
        { href: "#", label: "Privacy Policy" },
        { href: "#", label: "Fees" }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AssetVault</h3>
            <p className="text-gray-400">The trusted marketplace for digital asset transactions with secure escrow protection.</p>
          </div>
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-gray-400">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.href} className="hover:text-white">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AssetVault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
