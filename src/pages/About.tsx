import { motion } from 'framer-motion';
import { Instagram, Globe, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/useSettings';

const AboutPage = () => {
  const { settings } = useSettings();

  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src={settings.aboutImageUrl || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80'}
                  alt={settings.photographerName}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-secondary rounded-2xl -z-10" />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
                About Me
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-medium mb-8">
                {settings.photographerName}
              </h1>

              <div className="space-y-6 text-muted-foreground mb-10">
                {settings.aboutMe ? (
                  settings.aboutMe.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))
                ) : (
                  <>
                    <p>
                      With over a decade of experience capturing life's most precious moments,
                      I've had the privilege of documenting hundreds of weddings, family gatherings,
                      and milestone celebrations.
                    </p>
                    <p>
                      My approach combines candid documentary-style photography with timeless
                      artistic portraits. I believe the best images come from genuine connections
                      and authentic moments – not forced poses.
                    </p>
                  </>
                )}
              </div>

              {/* Social Links */}
              <div className="flex gap-4 mb-10">
                {settings.socialLinks.instagram && (
                  <a
                    href={settings.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-secondary hover:bg-accent transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {settings.socialLinks.website && (
                  <a
                    href={settings.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-secondary hover:bg-accent transition-colors"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link to="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Get in Touch
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/albums">View My Work</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
