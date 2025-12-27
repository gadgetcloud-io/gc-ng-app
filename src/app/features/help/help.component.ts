/**
 * Help & Support Component
 *
 * FAQ and support contact information
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FAQ {
  question: string;
  answer: string;
  category: string;
  expanded?: boolean;
}

interface SupportChannel {
  icon: string;
  title: string;
  description: string;
  action: string;
  link: string;
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent {
  faqs: FAQ[] = [
    {
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page. Enter your registered email address, and we\'ll send you a password reset link.',
      category: 'Account',
      expanded: false
    },
    {
      question: 'How can I update my profile information?',
      answer: 'Go to "My Profile" from the user menu in the top right corner. Click "Edit Profile" to update your name, mobile number, and other details.',
      category: 'Account',
      expanded: false
    },
    {
      question: 'How do I change my notification preferences?',
      answer: 'Navigate to Settings and select the Notifications section. You can toggle email, SMS, and push notifications on or off.',
      category: 'Settings',
      expanded: false
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use industry-standard encryption and security measures to protect your data. All sensitive information is encrypted both in transit and at rest.',
      category: 'Security',
      expanded: false
    },
    {
      question: 'How do I enable two-factor authentication?',
      answer: 'Go to Settings > Security and toggle on "Two-Factor Authentication". Follow the setup instructions to secure your account.',
      category: 'Security',
      expanded: false
    },
    {
      question: 'Who can I contact for technical support?',
      answer: 'You can reach our support team via email at support@gadgetcloud.io or use the live chat feature during business hours (9 AM - 6 PM IST).',
      category: 'Support',
      expanded: false
    }
  ];

  supportChannels: SupportChannel[] = [
    {
      icon: 'email',
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      action: 'support@gadgetcloud.io',
      link: 'mailto:support@gadgetcloud.io'
    },
    {
      icon: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: 'Start Chat',
      link: '#'
    },
    {
      icon: 'phone',
      title: 'Phone Support',
      description: 'Call us during business hours',
      action: '+91 80 1234 5678',
      link: 'tel:+918012345678'
    },
    {
      icon: 'docs',
      title: 'Documentation',
      description: 'Browse our knowledge base',
      action: 'View Docs',
      link: '#'
    }
  ];

  toggleFAQ(faq: FAQ): void {
    faq.expanded = !faq.expanded;
  }

  getCategories(): string[] {
    return [...new Set(this.faqs.map(faq => faq.category))];
  }

  getFAQsByCategory(category: string): FAQ[] {
    return this.faqs.filter(faq => faq.category === category);
  }
}
