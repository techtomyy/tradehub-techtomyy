export interface LandingStat {
  value: string;
  label: string;
}

export interface TrustBadge {
  icon: any;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

export interface HowItWorksStep {
  icon: any;
  iconBg: string;
  iconColor: string;
  stepNumber: string;
  title: string;
  description: string;
}

export interface SecurityFeature {
  icon: any;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

export interface Testimonial {
  rating: number;
  quote: string;
  author: string;
  initials: string;
  role: string;
  bgColor: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterLink {
  href: string;
  label: string;
}
