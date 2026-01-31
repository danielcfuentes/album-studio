import { Link } from 'react-router-dom';
import { Camera, Instagram, Youtube } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

export function Footer() {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Camera className="h-6 w-6" />
              <span className="font-display text-xl font-semibold">
                {settings.photographerName}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {settings.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Albums', href: '/albums' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="font-medium mb-4">Connect</h3>
            <div className="flex gap-4 mb-6">
              {settings.socialLinks.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-secondary hover:bg-accent transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings.socialLinks.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-secondary hover:bg-accent transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              )}
            </div>
            <Link
              to="/admin/login"
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              Photographer Login
            </Link>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} {settings.photographerName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
