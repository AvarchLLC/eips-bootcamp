'use client';

import React, { useState, useRef } from 'react';
import {
  Edit2,
  Save,
  X,
  Camera,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Mail,
  MapPin,
  Award,
  Calendar,
  User,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  year: 'First Year' | 'Second Year' | 'Third Year' | 'Fourth Year' | 'Other';
  bio: string;
  profileImage: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  joinDate: string;
  badges: string[];
}

interface EditedProfile extends Omit<UserProfile, 'id' | 'email' | 'joinDate' | 'badges'> {
  id?: string;
  email?: string;
  joinDate?: string;
  badges?: string[];
}

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'Subhrajeet Kumar',
    email: 'subhrajeet@example.com',
    college: 'Indian Institute of Technology (IIT) Delhi',
    year: 'Third Year',
    bio: 'Passionate about Ethereum and smart contracts. Contributing to the EIP ecosystem and learning about protocol development.',
    profileImage:
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Subhrajeet&backgroundColor=c0aede&backgroundType=gradientLinear',
    socials: {
      github: 'subhrajeet-github',
      linkedin: 'subhrajeet-kumar',
      twitter: 'subhrajeet_eth',
      website: 'subhrajeet.dev',
    },
    joinDate: 'January 15, 2024',
    badges: ['Smart Contract Expert', 'Active Contributor', 'Course Completed'],
  });

  const [editedProfile, setEditedProfile] = useState<EditedProfile>(profile);

  const handleInputChange = (
    field: keyof EditedProfile,
    value: string | Record<string, string>
  ) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [platform]: value,
      },
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile((prev) => ({
          ...prev,
          profileImage: reader.result as string,
        }));
        setShowImageUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setProfile(editedProfile as UserProfile);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard"
            className="text-slate-400 hover:text-slate-300 transition-colors flex items-center gap-2"
          >
            ← Back to Dashboard
          </Link>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-lg transition-all font-medium"
            >
              <Edit2 size={18} />
              Edit Profile
            </button>
          )}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-300 text-sm font-medium flex items-center gap-2">
            ✓ {successMessage}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-2xl p-8 sticky top-20">
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="w-full aspect-square bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-xl overflow-hidden border-2 border-slate-600 group">
                  {isEditing ? (
                    <>
                      <img
                        src={editedProfile.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <Camera size={32} className="text-white" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </>
                  ) : (
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="text-center mb-6">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full bg-slate-700/30 border border-slate-600 text-white rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-white mb-1">{profile.name}</h1>
                )}

                <p className="text-slate-400 flex items-center justify-center gap-2 mb-4">
                  <Mail size={16} />
                  {profile.email}
                </p>

                {!isEditing && (
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                    <Calendar size={14} />
                    Joined {profile.joinDate}
                  </div>
                )}
              </div>

              {/* Badges */}
              {!isEditing && profile.badges.length > 0 && (
                <div className="space-y-3 border-t border-slate-700 pt-6">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Badges
                  </p>
                  <div className="space-y-2">
                    {profile.badges.map((badge, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/30 rounded-lg px-3 py-2"
                      >
                        <Award size={16} className="text-teal-400" />
                        <span className="text-sm text-teal-300">{badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2">
            {/* Education & Info Section */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-bold text-white mb-6">Education & Background</h2>

              <div className="space-y-6">
                {/* College */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-teal-400" />
                    College/University
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.college}
                      onChange={(e) => handleInputChange('college', e.target.value)}
                      placeholder="Your college or university"
                      className="w-full bg-slate-700/30 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  ) : (
                    <p className="text-slate-300 bg-slate-700/20 rounded-lg px-4 py-3">
                      {profile.college}
                    </p>
                  )}
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-teal-400" />
                    Year/Level
                  </label>
                  {isEditing ? (
                    <select
                      value={editedProfile.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className="w-full bg-slate-700/30 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    >
                      <option>First Year</option>
                      <option>Second Year</option>
                      <option>Third Year</option>
                      <option>Fourth Year</option>
                      <option>Other</option>
                    </select>
                  ) : (
                    <p className="text-slate-300 bg-slate-700/20 rounded-lg px-4 py-3">
                      {profile.year}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FileText size={20} className="text-teal-400" />
                Bio
              </h2>

              {isEditing ? (
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself, your interests, and your goals..."
                  rows={5}
                  className="w-full bg-slate-700/30 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none"
                />
              ) : (
                <p className="text-slate-300 bg-slate-700/20 rounded-lg px-4 py-4 leading-relaxed">
                  {profile.bio || 'No bio added yet'}
                </p>
              )}
            </div>

            {/* Social Links Section */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Globe size={20} className="text-teal-400" />
                Social Links
              </h2>

              <div className="space-y-4">
                {/* GitHub */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    <Github size={16} className="text-slate-400" />
                    GitHub
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.socials?.github || ''}
                      onChange={(e) => handleSocialChange('github', e.target.value)}
                      placeholder="github-username"
                      className="w-full bg-slate-700/30 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  ) : (
                    <div className="text-slate-300 bg-slate-700/20 rounded-lg px-4 py-3">
                      {profile.socials?.github ? (
                        <a
                          href={`https://github.com/${profile.socials.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-400 hover:text-teal-300 transition-colors"
                        >
                          {profile.socials.github}
                        </a>
                      ) : (
                        <span className="text-slate-500">Not added</span>
                      )}
                    </div>
                  )}
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    <Linkedin size={16} className="text-slate-400" />
                    LinkedIn
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.socials?.linkedin || ''}
                      onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                      placeholder="linkedin-profile-name"
                      className="w-full bg-slate-700/30 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  ) : (
                    <div className="text-slate-300 bg-slate-700/20 rounded-lg px-4 py-3">
                      {profile.socials?.linkedin ? (
                        <a
                          href={`https://linkedin.com/in/${profile.socials.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-400 hover:text-teal-300 transition-colors"
                        >
                          {profile.socials.linkedin}
                        </a>
                      ) : (
                        <span className="text-slate-500">Not added</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Twitter */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    <Twitter size={16} className="text-slate-400" />
                    Twitter
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.socials?.twitter || ''}
                      onChange={(e) => handleSocialChange('twitter', e.target.value)}
                      placeholder="twitter-handle"
                      className="w-full bg-slate-700/30 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  ) : (
                    <div className="text-slate-300 bg-slate-700/20 rounded-lg px-4 py-3">
                      {profile.socials?.twitter ? (
                        <a
                          href={`https://twitter.com/${profile.socials.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-400 hover:text-teal-300 transition-colors"
                        >
                          @{profile.socials.twitter}
                        </a>
                      ) : (
                        <span className="text-slate-500">Not added</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    <Globe size={16} className="text-slate-400" />
                    Personal Website
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.socials?.website || ''}
                      onChange={(e) => handleSocialChange('website', e.target.value)}
                      placeholder="yourwebsite.com"
                      className="w-full bg-slate-700/30 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  ) : (
                    <div className="text-slate-300 bg-slate-700/20 rounded-lg px-4 py-3">
                      {profile.socials?.website ? (
                        <a
                          href={`https://${profile.socials.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-400 hover:text-teal-300 transition-colors"
                        >
                          {profile.socials.website}
                        </a>
                      ) : (
                        <span className="text-slate-500">Not added</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-all font-semibold"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </button>

                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600 text-white rounded-lg transition-all font-semibold disabled:opacity-50"
                >
                  <X size={20} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;