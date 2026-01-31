import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { AlbumCard } from '@/components/AlbumCard';
import { FilterBar } from '@/components/FilterBar';
import { AlbumGridSkeleton } from '@/components/AlbumSkeleton';
import { useAlbums } from '@/hooks/useAlbums';

const AlbumsPage = () => {
  const { getPublicAlbums, loading } = useAlbums();
  const publicAlbums = getPublicAlbums();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeYear, setActiveYear] = useState<string | null>(null);

  // Extract unique tags and years
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    publicAlbums.forEach((album) => album.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [publicAlbums]);

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    publicAlbums.forEach((album) => {
      const year = new Date(album.eventDate).getFullYear().toString();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [publicAlbums]);

  // Filter and sort albums
  const filteredAlbums = useMemo(() => {
    let result = [...publicAlbums];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (album) =>
          album.title.toLowerCase().includes(query) ||
          album.description.toLowerCase().includes(query) ||
          album.location.toLowerCase().includes(query) ||
          album.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Tag filter
    if (activeTag) {
      result = result.filter((album) => album.tags.includes(activeTag));
    }

    // Year filter
    if (activeYear) {
      result = result.filter(
        (album) => new Date(album.eventDate).getFullYear().toString() === activeYear
      );
    }

    // Sort
    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
        break;
      case 'popular':
        result.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
    }

    return result;
  }, [publicAlbums, searchQuery, sortBy, activeTag, activeYear]);

  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Browse
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium mb-4">
              All Albums
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Explore our complete collection of photo albums from weddings, portraits, events, and more.
            </p>
          </motion.div>

          {/* Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <FilterBar
              onSearch={setSearchQuery}
              onSortChange={setSortBy}
              onTagFilter={setActiveTag}
              onYearFilter={setActiveYear}
              availableTags={availableTags}
              availableYears={availableYears}
              activeTag={activeTag}
              activeYear={activeYear}
            />
          </motion.div>

          {/* Results count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-muted-foreground mb-8"
          >
            Showing {filteredAlbums.length} album{filteredAlbums.length !== 1 ? 's' : ''}
          </motion.p>

          {/* Album Grid */}
          {loading ? (
            <AlbumGridSkeleton count={6} />
          ) : filteredAlbums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredAlbums.map((album, index) => (
                <AlbumCard key={album.id} album={album} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground">No albums match your filters.</p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AlbumsPage;
