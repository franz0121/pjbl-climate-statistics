import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
}

export const StudentCapIcon: React.FC<IconProps> = ({ size = 56, color = '#0066cc' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M32 6L2 20l30 14 30-14L32 6z" fill={color} opacity="0.9"/>
    <path d="M10 28v10c0 4 10 10 22 10s22-6 22-10V28L32 40 10 28z" fill={color} opacity="0.5"/>
    <circle cx="54" cy="26" r="3" fill={color}/>
  </svg>
);

export const TeacherCalendarIcon: React.FC<IconProps> = ({ size = 56, color = '#0066cc' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="8" y="12" width="48" height="40" rx="6" fill={color} opacity="0.15" />
    <rect x="8" y="20" width="48" height="28" rx="4" fill={color} opacity="0.25" />
    <rect x="14" y="26" width="10" height="8" rx="2" fill={color} />
    <rect x="28" y="26" width="10" height="8" rx="2" fill={color} />
    <rect x="42" y="26" width="10" height="8" rx="2" fill={color} />
    <rect x="14" y="38" width="10" height="8" rx="2" fill={color} />
    <rect x="28" y="38" width="10" height="8" rx="2" fill={color} />
    <line x1="20" y1="8" x2="20" y2="16" stroke={color} strokeWidth="4" strokeLinecap="round" />
    <line x1="44" y1="8" x2="44" y2="16" stroke={color} strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const AdminShieldIcon: React.FC<IconProps> = ({ size = 56, color = '#0066cc' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M32 6l20 6v16c0 14-20 24-20 24S12 42 12 28V12l20-6z" fill={color} opacity="0.2" />
    <path d="M32 10l16 4v14c0 10-16 18-16 18S16 38 16 28V14l16-4z" fill={color} />
    <path d="M32 18v20" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    <path d="M22 28h20" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export default { StudentCapIcon, TeacherCalendarIcon, AdminShieldIcon };

// Header badge outlined variants (white outlines)
export const HeaderStudentIcon: React.FC<IconProps> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M32 6L2 20l30 14 30-14L32 6z" stroke="#ffffff" strokeWidth="4" strokeLinejoin="round" />
    <path d="M10 28v10c0 4 10 10 22 10s22-6 22-10V28L32 40 10 28z" stroke="#ffffff" strokeWidth="4" strokeLinejoin="round" />
  </svg>
);

export const HeaderTeacherIcon: React.FC<IconProps> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="8" y="12" width="48" height="40" rx="6" stroke="#ffffff" strokeWidth="4" />
    <rect x="12" y="22" width="40" height="22" rx="4" stroke="#ffffff" strokeWidth="4" />
    <rect x="18" y="26" width="10" height="8" rx="2" stroke="#ffffff" strokeWidth="4" />
    <rect x="32" y="26" width="10" height="8" rx="2" stroke="#ffffff" strokeWidth="4" />
    <rect x="18" y="38" width="10" height="8" rx="2" stroke="#ffffff" strokeWidth="4" />
    <rect x="32" y="38" width="10" height="8" rx="2" stroke="#ffffff" strokeWidth="4" />
  </svg>
);

export const HeaderAdminIcon: React.FC<IconProps> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M32 6l20 6v16c0 14-20 24-20 24S12 42 12 28V12l20-6z" stroke="#ffffff" strokeWidth="4" strokeLinejoin="round" />
    <path d="M22 28h20" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
    <path d="M32 18v20" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
  </svg>
);
