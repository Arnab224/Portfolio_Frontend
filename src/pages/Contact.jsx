// src/pages/Contact.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MatrixBackground from '../components/MatrixBackground';
import GridOverlay from '../components/GridOverlay';
import { CONTACT_API } from "../api/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitStatus('');

  try {
    const response = await fetch(CONTACT_API.SEND_EMAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } else {
      setSubmitStatus('error');
      console.error(data.message);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    setSubmitStatus('error');
  } finally {
    setIsSubmitting(false);
  }
};

  const contactMethods = [
    {
      name: 'Email',
      value: 'mandal.arnab.abc.224@gmail.com',
      icon: '📧',
      color: 'green',
      command: 'mailto:mandal.arnab.abc.224@gmail.com'
    },
    {
      name: 'Phone',
      value: '+91 9877574156',
      icon: '📱',
      color: 'blue',
      command: 'tel:+919877574156'
    },
    {
      name: 'Location',
      value: 'Badkulla, West Bengal, India - 741121',
      icon: '📍',
      color: 'purple',
      command: null
    },
    {
      name: 'LinkedIn',
      value: '@arnab-mandal',
      icon: '💼',
      color: 'blue',
      command: 'https://www.linkedin.com/in/arnab224/'
    },
    {
      name: 'GitHub',
      value: '@arnab-mandal',
      icon: '🐙',
      color: 'gray',
      command: 'https://github.com/Arnab224/'
    }
  ];

  return (
    <div className="pt-20 min-h-screen relative cyber-grid">
      <MatrixBackground />
  <GridOverlay />

      
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 font-mono"
        >
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-gray-400">~/</span>
            <span className="terminal-text">contact</span>
          </h1>
          <p className="text-gray-400 text-lg">
            $ ./connect.sh --protocol=secure --user=arnab
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-black border border-green-500/30 rounded-lg p-6 font-mono"
          >
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-400 text-sm">contact_form — active</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-green-400 text-sm mb-2">
                  $ NAME =
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border border-green-500/30 text-green-400 px-4 py-3 rounded focus:outline-none focus:border-green-500 focus:glow-primary font-mono placeholder-gray-600"
                  placeholder="Enter your name..."
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-blue-400 text-sm mb-2">
                  $ EMAIL =
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border border-blue-500/30 text-blue-400 px-4 py-3 rounded focus:outline-none focus:border-blue-500 focus:glow-secondary font-mono placeholder-gray-600"
                  placeholder="your.email@domain.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-purple-400 text-sm mb-2">
                  $ MESSAGE =
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full bg-black border border-purple-500/30 text-purple-400 px-4 py-3 rounded focus:outline-none focus:border-purple-500 focus:glow-primary font-mono placeholder-gray-600 resize-none"
                  placeholder="Type your message here..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-green-500/10 hover:bg-green-500/20 disabled:bg-green-500/5 text-green-400 border border-green-500/50 hover:border-green-500 disabled:border-green-500/30 px-6 py-3 rounded font-mono text-sm transition-all duration-300 hover:glow-primary disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-pulse">SENDING PACKETS</span>
                    <span className="ml-2 terminal-cursor">█</span>
                  </span>
                ) : (
                  '$ ./send_message.sh --encrypt=true'
                )}
              </motion.button>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-green-400 text-center text-sm border border-green-500/30 bg-green-500/10 p-3 rounded"
                >
                  ✓ MESSAGE TRANSMISSION SUCCESSFUL
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-center text-sm border border-red-500/30 bg-red-500/10 p-3 rounded"
                >
                  ✗ TRANSMISSION FAILED - RETRY REQUIRED
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-black border border-blue-500/30 rounded-lg p-6 font-mono">
              <h2 className="text-blue-400 text-xl mb-4">
                $ whoami && pwd
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Full Stack Developer with experience building scalable applications. 
                Always interested in new opportunities and exciting projects.
              </p>
              <div className="text-green-400 text-sm">
                <div>• Open to full-time opportunities</div>
                <div>• Available for freelance projects</div>
                <div>• Let&apos;s build something amazing together</div>
              </div>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`bg-black border border-${method.color}-500/30 rounded-lg p-4 font-mono group hover:border-${method.color}-500/50 transition-all duration-300`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{method.icon}</span>
                      <div>
                        <div className={`text-${method.color}-400 text-sm`}>
                          {method.name}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {method.value}
                        </div>
                      </div>
                    </div>
                    {method.command && (
                      <a
                        href={method.command}
                        className={`text-xs px-3 py-1 border border-${method.color}-500/30 text-${method.color}-400 rounded hover:bg-${method.color}-500/10 hover:glow-${method.color === 'green' ? 'primary' : 'secondary'} transition-all duration-300`}
                      >
                        connect
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="bg-black border border-green-500/30 rounded-lg p-4 font-mono"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">STATUS: ONLINE</span>
                </div>
                <span className="text-gray-400 text-xs">PING: &lt;50ms</span>
              </div>
              <div className="text-gray-400 text-xs mt-2">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;