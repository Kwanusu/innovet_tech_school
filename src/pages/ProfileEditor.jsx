import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../components/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, MapPin, Link as LinkIcon, Camera, Loader2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const BIO_LIMIT = 300;

const ProfileEditor = ({ onClose }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    bio: user?.profile?.bio || "",
    location: user?.profile?.location || "",
    website: user?.profile?.website || "",
    avatar: null,
  });

  const [preview, setPreview] = useState(user?.profile?.avatar || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("File too large", { description: "Please upload an image under 2MB." });
      }
      setFormData({ ...formData, avatar: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    setFormData({ ...formData, avatar: "clear" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // Nesting the profile data to match your UserProfileSerializer
    data.append("profile.bio", formData.bio);
    data.append("profile.location", formData.location);
    data.append("profile.website", formData.website);

    if (formData.avatar === "clear") {
      data.append("profile.avatar", ""); // Triggers the backend cleanup
    } else if (formData.avatar) {
      data.append("profile.avatar", formData.avatar);
    }

    try {
      await dispatch(updateProfile(data)).unwrap();
      toast.success("Profile Updated", {
        description: "Your changes have been saved successfully.",
        icon: <Check className="text-emerald-500" />
      });
      if (onClose) onClose();
    } catch (err) {
      toast.error("Update Failed", {
        description: typeof err === 'string' ? err : "Check your connection and try again."
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden relative">
      {/* Header Banner */}
      <div className="h-32 bg-slate-900 relative">
        <div className="absolute -bottom-12 left-8 flex items-end gap-4">
          <div className="relative group">
            <div className="h-24 w-24 rounded-3xl bg-white p-1 shadow-lg overflow-hidden border-4 border-white">
              {preview ? (
                <img src={preview} alt="Avatar" className="h-full w-full object-cover rounded-2xl" />
              ) : (
                <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <User size={32} />
                </div>
              )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer">
              <Camera className="text-white" size={20} />
              <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            </label>
          </div>
          
          {preview && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="mb-2 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors bg-red-50 px-3 py-1.5 rounded-full"
            >
              <X size={12} /> Remove Photo
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 pt-16 space-y-8">
        <div className="space-y-6">
          {/* Bio Section with Character Counter */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Professional Bio</Label>
              <span className={cn(
                "text-[10px] font-bold tracking-tighter",
                formData.bio.length >= BIO_LIMIT ? "text-red-500" : "text-slate-400"
              )}>
                {formData.bio.length} / {BIO_LIMIT}
              </span>
            </div>
            <Textarea 
              value={formData.bio}
              maxLength={BIO_LIMIT}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about your tech journey..."
              className="min-h-[120px] rounded-2xl border-slate-100 focus:ring-indigo-500/20 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input 
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="pl-12 h-12 rounded-xl border-slate-100"
                  placeholder="e.g. Nairobi, Kenya"
                />
              </div>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Portfolio/Website</Label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input 
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="pl-12 h-12 rounded-xl border-slate-100"
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-50">
          <Button 
            type="button"
            variant="ghost"
            onClick={onClose}
            className="h-12 px-6 rounded-xl font-bold text-slate-500 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button 
            disabled={loading || formData.bio.length > BIO_LIMIT}
            className="h-12 px-8 rounded-xl font-black bg-slate-900 text-white hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10"
          >
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;