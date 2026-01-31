import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  ExternalLink, 
  ArrowLeft, 
  Eye, 
  MousePointer 
} from 'lucide-react';
import { format } from 'date-fns';
import { Layout } from '@/components/Layout';
import { AlbumCard } from '@/components/AlbumCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAlbums } from '@/hooks/useAlbums';

const AlbumDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getAlbumBySlug, getPublicAlbums, incrementViewCount, incrementClickCount } = useAlbums();

  const album = slug ? getAlbumBySlug(slug) : null;
  const publicAlbums = getPublicAlbums();

  // Increment view count on mount
  useEffect(() => {
    if (album) {
      incrementViewCount(album.id);
    }
  }, [album?.id]);

  // Get related albums
  const relatedAlbums = useMemo(() => {
    if (!album) return [];
    return publicAlbums
      .filter(
        (a) =>
          a.id !== album.id &&
          (a.tags.some((tag) => album.tags.includes(tag)) ||
            new Date(a.eventDate).getFullYear() === new Date(album.eventDate).getFullYear())
      )
      .slice(0, 3);
  }, [album, publicAlbums]);

  const handleOpenAlbum = () => {
    if (album) {
      incrementClickCount(album.id);
      window.open(album.externalAlbumUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (!album) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-display text-3xl font-medium mb-4">Album Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The album you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/albums">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Albums
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Back Button */}
      <div className="container mx-auto px-4 md:px-6 pt-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button asChild variant="ghost" size="sm">
            <Link to="/albums">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Albums
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Hero Image */}
      <section className="container mx-auto px-4 md:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden"
        >
          <img
            src={album.coverImageUrl}
            alt={album.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {album.featured && (
            <Badge className="absolute top-6 left-6 bg-primary/90 backdrop-blur-sm">
              Featured
            </Badge>
          )}
        </motion.div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mb-6">
              {album.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(album.eventDate), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{album.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{album.viewCount} views</span>
              </div>
              <div className="flex items-center gap-2">
                <MousePointer className="h-4 w-4" />
                <span>{album.clickCount} clicks</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {album.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
              {album.description}
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={handleOpenAlbum} className="group">
                Open Album
                <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contact About This Shoot</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Albums */}
      {relatedAlbums.length > 0 && (
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-2xl md:text-3xl font-medium">
                Related Albums
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedAlbums.map((album, index) => (
                <AlbumCard key={album.id} album={album} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default AlbumDetailPage;
