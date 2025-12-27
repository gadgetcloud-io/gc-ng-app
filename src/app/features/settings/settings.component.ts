/**
 * Settings Component
 *
 * Application settings and preferences
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  updates: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private';
  showEmail: boolean;
  showMobile: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  loading = false;

  notifications: NotificationSettings = {
    email: true,
    sms: false,
    push: true,
    updates: true
  };

  privacy: PrivacySettings = {
    profileVisibility: 'private',
    showEmail: false,
    showMobile: false
  };

  security: SecuritySettings = {
    twoFactorAuth: false,
    sessionTimeout: 30
  };

  timeoutOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' }
  ];

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    // TODO: Load settings from backend
    console.log('Loading settings...');
  }

  saveSettings(): void {
    this.loading = true;

    // TODO: Save settings to backend
    setTimeout(() => {
      console.log('Settings saved:', {
        notifications: this.notifications,
        privacy: this.privacy,
        security: this.security
      });
      this.loading = false;
    }, 1000);
  }

  resetToDefaults(): void {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      this.notifications = {
        email: true,
        sms: false,
        push: true,
        updates: true
      };
      this.privacy = {
        profileVisibility: 'private',
        showEmail: false,
        showMobile: false
      };
      this.security = {
        twoFactorAuth: false,
        sessionTimeout: 30
      };
    }
  }
}
