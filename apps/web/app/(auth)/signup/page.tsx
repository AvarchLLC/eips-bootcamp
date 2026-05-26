'use client';

import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface SignupFormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  subscribeToNewsletter: boolean;
}

interface SignupErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  general?: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormState>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeToNewsletter: true,
  });

  const [errors, setErrors] = useState<SignupErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: 'No password',
    color: 'bg-slate-500',
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  });

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;

    let label = 'Weak';
    let color = 'bg-red-500';

    if (score === 5) {
      label = 'Very Strong';
      color = 'bg-emerald-500';
    } else if (score === 4) {
      label = 'Strong';
      color = 'bg-teal-500';
    } else if (score === 3) {
      label = 'Fair';
      color = 'bg-amber-500';
    } else if (score === 0) {
      label = 'No password';
      color = 'bg-slate-500';
    }

    return { score, label, color, requirements };
  };

  const validateForm = (): boolean => {
    const newErrors: SignupErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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

      setSuccessMessage('Account created successfully! Redirecting to dashboard...');
      console.log('Signup data:', {
        ...formData,
        confirmPassword: undefined, // Don't log confirm password
      });

      // Reset form
      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          agreeToTerms: false,
          subscribeToNewsletter: true,
        });
        setSuccessMessage('');
      }, 1500);
    } catch (error) {
      setErrors({ general: 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof SignupFormState
  ) => {
    let value: string | boolean = e.target.value;

    if (
      field === 'agreeToTerms' ||
      field === 'subscribeToNewsletter'
    ) {
      value = (e.target as HTMLInputElement).checked;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Update password strength
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value as string));
    }

    // Clear error for this field when user starts typing
    if (errors[field as keyof SignupErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 py-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Signup Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center font-bold text-lg">
              E
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-slate-400 text-sm">
              Join EIPInsight and start your Ethereum learning journey today
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg flex items-start gap-3">
              <CheckCircle size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-emerald-300 text-sm font-medium">{successMessage}</p>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm font-medium">{errors.general}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange(e, 'fullName')}
                  placeholder="John Doe"
                  className={`w-full bg-slate-700/30 border rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all ${
                    errors.fullName ? 'border-red-500' : 'border-slate-600'
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-400 text-sm mt-2">{errors.fullName}</p>
              )}
            </div>

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
                  onChange={(e) => handleInputChange(e, 'email')}
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

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange(e, 'password')}
                  placeholder="••••••••"
                  className={`w-full bg-slate-700/30 border rounded-lg pl-12 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all ${
                    errors.password ? 'border-red-500' : 'border-slate-600'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Password strength:</span>
                    <span className={`text-xs font-semibold ${passwordStrength.color.replace('bg-', 'text-')}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>

                  {/* Requirements */}
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          passwordStrength.requirements.length
                            ? 'bg-emerald-500'
                            : 'bg-slate-600'
                        }`}
                      ></div>
                      <span className="text-slate-400">8+ characters</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          passwordStrength.requirements.uppercase
                            ? 'bg-emerald-500'
                            : 'bg-slate-600'
                        }`}
                      ></div>
                      <span className="text-slate-400">Uppercase</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          passwordStrength.requirements.lowercase
                            ? 'bg-emerald-500'
                            : 'bg-slate-600'
                        }`}
                      ></div>
                      <span className="text-slate-400">Lowercase</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          passwordStrength.requirements.number
                            ? 'bg-emerald-500'
                            : 'bg-slate-600'
                        }`}
                      ></div>
                      <span className="text-slate-400">Number</span>
                    </div>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="text-red-400 text-sm mt-2">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange(e, 'confirmPassword')}
                  placeholder="••••••••"
                  className={`w-full bg-slate-700/30 border rounded-lg pl-12 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-slate-600'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-2">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              {/* Terms & Conditions */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange(e, 'agreeToTerms')}
                  className="w-4 h-4 mt-1 rounded bg-slate-700 border border-slate-600 text-teal-500 focus:ring-teal-500 cursor-pointer flex-shrink-0"
                  disabled={isLoading}
                />
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  I agree to the{' '}
                  <Link href="/terms" className="text-teal-400 hover:text-teal-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-teal-400 hover:text-teal-300">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="text-red-400 text-sm">{errors.agreeToTerms}</p>
              )}

              {/* Newsletter */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.subscribeToNewsletter}
                  onChange={(e) => handleInputChange(e, 'subscribeToNewsletter')}
                  className="w-4 h-4 rounded bg-slate-700 border border-slate-600 text-teal-500 focus:ring-teal-500 cursor-pointer"
                  disabled={isLoading}
                />
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  Subscribe to our newsletter for updates and announcements
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-2 group mt-2"
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-slate-800/50 to-slate-700/30 text-slate-400">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700/20 hover:bg-slate-700/40 border border-slate-600 hover:border-slate-500 rounded-lg text-slate-300 hover:text-white font-semibold transition-all"
          >
            Sign In
            <ArrowRight size={18} />
          </Link>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500 mt-6">
            We'll never share your data without permission. Read our{' '}
            <Link href="/privacy" className="text-teal-400 hover:text-teal-300">
              privacy policy
            </Link>
            .
          </p>
        </div>

        {/* Floating Card - Benefits */}
        <div className="mt-6 p-4 bg-slate-800/30 backdrop-blur border border-slate-700 rounded-lg border-dashed">
          <p className="text-xs text-slate-400 text-center">
            ✓ Free account • ✓ Instant access • ✓ No credit card required
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;