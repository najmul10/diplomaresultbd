"use client";

import { Shield, FileText } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";

export function PrivacyView() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="Privacy Policy"
        description="Your privacy matters to us. Here's how we handle your data."
        icon={Shield}
      />
      <Card className="mt-6">
        <CardContent className="space-y-6 p-6 text-sm text-muted-foreground">
          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">1. Information We Collect</h3>
            <p>
              Diploma Result BD does not store any personal data. When you search
              for a result, your roll number is sent to our server to fetch the
              result. We do not save your roll number, registration number, or
              any search history.
            </p>
          </section>
          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">2. Favorites</h3>
            <p>
              If you save a result to your favorites, it is stored locally in
              your browser using localStorage. This data never leaves your device
              and is not sent to our servers.
            </p>
          </section>
          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">3. Cookies & Analytics</h3>
            <p>
              We may use third-party analytics tools (such as Google Analytics)
              to understand how visitors use our site. These tools may use
              cookies to collect anonymous usage data. You can disable cookies
              in your browser settings.
            </p>
          </section>
          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">4. Advertising</h3>
            <p>
              We may display ads using Google AdSense. Google and its partners
              may use cookies to serve ads based on your prior visits to our
              website or other websites. You can opt out of personalized
              advertising by visiting Google&apos;s Ads Settings.
            </p>
          </section>
          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">5. Third-Party Links</h3>
            <p>
              Our site may contain links to third-party websites. We are not
              responsible for the privacy practices or content of these external
              sites.
            </p>
          </section>
          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">6. Data Security</h3>
            <p>
              We take reasonable measures to protect your data. All
              communications with our servers are encrypted using HTTPS. However,
              no method of transmission over the internet is 100% secure.
            </p>
          </section>
          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">7. Contact</h3>
            <p>
              If you have any questions about this Privacy Policy, please contact
              us at support@diplomaresultbd.com.
            </p>
          </section>
          <p className="border-t pt-4 text-xs">
            Last updated: {new Date().getFullYear()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function TermsView() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="Terms of Service"
        description="The terms and conditions for using Diploma Result BD."
        icon={FileText}
      />
      <Card className="mt-6">
        <CardContent className="space-y-6 p-6 text-sm text-muted-foreground">
          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">1. Acceptance of Terms</h3>
            <p>
              By accessing and using Diploma Result BD, you accept and agree to
              be bound by these Terms of Service. If you do not agree, please do
              not use our website.
            </p>
          </section>
          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">2. Use of Service</h3>
            <p>
              Diploma Result BD is a free service for checking BTEB diploma and
              polytechnic results. You agree to use this service only for lawful
              purposes and not to misuse, abuse, or attempt to disrupt the
              service.
            </p>
          </section>
          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">3. Accuracy of Results</h3>
            <p>
              We strive to provide accurate and up-to-date results. However, we
              do not guarantee that the information is always correct or
              complete. For official confirmation, please verify with the
              Bangladesh Technical Education Board (BTEB).
            </p>
          </section>
          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">4. Intellectual Property</h3>
            <p>
              All content on this website, including text, graphics, logos, and
              software, is the property of Diploma Result BD or its content
              providers. You may not reproduce, distribute, or create derivative
              works without permission.
            </p>
          </section>
          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">5. Limitation of Liability</h3>
            <p>
              Diploma Result BD is provided &quot;as is&quot; without warranty of
              any kind. We are not liable for any damages arising from the use of
              this website or the information provided.
            </p>
          </section>
          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">6. Changes to Terms</h3>
            <p>
              We reserve the right to modify these Terms of Service at any time.
              Changes will be effective immediately upon posting on this page.
            </p>
          </section>
          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground">7. Contact</h3>
            <p>
              If you have any questions about these Terms, please contact us at
              support@diplomaresultbd.com.
            </p>
          </section>
          <p className="border-t pt-4 text-xs">
            Last updated: {new Date().getFullYear()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
