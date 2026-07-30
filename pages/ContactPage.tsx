import React, { useState } from 'react';
import { Link } from '../components/Router';
import { Mail, MessageSquare, Github, Send, CheckCircle2, Sparkles } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
    }
  };

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
            Have questions about running SpeakUp.ai locally, integrating Gemma 4, or feedback on the hackathon submission? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
          
          {/* Left Column: Direct Links */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Direct Resources</h2>
              
              <div className="space-y-4 text-sm">
                <a
                  href="https://github.com/Icekid35/speakup-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200/60"
                >
                  <Github className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">GitHub Repository</span>
                    <span className="text-slate-500 text-xs">Open issues, view source code, or contribute</span>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <Mail className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Hackathon Team Contact</span>
                    <span className="text-slate-500 text-xs">support@speakup-ai.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Google Gemma 4 Entry</span>
                    <span className="text-slate-500 text-xs">Category: Multimodal Speaking Intelligence</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 space-y-2">
              <span className="font-bold block">Need help setting up LiteRT locally?</span>
              <p className="text-indigo-700 leading-relaxed">
                Check our step-by-step instructions in <Link to="/pricing" className="underline font-semibold">Pricing & FAQs</Link> or view our installation guide on GitHub.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Message Received!</h3>
                <p className="text-slate-600 text-sm max-w-sm mx-auto">
                  Thank you for reaching out. We appreciate your interest in SpeakUp.ai.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900">Send a Direct Note</h2>

                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold">
                    Message or Feedback
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your thoughts, feature requests, or questions..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
