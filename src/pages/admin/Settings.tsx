import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUrlOrUpload } from '@/components/ImageUrlOrUpload';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/hooks/use-toast';

const AdminSettingsPage = () => {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const [formData, setFormData] = useState(settings);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(formData);
      toast({
        title: 'Settings saved',
        description: 'Your site settings have been updated.',
      });
    } catch (err) {
      toast({
        title: 'Failed to save',
        description: err instanceof Error ? err.message : 'Could not save settings.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-medium">Settings</h1>
          <p className="text-muted-foreground">
            Customize your site's appearance and information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>
                  Basic information about your photography business.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="photographerName">Photographer Name</Label>
                  <Input
                    id="photographerName"
                    value={formData.photographerName}
                    onChange={(e) =>
                      setFormData({ ...formData, photographerName: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) =>
                      setFormData({ ...formData, tagline: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <ImageUrlOrUpload
                    id="logoUrl"
                    label="Logo (optional)"
                    value={formData.logoUrl || ''}
                    onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                    placeholder="Paste logo URL or upload"
                    uploadFolder="settings"
                    previewClassName="mt-2 h-16 w-auto max-w-[200px] object-contain rounded"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact & Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Contact & Location</CardTitle>
                <CardDescription>
                  Email, phone, and location shown on the Contact page.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="hello@example.com"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 (234) 567-890"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="New York"
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* About Me */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
                <CardDescription>
                  Bio and photo for the About page. Use paragraphs separated by a blank line.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <ImageUrlOrUpload
                    id="aboutImageUrl"
                    label="About photo"
                    value={formData.aboutImageUrl || ''}
                    onChange={(url) => setFormData({ ...formData, aboutImageUrl: url })}
                    placeholder="Paste image URL or upload"
                    uploadFolder="settings"
                    previewClassName="mt-2 aspect-[4/5] max-h-48 w-auto object-cover rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="aboutMe">About me text</Label>
                  <Textarea
                    id="aboutMe"
                    value={formData.aboutMe || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, aboutMe: e.target.value })
                    }
                    placeholder="Tell your story..."
                    rows={8}
                    className="mt-2 resize-y"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>
                  Connect your social media profiles.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.socialLinks.instagram || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                      })
                    }
                    placeholder="https://instagram.com/yourhandle"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="tiktok">TikTok</Label>
                  <Input
                    id="tiktok"
                    value={formData.socialLinks.tiktok || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, tiktok: e.target.value },
                      })
                    }
                    placeholder="https://tiktok.com/@yourhandle"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.socialLinks.website || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, website: e.target.value },
                      })
                    }
                    placeholder="https://yourwebsite.com"
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <Button type="submit" size="lg">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
