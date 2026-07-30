import React from 'react';
import { Mail, Phone, Github, Send, Sparkles } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-semibold">
            Connect & Support
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900">
            Get in Touch
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed font-normal">
            Have questions about running SpeakUp.ai, integrating Gemma 4 models, or feedback on the application? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
          
          {/* Left Column: Direct Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Direct Contact</h2>
              
              <div className="space-y-4 text-sm">
                <a
                  href="https://github.com/Icekid35/speakup-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200/60"
                >
                  <Github className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">GitHub Repository</span>
                    <span className="text-slate-500 text-xs">Open issues, view code, or contribute</span>
                  </div>
                </a>

                <a
                  href="mailto:bellohabib682@gmail.com"
                  className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200/60"
                >
                  <Mail className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Email Address</span>
                    <span className="text-slate-500 text-xs">bellohabib682@gmail.com</span>
                  </div>
                </a>

                <a
                  href="tel:08157899361"
                  className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200/60"
                >
                  <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Phone Number</span>
                    <span className="text-slate-500 text-xs">08157899361</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: FormSubmit.co Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
            <form
              action="https://formsubmit.co/bellohabib682@gmail.com"
              method="POST"
              className="space-y-6"
            >
              {/* FormSubmit Configuration Hidden Fields */}
              <input type="hidden" name="_subject" value="New Message from SpeakUp.ai Contact Form" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />

              <h2 className="text-xl font-bold text-slate-900">Send a Direct Note</h2>

              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="sarah@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold">
                  Message or Feedback
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Share your thoughts, feature requests, or questions..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all shadow-sm group"
              >
                <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
