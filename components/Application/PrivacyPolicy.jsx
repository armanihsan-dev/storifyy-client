import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Server,
  EyeOff,
  Cookie,
  Globe,
  Trash2,
  Mail,
  FileText,
  CheckCircle2,
  XCircle,
  HardDrive,
} from 'lucide-react';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  // smooth scroll handler
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 selection:bg-indigo-100 selection:text-indigo-700">
      {/* Background Decorative Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-white rounded-2xl shadow-sm border border-slate-100 mb-4">
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Legal
            </span>
            <span className="ml-2 text-slate-500 text-sm font-medium">
              Last Updated: January 14, 2026
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-pink-400 tracking-tight">
            Privacy Policy
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600">
            Transparent, secure, and user-focused. Here is how Storifyy protects
            your data.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation (Sticky on Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-12 space-y-1">
              <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Contents
              </p>
              {[
                { id: 'introduction', label: '1. Introduction' },
                { id: 'collection', label: '2. Information We Collect' },
                { id: 'storage', label: '3. File Storage & Usage' },
                { id: 'usage', label: '4. How We Use Data' },
                { id: 'cookies', label: '5. Cookies' },
                { id: 'third-party', label: '6. Third-Party Services' },
                { id: 'security', label: '7. Data Security' },
                { id: 'rights', label: '9. Your Rights' },
                { id: 'contact', label: '13. Contact Us' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 space-y-12 max-w-4xl">
            {/* 1. Introduction */}
            <Section
              id="introduction"
              title="1. Introduction"
              icon={<FileText className="w-6 h-6 text-indigo-600" />}
            >
              <p>
                Welcome to{' '}
                <span className="font-semibold text-slate-900">Storifyy</span>.
                Your privacy matters to us. This Privacy Policy explains how we
                collect, use, store, and protect your personal information when
                you use our file storage and sharing platform.
              </p>
              <p className="mt-4">
                By using Storifyy, you agree to the practices described in this
                policy.
              </p>
            </Section>

            {/* 2. Information We Collect */}
            <Section
              id="collection"
              title="2. Information We Collect"
              icon={<Server className="w-6 h-6 text-indigo-600" />}
            >
              <p className="mb-6">
                Storifyy is designed to collect only the minimum data required
                to function.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50/50 border border-red-100 rounded-xl p-6">
                  <h4 className="flex items-center text-red-700 font-bold mb-4">
                    <XCircle className="w-5 h-5 mr-2" /> We do NOT collect
                  </h4>
                  <ul className="space-y-2 text-sm text-red-800/80">
                    <li>✗ Advertising identifiers</li>
                    <li>✗ Behavioral analytics</li>
                    <li>✗ EXIF metadata from images</li>
                    <li>✗ Tracking data for ads</li>
                    <li>✗ Personal profiling data</li>
                  </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h4 className="flex items-center text-slate-900 font-bold mb-4">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />{' '}
                    What we collect
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Email address (via OAuth)</li>
                    <li>• Basic profile (name, avatar)</li>
                    <li>• Files and folders you upload</li>
                    <li>• File-sharing details & permissions</li>
                    <li>• Subscription status</li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* 3. File Storage */}
            <Section
              id="storage"
              title="3. File Storage & Usage"
              icon={<HardDrive className="w-6 h-6 text-indigo-600" />}
            >
              <p>
                Uploaded files are stored securely on{' '}
                <span className="font-semibold">Amazon S3</span>. We do not
                scan, inspect, or analyze your content except when necessary for
                generating previews, processing downloads, or legal compliance.
              </p>

              <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h4 className="font-bold text-blue-900 mb-2 flex items-center">
                  <Globe className="w-4 h-4 mr-2" /> Google Drive Integration
                </h4>
                <p className="text-sm text-blue-800 mb-4">
                  If you choose to connect Google Drive, our access is{' '}
                  <strong>read-only</strong>. We only access files you
                  explicitly select. Storifyy’s use of Google API data complies
                  with the{' '}
                  <a
                    href="https://developers.google.com/terms/api-services-user-data-policy"
                    className="underline decoration-blue-400"
                  >
                    Google API Services User Data Policy
                  </a>
                  .
                </p>
              </div>
            </Section>

            {/* 4. Usage */}
            <Section
              id="usage"
              title="4. How We Use Your Information"
              icon={<EyeOff className="w-6 h-6 text-indigo-600" />}
            >
              <p className="mb-4">We use collected data strictly to:</p>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                {[
                  'Create and authenticate accounts',
                  'Store and manage files securely',
                  'Enable sharing and permissions',
                  'Send OTPs and verification emails',
                  'Manage subscriptions',
                  'Prevent abuse and ensure security',
                  'Provide customer support',
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center p-3 bg-white rounded-lg border border-slate-100 shadow-sm"
                  >
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mr-3"></div>
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-6 font-medium text-slate-900">
                We do NOT sell user data, share data for marketing, or track
                user behavior for profiling.
              </p>
            </Section>

            {/* 5. Cookies */}
            <Section
              id="cookies"
              title="5. Cookies and Tracking"
              icon={<Cookie className="w-6 h-6 text-indigo-600" />}
            >
              <p>
                Storifyy uses only <strong>essential cookies</strong> for
                authentication, session management, and security. We do not use
                cookies for advertising, analytics, or cross-site tracking.
              </p>
            </Section>

            {/* 6. Third Party */}
            <Section
              id="third-party"
              title="6. Third-Party Services"
              icon={<Globe className="w-6 h-6 text-indigo-600" />}
            >
              <p className="mb-6">
                Storifyy relies on trusted third-party services. Each provider
                processes data only as required to deliver its service.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ServiceCard
                  name="Amazon Web Services"
                  desc="S3 for secure file storage"
                />
                <ServiceCard
                  name="Cloudflare ( coming soon ...)"
                  desc="CDN, DDoS protection, & security"
                />
                <ServiceCard
                  name="Netlify & Render"
                  desc="Frontend & Backend hosting"
                />
                <ServiceCard
                  name="Resend"
                  desc="OTPs and transactional emails"
                />
                <ServiceCard
                  name="Google & GitHub"
                  desc="OAuth Authentication"
                />
                <ServiceCard
                  name="LemonSqueezy"
                  desc="Payment processing (We do not store card details)"
                />
              </div>
            </Section>

            {/* 7. Security */}
            <Section
              id="security"
              title="7. Data Security"
              icon={<Lock className="w-6 h-6 text-indigo-600" />}
            >
              <p className="mb-4">
                We apply strong security measures including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 ml-2">
                <li>OAuth-based authentication & OTP verification</li>
                <li>Hashed credentials & Signed secure cookies</li>
                <li>Rate limiting, input validation, and sanitization</li>
                <li>AWS-managed encryption at rest</li>
              </ul>
            </Section>

            {/* 8. Retention & 9. Rights */}
            <Section
              id="rights"
              title="8. Retention & 9. Your Rights"
              icon={<Shield className="w-6 h-6 text-indigo-600" />}
            >
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">
                    Data Retention
                  </h4>
                  <p>
                    We retain files until you delete them and account data until
                    your account is deleted. Deleted data cannot be recovered.
                  </p>
                </div>

                <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
                  <h4 className="font-bold text-indigo-900 mb-3">
                    You have the right to:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Access Data',
                      'Delete Files',
                      'Delete Account',
                      'Revoke OAuth',
                      'Disable Links',
                    ].map((right) => (
                      <span
                        key={right}
                        className="px-3 py-1 bg-white text-indigo-700 text-sm font-medium rounded-full border border-indigo-100 shadow-sm"
                      >
                        {right}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* Children, Sharing, Deletion */}
            <div className="prose prose-slate text-slate-600">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                10. Children’s Privacy
              </h3>
              <p className="mb-6">
                Storifyy does not intentionally collect sensitive data from
                minors.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                11. Sharing of Information
              </h3>
              <p className="mb-6">
                We do not share personal data except with listed service
                providers, when required by law, or to enforce our Terms. We
                never sell user data.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                12. Account Deletion
              </h3>
              <p className="mb-6">
                When you delete your account, profile info, files, and shared
                links are removed immediately. Minimal internal logs may be
                temporarily retained for security.
              </p>
            </div>

            {/* 13. Contact */}
            <Section
              id="contact"
              title="13. Contact Us"
              icon={<Mail className="w-6 h-6 text-indigo-600" />}
            >
              <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Have questions about your privacy?
                </h3>
                <p className="text-slate-300 mb-6">
                  We are here to help. Contact our support team for any concerns
                  regarding your data.
                </p>
                <a
                  href="mailto:armanihsan224@gmail.com"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-slate-900 bg-white hover:bg-slate-50 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  armanihsan224@gmail.com
                </a>
              </div>
            </Section>

            {/* Footer */}
            <div className="pt-12 border-t border-slate-200 text-center text-sm text-slate-500">
              <p>&copy; 2026 Storifyy. All rights reserved.</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const Section = ({ id, title, icon, children }) => (
  <section
    id={id}
    className="scroll-mt-24 bg-white/50 backdrop-blur-sm p-0 md:p-6 rounded-2xl md:border border-slate-100 transition-all hover:bg-white/80"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-indigo-50 rounded-lg">{icon}</div>
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
    </div>
    <div className="text-slate-600 leading-relaxed">{children}</div>
  </section>
);

const ServiceCard = ({ name, desc }) => (
  <div className="p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all bg-white">
    <h4 className="font-bold text-slate-900">{name}</h4>
    <p className="text-xs text-slate-500 mt-1">{desc}</p>
  </div>
);

export default PrivacyPolicy;
