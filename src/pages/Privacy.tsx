import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-8">Effective Date: January 15, 2026</p>
          
          <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
            {/* 1. Introduction */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
              <p>
                Vertex Research Labs ("we", "us", "our") is committed to protecting your privacy and handling your personal information in a safe and responsible manner. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you visit or make a purchase through our website vertexresearchlabs.com and associated services. By visiting or using our website, you agree to the practices described in this policy.
              </p>
            </section>
            
            {/* 2. Information We Collect */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
              <p className="mb-4">We collect information that identifies you, such as:</p>
              
              <h3 className="text-lg font-medium text-foreground mb-2">Personal Information</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Name, email address, phone number</li>
                <li>Billing and shipping address</li>
                <li>Payment transaction data (collected by our payment processor, not stored by us)</li>
              </ul>
              
              <h3 className="text-lg font-medium text-foreground mb-2">Non-Personal Information</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>IP address, browser type, device type and operating system</li>
                <li>Usage data (pages visited, time spent, navigation paths)</li>
                <li>Cookies, pixels, and similar tracking technologies</li>
              </ul>
              
              <p className="mb-2">We collect this information:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>When you create an account</li>
                <li>When you place an order</li>
                <li>When you contact us</li>
                <li>Through automated tracking tools such as cookies and analytics systems</li>
              </ul>
            </section>
            
            {/* 3. How We Use Your Information */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
              <p className="mb-2">We use personal information to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Process and fulfill your orders</li>
                <li>Communicate order status, updates, and customer service responses</li>
                <li>Improve our products and services</li>
                <li>Send marketing messages, if you opt in</li>
                <li>Detect and prevent fraud, abuse, and security risks</li>
              </ul>
              <p>
                We do not use personal information for purposes unrelated to your relationship with us unless you consent or we are legally permitted or required to do so.
              </p>
            </section>
            
            {/* 4. How We Share Your Information */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. How We Share Your Information</h2>
              <p className="mb-4">We may share personal information with:</p>
              
              <h3 className="text-lg font-medium text-foreground mb-2">Service Providers</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Payment processors</li>
                <li>Shipping carriers</li>
                <li>Analytics and marketing partners</li>
              </ul>
              
              <h3 className="text-lg font-medium text-foreground mb-2">Legal Obligations</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>If required by law or to respond to legal process</li>
                <li>To protect our rights, customers, or others</li>
              </ul>
              
              <p>
                We do not sell your personal information for money. Under applicable privacy laws such as the California Consumer Privacy Act, you have specific rights regarding data sale and sharing.
              </p>
            </section>
            
            {/* 5. Cookies and Tracking Technologies */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Cookies and Tracking Technologies</h2>
              <p className="mb-2">We use cookies and similar technology to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Remember your login and preferences</li>
                <li>Analyze site usage</li>
                <li>Customize your shopping experience</li>
              </ul>
              <p>
                You can manage or disable cookies through your browser settings, but some features of the site may not function properly if cookies are disabled.
              </p>
            </section>
            
            {/* 6. Your Rights */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Your Rights</h2>
              <p className="mb-4">Depending on your location, you may have rights regarding your personal data:</p>
              
              <h3 className="text-lg font-medium text-foreground mb-2">Access and Correction</h3>
              <p className="mb-4">You may request access to your information or ask that we correct inaccuracies.</p>
              
              <h3 className="text-lg font-medium text-foreground mb-2">Deletion</h3>
              <p className="mb-4">You can request deletion of your personal data, subject to legal and business obligations.</p>
              
              <h3 className="text-lg font-medium text-foreground mb-2">Opt-Out</h3>
              <p className="mb-4">You may opt out of certain data uses, including marketing communications.</p>
              
              <p className="mb-4">
                If you are a resident of California or the European Union you may have additional rights under CCPA/CPRA or GDPR, such as opting out of sale or restriction of processing. We will honor rights required under those laws.
              </p>
              <p>To exercise any rights, contact us at the address below.</p>
            </section>
            
            {/* 7. Data Retention */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Data Retention</h2>
              <p className="mb-2">We retain personal information only as long as necessary to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Provide the services you request</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes</li>
                <li>Enforce our agreements</li>
              </ul>
              <p>When your personal information is no longer needed, we securely delete or anonymize it.</p>
            </section>
            
            {/* 8. Security */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Security</h2>
              <p>
                We implement administrative, technical, and physical safeguards intended to protect personal information against unauthorized access, disclosure, alteration, or destruction. While we strive to protect your data, no system is completely secure and we cannot guarantee absolute protection.
              </p>
            </section>
            
            {/* 9. Children's Privacy */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Children's Privacy</h2>
              <p>
                Our website is not directed to children under the age of 16. We do not knowingly collect personal information from anyone under the age of 16. If we learn that personal information of a person under 16 has been collected, we will take reasonable steps to delete it.
              </p>
            </section>
            
            {/* 10. Third-Party Links */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Third-Party Links</h2>
              <p>
                Our site may contain links to third-party websites. This Privacy Policy does not apply to those sites. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>
            
            {/* 11. Changes to This Policy */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will post the updated policy on our website with the effective date. Continued use of the site after changes constitutes acceptance of the updated policy.
              </p>
            </section>
            
            {/* 12. Contact Information */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">12. Contact Information</h2>
              <p className="mb-4">
                If you have questions, requests, or concerns about your privacy, data practices, or this Privacy Policy, contact us at:
              </p>
              <div className="glass-card rounded-lg p-6 not-prose">
                <p className="font-semibold text-foreground mb-4">Vertex Research Labs</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail size={18} className="text-primary" />
                    <a href="mailto:info@vertexresearchlabs.com" className="hover:text-foreground transition-colors">
                      info@vertexresearchlabs.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone size={18} className="text-primary" />
                    <a href="tel:727-295-1338" className="hover:text-foreground transition-colors">
                      (727) 295-1338
                    </a>
                  </div>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin size={18} className="text-primary mt-0.5" />
                    <div>
                      <p>1444 S Belcher RD STE C-103</p>
                      <p>Clearwater, FL 33764</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;