import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Pencil, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAlbums } from '@/hooks/useAlbums';
import { useToast } from '@/hooks/use-toast';
import { Album } from '@/types/album';
import { format } from 'date-fns';
import { AlbumForm } from '@/components/AlbumForm';

const AdminAlbumsPage = () => {
  const { albums, deleteAlbum, createAlbum, updateAlbum } = useAlbums();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [deletingAlbum, setDeletingAlbum] = useState<Album | null>(null);

  const filteredAlbums = albums.filter(
    (album) =>
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (album.location ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setEditingAlbum(null);
    setIsFormOpen(true);
  };

  const handleEdit = (album: Album) => {
    setEditingAlbum(album);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingAlbum) return;
    try {
      await deleteAlbum(deletingAlbum.id);
      toast({
        title: 'Album deleted',
        description: `"${deletingAlbum.title}" has been removed.`,
      });
      setDeletingAlbum(null);
    } catch (err) {
      toast({
        title: 'Failed to delete',
        description: err instanceof Error ? err.message : 'Could not delete album.',
        variant: 'destructive',
      });
    }
  };

  const handleFormSubmit = async (data: Omit<Album, 'id' | 'createdAt' | 'viewCount' | 'clickCount'>) => {
    try {
      if (editingAlbum) {
        await updateAlbum(editingAlbum.id, data);
        toast({
          title: 'Album updated',
          description: `"${data.title}" has been updated.`,
        });
      } else {
        await createAlbum(data);
        toast({
          title: 'Album created',
          description: `"${data.title}" has been added.`,
        });
      }
      setIsFormOpen(false);
      setEditingAlbum(null);
    } catch (err) {
      toast({
        title: 'Failed to save',
        description: err instanceof Error ? err.message : 'Could not save album.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-medium">Albums</h1>
            <p className="text-muted-foreground">
              Manage your photo albums and gallery links.
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Album
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-xl border overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Cover</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden lg:table-cell">Views</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlbums.length > 0 ? (
                filteredAlbums.map((album) => (
                  <TableRow key={album.id}>
                    <TableCell>
                      <img
                        src={album.coverImageUrl}
                        alt={album.title}
                        className="w-16 h-12 rounded-lg object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{album.title}</span>
                        {album.featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {album.location}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(new Date(album.eventDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {album.viewCount}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                          album.visibility === 'public'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-orange-500/10 text-orange-500'
                        }`}
                      >
                        {album.visibility === 'public' ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <EyeOff className="h-3 w-3" />
                        )}
                        {album.visibility}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(album)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingAlbum(album)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <p className="text-muted-foreground">
                      {searchQuery ? 'No albums match your search.' : 'No albums yet.'}
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </motion.div>
      </div>

      {/* Album Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAlbum ? 'Edit Album' : 'Create New Album'}
            </DialogTitle>
            <DialogDescription>
              {editingAlbum
                ? 'Update the album details below.'
                : 'Fill in the details to create a new album.'}
            </DialogDescription>
          </DialogHeader>
          <AlbumForm
            album={editingAlbum}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingAlbum} onOpenChange={() => setDeletingAlbum(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Album</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingAlbum?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingAlbum(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminAlbumsPage;
