'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface ForgotPasswordState {
  email: string;
}

interface ForgotPasswordErrors {
  email?: string;
  general?: string;
}

const ForgotPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState<ForgotPasswordState>({
    email: '',
  });

  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ForgotPasswordErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSubmitted(true);
      console.log('Reset email sent to:', formData.email);
    } catch (error) {
      setErrors({ general: 'Failed to send reset email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({ email: value });

    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Password Reset Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center font-bold text-lg">
              E
            </div>
          </div>

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
                <p className="text-slate-400 text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm font-medium">{errors.general}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5 mb-6">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className={`w-full bg-slate-700/30 border rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all ${
                        errors.email ? 'border-red-500' : 'border-slate-600'
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-2">{errors.email}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-2 group"
                >
                  {isLoading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      <span>Sending Reset Link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-teal-400 hover:text-teal-300 transition-colors font-medium inline-flex items-center gap-1"
                >
                  ← Back to Sign In
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle size={32} className="text-white" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-3">Check Your Email</h2>
                <p className="text-slate-400 mb-6">
                  We've sent a password reset link to{' '}
                  <span className="text-white font-medium break-all">{formData.email}</span>
                </p>

                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 mb-6 text-sm text-slate-300">
                  <p className="mb-2 font-medium">Next steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400">
                    <li>Check your email inbox</li>
                    <li>Click the reset link in the email</li>
                    <li>Create your new password</li>
                    <li>Sign in with your new password</li>
                  </ol>
                </div>

                <p className="text-xs text-slate-500 mb-4">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ email: '' });
                    }}
                    className="text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    try again
                  </button>
                  .
                </p>

                <Link
                  href="/login"
                  className="w-full px-4 py-3 bg-slate-700/20 hover:bg-slate-700/40 border border-slate-600 hover:border-slate-500 rounded-lg text-slate-300 hover:text-white font-semibold transition-all inline-flex items-center justify-center gap-2"
                >
                  Back to Sign In
                  <ArrowRight size={18} />
                </Link>
              </div>
            </>
          )}

          {/* Footer */}
          <p className="text-center text-xs text-slate-500 mt-8">
            Need help?{' '}
            <Link href="/support" className="text-teal-400 hover:text-teal-300">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;