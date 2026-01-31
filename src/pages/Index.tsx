import { Layout } from '@/components/Layout';
import { Hero } from '@/components/Hero';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import { AlbumGrid } from '@/components/AlbumGrid';
import { useAlbums } from '@/hooks/useAlbums';
import { AlbumGridSkeleton } from '@/components/AlbumSkeleton';

const Index = () => {
  const { getPublicAlbums, getFeaturedAlbums, loading } = useAlbums();
  
  const publicAlbums = getPublicAlbums();
  const featuredAlbums = getFeaturedAlbums();
  const recentAlbums = publicAlbums.slice(0, 6);

  return (
    <Layout>
      <Hero />
      
      {loading ? (
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6">
            <AlbumGridSkeleton count={3} />
          </div>
        </section>
      ) : (
        <>
          <FeaturedCarousel albums={featuredAlbums} />
          
          <AlbumGrid
            albums={recentAlbums}
            title="Recent Work"
            subtitle="Portfolio"
            showViewAll={publicAlbums.length > 6}
          />
        </>
      )}
    </Layout>
  );
};

export default Index;
