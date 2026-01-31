import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Album } from '@/types/album';
import { AlbumCard } from './AlbumCard';
import { Button } from '@/components/ui/button';

interface AlbumGridProps {
  albums: Album[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  columns?: 2 | 3 | 4;
}

export function AlbumGrid({ 
  albums, 
  title, 
  subtitle, 
  showViewAll = false,
  columns = 3 
}: AlbumGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            {subtitle && (
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium">
                {title}
              </h2>
            )}
          </motion.div>
        )}

        {albums.length > 0 ? (
          <>
            <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6 md:gap-8`}>
              {albums.map((album, index) => (
                <AlbumCard key={album.id} album={album} index={index} />
              ))}
            </div>

            {showViewAll && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-center mt-12"
              >
                <Button asChild variant="outline" size="lg" className="group">
                  <Link to="/albums">
                    View All Albums
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground">No albums found.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
