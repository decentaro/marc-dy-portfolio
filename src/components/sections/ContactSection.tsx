import React from 'react';
import { Github, Mail } from 'lucide-react';
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
    
    // Rate limiting check
    if (isRateLimited()) {
      const remainingTime = getRemainingCooldown();
      showNotification(`Please wait ${remainingTime} seconds before sending another message.`, 'error');
      return;
    }
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Form validation
    const validation = validateForm(formData);
    if (!validation.valid) {
      showNotification(validation.error!, 'error');
      return;
    }
    
    // Add honeypot field check (if bot filled it)
    if (formData.get('website')) {
      showNotification('Spam detected.', 'error');
      return;
    }
    
    recordSubmission();
    
    try {
      await fetch('https://formspree.io/f/mkgzqynj', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      form.reset();
      showNotification('Message sent successfully!', 'success');
    } catch {
      showNotification('Error sending message. Please try again.', 'error');
    }
  };

  return (
    <section id="contact" className="py-20 px-4 bg-black/20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Get In Touch</h2>
          <p className="text-gray-300 text-xl">Let&apos;s work together</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Send a Message</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                required
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <textarea
                name="message"
                rows={4}
                placeholder="Your Message"
                required
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
              ></textarea>
              
              {/* Honeypot field - hidden from users, visible to bots */}
              <input
                type="text"
                name="website"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-400" size={20} />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white email-obfuscated">
                    {decodedEmail ? (
                      <a href={`mailto:${decodedEmail}`} className="hover:text-blue-400 transition-colors">
                        {decodedEmail}
                      </a>
                    ) : (
                      'Loading email...'
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Github className="text-blue-400" size={20} />
                <div>
                  <p className="text-gray-400 text-sm">GitHub</p>
                  <a 
                    href="https://github.com/decentaro" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    github.com/decentaro
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;