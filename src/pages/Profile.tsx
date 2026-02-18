import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { LogOut, User, Mail, Phone, MapPin, Save, Edit2, Calendar, Clock } from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  location: string | null;
  bio: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export default function Profile() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    full_name: '',
    email: '',
    phone_number: '',
    location: '',
    bio: '',
    created_at: '',
    updated_at: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create one
          await createProfile();
        } else {
          throw error;
        }
      } else if (data) {
        // Auto-fill the form with profile data
        setProfile({
          id: data.id,
          full_name: data.full_name || '',
          email: data.email || user.email || '',
          phone_number: data.phone_number || '',
          location: data.location || '',
          bio: data.bio || '',
          created_at: data.created_at,
          updated_at: data.updated_at
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile data",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: user.id, // Use user_id (foreign key) not id (primary key)
            email: user.email,
            full_name: '',
            phone_number: '',
            location: '',
            bio: '',
          },
        ]);

      if (error) throw error;

      // Fetch the newly created profile
      await fetchProfile();
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create profile",
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Validate required fields
      if (!profile.full_name?.trim()) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Full name is required",
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name.trim(),
          phone_number: profile.phone_number?.trim() || '',
          location: profile.location?.trim() || '',
          bio: profile.bio?.trim() || '',
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
      
      // Refresh profile data
      await fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Success!",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out",
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && !profile.id) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-career-purple"></div>
                <span className="ml-2">Loading profile...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-foreground">Profile</h1>
              <div className="flex gap-4">
                {!isEditing ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        fetchProfile(); // Reset to original data
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center gap-2 bg-career-purple hover:bg-career-purple-dark"
                    >
                      <Save size={18} />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-destructive hover:text-destructive/90"
                >
                  <LogOut size={18} />
                  Logout
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-career-purple to-career-blue flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {profile.full_name || 'Add your name'}
                  </h2>
                  <p className="text-muted-foreground">{profile.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>Joined: {formatDate(profile.created_at)}</span>
                    </div>
                    {profile.updated_at && profile.updated_at !== profile.created_at && (
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>Updated: {formatDate(profile.updated_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Fields */}
              <div className="grid gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail size={18} />
                    <span>Email</span>
                  </div>
                  <Input
                    value={profile.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User size={18} />
                    <span>Full Name *</span>
                  </div>
                  <Input
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone size={18} />
                    <span>Phone Number</span>
                  </div>
                  <Input
                    value={profile.phone_number || ''}
                    onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={18} />
                    <span>Location</span>
                  </div>
                  <Input
                    value={profile.location || ''}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Enter your location (City, Country)"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-muted-foreground">
                    Bio
                  </label>
                  <Textarea
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself, your interests, and career goals..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 