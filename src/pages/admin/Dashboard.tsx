import { motion } from 'framer-motion';
import { Image, Eye, MousePointer, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAlbums } from '@/hooks/useAlbums';

const AdminDashboard = () => {
  const { albums } = useAlbums();

  const stats = [
    {
      label: 'Total Albums',
      value: albums.length,
      icon: Image,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      label: 'Total Views',
      value: albums.reduce((sum, a) => sum + a.viewCount, 0),
      icon: Eye,
      color: 'bg-green-500/10 text-green-500',
    },
    {
      label: 'Total Clicks',
      value: albums.reduce((sum, a) => sum + a.clickCount, 0),
      icon: MousePointer,
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      label: 'Featured',
      value: albums.filter((a) => a.featured).length,
      icon: Star,
      color: 'bg-yellow-500/10 text-yellow-500',
    },
  ];

  const recentAlbums = [...albums]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-medium">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your albums.
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/albums">Manage Albums</Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Albums */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Albums</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAlbums.length > 0 ? (
              <div className="space-y-4">
                {recentAlbums.map((album) => (
                  <div
                    key={album.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <img
                      src={album.coverImageUrl}
                      alt={album.title}
                      className="w-16 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{album.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {album.viewCount} views • {album.clickCount} clicks
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {album.featured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          album.visibility === 'public'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-orange-500/10 text-orange-500'
                        }`}
                      >
                        {album.visibility}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No albums yet. Create your first album!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
