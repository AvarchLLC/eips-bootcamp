'use client';

import React, { useState } from 'react';
import {
  Bell,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Check,
  AlertCircle,
  Shield,
  LogOut,
} from 'lucide-react';

interface SettingsState {
  emailNotifications: boolean;
  courseUpdates: boolean;
  weeklyDigest: boolean;
  privateProfile: boolean;
  showEmail: boolean;
}

const ProfileSettings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    emailNotifications: true,
    courseUpdates: true,
    weeklyDigest: false,
    privateProfile: false,
    showEmail: false,
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleToggle = (key: keyof SettingsState) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-300 text-sm font-medium flex items-center gap-2">
          <Check size={18} />
          {successMessage}
        </div>
      )}

      {/* Privacy Settings */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-2xl p-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Shield size={20} className="text-teal-400" />
          Privacy & Visibility
        </h3>

        <div className="space-y-4">
          {/* Private Profile */}
          <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg hover:bg-slate-700/30 transition-colors">
            <div>
              <p className="font-medium text-white">Private Profile</p>
              <p className="text-sm text-slate-400">Hide your profile from public search</p>
            </div>
            <button
              onClick={() => handleToggle('privateProfile')}
              className={`relative w-14 h-8 rounded-full transition-all ${
                settings.privateProfile
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500'
                  : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.privateProfile ? 'translate-x-7' : 'translate-x-1'
                }`}
              ></div>
            </button>
          </div>

          {/* Show Email */}
          <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg hover:bg-slate-700/30 transition-colors">
            <div>
              <p className="font-medium text-white">Show Email</p>
              <p className="text-sm text-slate-400">Display email on your profile</p>
            </div>
            <button
              onClick={() => handleToggle('showEmail')}
              className={`relative w-14 h-8 rounded-full transition-all ${
                settings.showEmail
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500'
                  : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.showEmail ? 'translate-x-7' : 'translate-x-1'
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-2xl p-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Bell size={20} className="text-teal-400" />
          Notifications
        </h3>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg hover:bg-slate-700/30 transition-colors">
            <div>
              <p className="font-medium text-white">Email Notifications</p>
              <p className="text-sm text-slate-400">Receive important updates via email</p>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              className={`relative w-14 h-8 rounded-full transition-all ${
                settings.emailNotifications
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500'
                  : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                }`}
              ></div>
            </button>
          </div>

          {/* Course Updates */}
          <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg hover:bg-slate-700/30 transition-colors">
            <div>
              <p className="font-medium text-white">Course Updates</p>
              <p className="text-sm text-slate-400">Get notified about new course content</p>
            </div>
            <button
              onClick={() => handleToggle('courseUpdates')}
              className={`relative w-14 h-8 rounded-full transition-all ${
                settings.courseUpdates
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500'
                  : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.courseUpdates ? 'translate-x-7' : 'translate-x-1'
                }`}
              ></div>
            </button>
          </div>

          {/* Weekly Digest */}
          <div className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg hover:bg-slate-700/30 transition-colors">
            <div>
              <p className="font-medium text-white">Weekly Digest</p>
              <p className="text-sm text-slate-400">Receive a summary of your progress</p>
            </div>
            <button
              onClick={() => handleToggle('weeklyDigest')}
              className={`relative w-14 h-8 rounded-full transition-all ${
                settings.weeklyDigest
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500'
                  : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.weeklyDigest ? 'translate-x-7' : 'translate-x-1'
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-2xl p-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Lock size={20} className="text-teal-400" />
          Security
        </h3>

        <div className="space-y-4">
          {/* Change Password */}
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center justify-between p-4 bg-slate-700/20 rounded-lg hover:bg-slate-700/30 transition-colors group"
          >
            <div className="text-left">
              <p className="font-medium text-white">Change Password</p>
              <p className="text-sm text-slate-400">Update your password regularly</p>
            </div>
            <div className="text-slate-400 group-hover:text-teal-400 transition-colors">
              →
            </div>
          </button>

          {/* Active Sessions */}
          <button className="w-full flex items-center justify-between p-4 bg-slate-700/20 rounded-lg hover:bg-slate-700/30 transition-colors group">
            <div className="text-left">
              <p className="font-medium text-white">Active Sessions</p>
              <p className="text-sm text-slate-400">Manage your login sessions</p>
            </div>
            <div className="text-slate-400 group-hover:text-teal-400 transition-colors">
              →
            </div>
          </button>

          {/* Two-Factor Authentication */}
          <button className="w-full flex items-center justify-between p-4 bg-slate-700/20 rounded-lg hover:bg-slate-700/30 transition-colors group">
            <div className="text-left">
              <p className="font-medium text-white">Two-Factor Authentication</p>
              <p className="text-sm text-slate-400">Enable 2FA for extra security</p>
            </div>
            <div className="text-slate-400 group-hover:text-teal-400 transition-colors">
              →
            </div>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-gradient-to-br from-red-950/30 to-red-900/20 border border-red-700/30 rounded-2xl p-8">
        <h3 className="text-lg font-bold text-red-300 mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          Danger Zone
        </h3>

        <div className="space-y-4">
          {/* Logout */}
          <button className="w-full flex items-center justify-between p-4 bg-red-900/20 rounded-lg hover:bg-red-900/30 transition-colors group">
            <div className="text-left">
              <p className="font-medium text-white">Logout</p>
              <p className="text-sm text-slate-400">Sign out from your account</p>
            </div>
            <LogOut size={20} className="text-slate-400 group-hover:text-red-400 transition-colors" />
          </button>

          {/* Delete Account */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-between p-4 bg-red-900/20 rounded-lg hover:bg-red-900/30 transition-colors group"
          >
            <div className="text-left">
              <p className="font-medium text-white">Delete Account</p>
              <p className="text-sm text-slate-400">Permanently delete your account and data</p>
            </div>
            <Trash2 size={20} className="text-slate-400 group-hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSaveSettings}
        disabled={isSaving}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-all font-semibold"
      >
        {isSaving ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            Saving Settings...
          </>
        ) : (
          <>
            <Check size={20} />
            Save Settings
          </>
        )}
      </button>
    </div>
  );
};

export default ProfileSettings;