import React, { useState } from 'react';
import {
  Scale,
  Users,
  Cloud,
  UserCircle,
  CreditCard,
  FileBox,
  AlertTriangle,
  Database,
  Lock,
  ShieldAlert,
  UserX,
  Mail,
  Check,
  Globe,
  Server,
} from 'lucide-react';

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState('intro');

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
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
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
            Terms of Service
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600">
            Please read these terms carefully before using Storifyy.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-12 space-y-1 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
              <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Agreement
              </p>
              {[
                { id: 'intro', label: '1. Introduction' },
                { id: 'eligibility', label: '2. Eligibility' },
                { id: 'services', label: '3. Services Provided' },
                { id: 'accounts', label: '4. User Accounts' },
                { id: 'plans', label: '5. Free & Paid Plans' },
                { id: 'content', label: '6. User Content' },
                { id: 'prohibited', label: '7. Prohibited Activities' },
                { id: 'storage', label: '8. Data Storage' },
                { id: 'privacy', label: '9. Privacy & Usage' },
                { id: 'google', label: '10. Google API' },
                { id: 'security', label: '11. Security' },
                { id: 'termination', label: '12. Termination' },
                { id: 'liability', label: '13. Liability' },
                { id: 'contact', label: '14. Reporting/Contact' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors truncate ${
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

          {/* Main Content */}
          <main className="flex-1 space-y-12 max-w-4xl">
            {/* 1. Introduction */}
            <Section
              id="intro"
              title="1. Introduction"
              icon={<Scale className="w-6 h-6 text-indigo-600" />}
            >
              <p>
                Welcome to{' '}
                <span className="font-bold text-slate-900">Storifyy</span>. By
                creating an account or using our services, you agree to these
                Terms of Service (“Terms”). Storifyy is a personal project that
                provides online file storage, organization, and sharing
                services.
              </p>
              <p className="mt-2 text-slate-500 text-sm">
                These Terms apply to all users worldwide. If you do not agree
                with any part of these Terms, please do not use Storifyy.
              </p>
            </Section>

            {/* 2. Eligibility */}
            <Section
              id="eligibility"
              title="2. Eligibility"
              icon={<Users className="w-6 h-6 text-indigo-600" />}
            >
              <p>
                There is no minimum age requirement to use Storifyy. However,
                users are responsible for ensuring that local laws allow them to
                access cloud storage services. By using Storifyy, you represent
                and warrant that you have the legal right, authority, and
                capacity to agree to these Terms.
              </p>
            </Section>

            {/* 3. Services Provided */}
            <Section
              id="services"
              title="3. Services Provided"
              icon={<Cloud className="w-6 h-6 text-indigo-600" />}
            >
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {[
                  'Upload, store, and manage files',
                  'Access files across devices',
                  'Share files (private or public links)',
                  'Manage access permissions',
                  'OAuth Login (Google/GitHub)',
                  'Google Drive Import (Read-only)',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm italic text-slate-500">
                We reserve the right to modify, suspend, or discontinue any
                feature or part of the service at any time.
              </p>
            </Section>

            {/* 4. User Accounts */}
            <Section
              id="accounts"
              title="4. User Accounts"
              icon={<UserCircle className="w-6 h-6 text-indigo-600" />}
            >
              <div className="bg-white border-l-4 border-indigo-500 shadow-sm p-5 rounded-r-lg">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500 font-bold">•</span>
                    You agree to provide accurate and truthful information.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500 font-bold">•</span>
                    You are responsible for safeguarding your login credentials.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500 font-bold">•</span>
                    You may delete your account at any time.
                  </li>
                </ul>
              </div>
            </Section>

            {/* 5. Plans */}
            <Section
              id="plans"
              title="5. Free and Paid Plans"
              icon={<CreditCard className="w-6 h-6 text-indigo-600" />}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">Free Plan</h4>
                  <p className="text-sm">Limited storage and features.</p>
                </div>
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                  <h4 className="font-bold text-indigo-900 mb-1">Paid Plans</h4>
                  <p className="text-sm text-indigo-800">
                    Additional storage and premium features. Pricing is subject
                    to change with reasonable notice.
                  </p>
                </div>
              </div>
            </Section>

            {/* 6. User Content */}
            <Section
              id="content"
              title="6. User Content & Responsibility"
              icon={<FileBox className="w-6 h-6 text-indigo-600" />}
            >
              <p className="mb-4">
                You may upload any file type. However, Storifyy does not review,
                monitor, or scan uploaded files for illegal content.
              </p>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-900 text-sm">
                <strong>Important:</strong> You are fully responsible for all
                content you upload. You must have legal rights to store and
                distribute your files. You are liable for any misuse or
                copyright violations.
              </div>
            </Section>

            {/* 7. Prohibited Activities */}
            <Section
              id="prohibited"
              title="7. Prohibited Activities"
              icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
            >
              <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                <h4 className="font-bold text-red-900 mb-3">You must NOT:</h4>
                <ul className="space-y-2 text-red-800 text-sm">
                  <li>✗ Upload malware, viruses, or malicious code</li>
                  <li>
                    ✗ Attempt unauthorized access or exploit vulnerabilities
                  </li>
                  <li>✗ Use Storifyy for unlawful purposes</li>
                  <li>
                    ✗ Share content that violates local or international laws
                  </li>
                  <li>✗ Disrupt service availability or security</li>
                </ul>
                <p className="mt-4 text-xs font-bold text-red-900 uppercase">
                  Violations may result in immediate account suspension.
                </p>
              </div>
            </Section>

            {/* 8. Data Storage */}
            <Section
              id="storage"
              title="8. Data Storage Policy"
              icon={<Database className="w-6 h-6 text-indigo-600" />}
            >
              <ul className="list-disc list-inside space-y-2 text-slate-600 ml-2">
                <li>Files remain stored until you delete them.</li>
                <li>Files are not automatically expired.</li>
                <li>Deleted files cannot be recovered.</li>
                <li>
                  Content is not modified or processed beyond storage, sharing,
                  and previews.
                </li>
              </ul>
            </Section>

            {/* 9. Privacy */}
            <Section
              id="privacy"
              title="9. Privacy & Third-Party Services"
              icon={<Server className="w-6 h-6 text-indigo-600" />}
            >
              <p className="mb-4">
                Your privacy is important. We collect minimal data (account
                info, file metadata). We do not collect behavioral analytics.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  'Amazon S3',
                  'Cloudflare',
                  'Netlify',
                  'Render',
                  'Resend',
                  'Google OAuth',
                  'GitHub OAuth',
                  'LemonSqueezy',
                ].map((service) => (
                  <span
                    key={service}
                    className="px-2 py-1 bg-slate-200 text-slate-700 rounded-md font-medium"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </Section>

            {/* 10. Google API */}
            <Section
              id="google"
              title="10. Google API Services"
              icon={<Globe className="w-6 h-6 text-indigo-600" />}
            >
              <div className="border border-blue-200 bg-blue-50/50 p-5 rounded-lg">
                <p className="text-sm text-blue-900 leading-relaxed">
                  Storifyy’s use and transfer of information received from
                  Google APIs to any other app will adhere to the{' '}
                  <a
                    href="#"
                    className="underline font-semibold decoration-blue-500"
                  >
                    Google API Services User Data Policy
                  </a>
                  , including the Limited Use requirements.
                </p>
              </div>
            </Section>

            {/* 11. Security */}
            <Section
              id="security"
              title="11. Security"
              icon={<Lock className="w-6 h-6 text-indigo-600" />}
            >
              <p>
                We implement industry-standard security practices, including:
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">
                <span>• OAuth-based authentication</span>
                <span>• Hashed credentials</span>
                <span>• OTP verification</span>
                <span>• Signed cookies</span>
                <span>• AWS-managed encryption</span>
                <span>• Redis session management</span>
              </div>
            </Section>

            {/* 12. Termination */}
            <Section
              id="termination"
              title="12. Account Termination"
              icon={<UserX className="w-6 h-6 text-indigo-600" />}
            >
              <p>
                Storifyy reserves the right to suspend or terminate abusive
                accounts, remove access to features, or block suspicious
                activity. You may delete your account at any time, which
                permanently removes all files and data.
              </p>
            </Section>

            {/* 13. Liability */}
            <Section
              id="liability"
              title="13. Limitation of Liability"
              icon={<ShieldAlert className="w-6 h-6 text-indigo-600" />}
            >
              <div className="prose prose-sm prose-slate text-slate-500 uppercase tracking-wide text-xs">
                <p>
                  To the maximum extent permitted by law, Storifyy and its
                  developers shall not be liable for indirect, incidental,
                  special, consequential, or punitive damages, including loss of
                  data, unauthorized access, or downtime.
                </p>
                <p className="mt-2">
                  You use Storifyy at your own risk. Storifyy’s total liability
                  shall not exceed the amount paid by you in the last 12 months
                  (or ₹0 if on a free plan).
                </p>
              </div>
            </Section>

            {/* 14. Contact */}
            <Section
              id="contact"
              title="14. Reporting Abuse"
              icon={<Mail className="w-6 h-6 text-indigo-600" />}
            >
              <div className="bg-slate-900 text-white p-6 rounded-xl text-center">
                <p className="mb-4 text-slate-300">
                  If you discover illegal or harmful activity involving
                  Storifyy, report it immediately.
                </p>
                <a
                  href="mailto:armanihsan224@gmail.com"
                  className="inline-flex items-center text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
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

// Reusable Section Component
const Section = ({ id, title, icon, children }) => (
  <section
    id={id}
    className="scroll-mt-24 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 transition-all hover:bg-white/80 hover:shadow-sm"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-indigo-50 rounded-lg">{icon}</div>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
    </div>
    <div className="text-slate-600 leading-relaxed">{children}</div>
  </section>
);

export default TermsOfService;
