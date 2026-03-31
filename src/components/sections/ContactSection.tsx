"use client";

import React from 'react';
import { Mail, GitBranch, MapPin, Send } from 'lucide-react';
import { useFormValidation } from '../../hooks/useFormValidation';

interface ContactSectionProps {
  decodedEmail: string;
  showNotification: (message: string, type?: string) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  decodedEmail,
  showNotification
}) => {
  const {
    isRateLimited,
    getRemainingCooldown,
    validateForm,
    recordSubmission
  } = useFormValidation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isRateLimited()) {
      const remainingTime = getRemainingCooldown();
      showNotification(`Please wait ${remainingTime} seconds before sending another message.`, 'error');
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const validation = validateForm(formData);
    if (!validation.valid) {
      showNotification(validation.error!, 'error');
      return;
    }

    if (formData.get('website')) {
      showNotification('Spam detected.', 'error');
      return;
    }

    recordSubmission();

    try {
      await fetch('https://formspree.io/f/mkgzqynj', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      form.reset();
      showNotification('Message sent successfully!', 'success');
    } catch {
      showNotification('Error sending message. Please try again.', 'error');
    }
  };

  const inputClass = "w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors text-sm";

  return (
    <section id="contact" className="py-24 px-4 border-t border-slate-700/40 min-h-screen" style={{ background: '#0f172a' }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <p className="text-cyan-400 font-mono text-sm mb-3 tracking-widest uppercase">Contact</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Let&apos;s work together</h2>
          <p className="text-slate-400 text-lg max-w-xl">
            Have a project in mind or just want to talk? I&apos;m open to freelance, collaborations, and full-time roles.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-12">

          {/* Form — takes 3 cols */}
          <div className="md:col-span-3">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Name" required className={inputClass} />
                <input type="email" name="email" placeholder="Email" required className={inputClass} />
              </div>
              <input type="text" name="subject" placeholder="Subject" required className={inputClass} />
              <textarea
                name="message"
                rows={5}
                placeholder="Tell me about your project..."
                required
                className={`${inputClass} resize-none`}
              />
              {/* Honeypot */}
              <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
              <button
                type="submit"
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg shadow-cyan-500/20 text-sm"
              >
                <Send size={15} />
                Send Message
              </button>
            </form>
          </div>

          {/* Info — takes 2 cols */}
          <div className="md:col-span-2 flex flex-col gap-8 pt-1">
            <div>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-3">Reach me at</p>
              <div className="flex flex-col gap-5">
                <a
                  href={decodedEmail ? `mailto:${decodedEmail}` : undefined}
                  className="flex items-start gap-3 group"
                >
                  <div className="mt-0.5 p-2 rounded-md bg-slate-800 border border-slate-700 group-hover:border-cyan-500/40 transition-colors">
                    <Mail size={14} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Email</p>
                    <p className="text-sm text-slate-300 group-hover:text-cyan-400 transition-colors">
                      {decodedEmail || '···'}
                    </p>
                  </div>
                </a>

                <a
                  href="https://github.com/decentaro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <div className="mt-0.5 p-2 rounded-md bg-slate-800 border border-slate-700 group-hover:border-cyan-500/40 transition-colors">
                    <GitBranch size={14} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">GitHub</p>
                    <p className="text-sm text-slate-300 group-hover:text-cyan-400 transition-colors">
                      github.com/decentaro
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-md bg-slate-800 border border-slate-700">
                    <MapPin size={14} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Based in</p>
                    <p className="text-sm text-slate-300">Las Vegas, Nevada</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-700/50">
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2">Availability</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-slate-300">Open to opportunities</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
