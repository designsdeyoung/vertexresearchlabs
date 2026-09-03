import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <SEOHead title="Privacy Policy" description="How Vertex Research Labs collects, uses, and shares information." canonical="/privacy" />
    <Header />
    <main className="flex-1 pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Effective September 3, 2026</p>
        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Scope</h2>
            <p>This policy explains how Vertex Research Labs (“Vertex,” “we,” or “us”) handles personal information through vertexresearchlabs.com, customer accounts, orders, support, and related communications. It does not cover third-party sites linked from our services.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Information we collect</h2>
            <ul>
              <li><strong>Account and qualification:</strong> name, email, password credentials managed by our authentication provider, organization, purchaser acknowledgments, and account identifiers.</li>
              <li><strong>Orders and fulfillment:</strong> products, quantities, prices, order status, shipping address, phone number, notes, tracking details, discounts, credits, referral attribution, and transaction references.</li>
              <li><strong>Payments:</strong> payment status and identifiers. When card checkout is enabled, Stripe collects payment-card details directly; Vertex does not receive or store full card numbers. When an external payment app is offered, that provider handles the payment under its own policy.</li>
              <li><strong>Communications:</strong> inquiries, documentation requests, marketing choice, transactional and marketing email delivery events, and support correspondence.</li>
              <li><strong>Device and usage:</strong> IP address, browser/device data, timestamps, requested pages, security logs, and, only after consent, Google Analytics usage data.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">3. How information is collected</h2>
            <p>We receive information from forms, checkout, account activity, emails, shipping events, payment providers, and automatic server logs. The site uses local storage for research-access acknowledgment, analytics choice, referral attribution, and temporary order-recovery information. Google Places may receive address-entry and device data when checkout address autocomplete loads.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">4. How we use information</h2>
            <p>We use information to qualify purchasers; review, accept, process, ship, track, and support orders; provide accounts and requested documentation; process payments, credits, and referrals; send transactional communications; send marketing only where a valid choice permits it; prevent fraud and misuse; maintain security and records; comply with law; and understand aggregate site use where analytics consent is granted.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Service providers and disclosures</h2>
            <p>Information may be disclosed as needed to Supabase (hosting, database, authentication, and server functions), Vercel (site hosting), Stripe or an offered payment provider, EasyPost and shipping carriers, Resend (email delivery and event reporting), Google Places (address autocomplete), Google Analytics (only after consent), and professional advisers or authorities where legally required. Public research-reference links and Google-hosted fonts may also cause the recipient to receive ordinary request data such as an IP address. We may disclose information in a merger, financing, or asset transfer subject to appropriate protections.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Cookies and choices</h2>
            <p>Google Analytics is disabled until you select “Allow analytics.” You may decline without losing core site functionality. Your browser can clear local storage and cookies. Clearing storage will reset the research-access and analytics choices. Marketing email is optional and separate from order and service communications. To withdraw marketing consent, use the unsubscribe method in an email or contact us.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Retention</h2>
            <p>We retain order, payment, tax, fraud-prevention, and compliance records for the periods reasonably needed for those purposes and legal obligations. Account and support records are retained while an account is active and afterward as needed for disputes, security, or law. Marketing records are retained to honor consent and suppression choices. Retention periods require owner and counsel confirmation before publication.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Security</h2>
            <p>We use administrative and technical safeguards intended to protect information. No system is completely secure. Do not send card numbers or sensitive medical information through forms, notes, chat, or email. If you believe information was exposed, contact us promptly.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">9. U.S. state privacy rights</h2>
            <p>Depending on your state and whether an applicable law covers Vertex, you may have rights to know, access, correct, delete, or obtain a copy of personal information and to opt out of certain sale, sharing, targeted advertising, or profiling. We do not state that these rights apply where a law does not cover us, but we will evaluate verified requests and will not discriminate for exercising an applicable right. We do not knowingly sell personal information for money. Contact us to submit a request or appeal a decision. We may verify identity and authority and retain information needed to document the request.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">10. Children</h2>
            <p>The site is for authorized purchasers age 21 or older and is not directed to children. We do not knowingly collect personal information from children.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">11. Changes and contact</h2>
            <p>We may update this policy prospectively and will post the revised effective date. Privacy questions and requests may be sent to <a href="mailto:info@vertexresearchlabs.com">info@vertexresearchlabs.com</a>, called to <a href="tel:+17272951338">(727) 295-1338</a>, or mailed to Vertex Research Labs, 1444 S Belcher Rd., Suite C-103, Clearwater, FL 33764.</p>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Privacy;
