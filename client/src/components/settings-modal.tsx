import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Settings, Bell, Palette, Globe, Download, Play } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { UserSettings } from "@shared/schema";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function SettingsModal({ isOpen, onClose, userId }: SettingsModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<UserSettings>({
    queryKey: [`/api/settings/${userId}`],
    enabled: isOpen && !!userId,
  });

  const [localSettings, setLocalSettings] = useState<Partial<UserSettings>>({});

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<UserSettings>) => {
      return apiRequest("PATCH", `/api/settings/${userId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/settings/${userId}`] });
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (Object.keys(localSettings).length > 0) {
      updateMutation.mutate(localSettings);
      setLocalSettings({});
    }
    onClose();
  };

  const updateSetting = (key: keyof UserSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const getCurrentValue = (key: keyof UserSettings) => {
    return localSettings[key] !== undefined ? localSettings[key] : settings?.[key];
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">Loading settings...</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Account Settings</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Appearance */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="h-4 w-4" />
              <h3 className="font-semibold">Appearance</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={getCurrentValue('theme') || 'system'}
                  onValueChange={(value) => updateSetting('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">Language</Label>
                <Select
                  value={getCurrentValue('language') || 'en'}
                  onValueChange={(value) => updateSetting('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="h-4 w-4" />
              <h3 className="font-semibold">Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Enable notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Receive reminders for meditation sessions
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={getCurrentValue('notifications') || false}
                  onCheckedChange={(checked) => updateSetting('notifications', checked)}
                />
              </div>

              <div>
                <Label htmlFor="reminderTime">Daily reminder time</Label>
                <Input
                  id="reminderTime"
                  type="time"
                  value={getCurrentValue('reminderTime') || '09:00'}
                  onChange={(e) => updateSetting('reminderTime', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={getCurrentValue('timezone') || 'UTC'}
                  onValueChange={(value) => updateSetting('timezone', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Europe/Paris">Paris</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Media & Playback */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Play className="h-4 w-4" />
              <h3 className="font-semibold">Media & Playback</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoPlay">Auto-play next session</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Automatically start the next recommended session
                  </p>
                </div>
                <Switch
                  id="autoPlay"
                  checked={getCurrentValue('autoPlay') || false}
                  onCheckedChange={(checked) => updateSetting('autoPlay', checked)}
                />
              </div>

              <div>
                <Label htmlFor="downloadQuality">Download quality</Label>
                <Select
                  value={getCurrentValue('downloadQuality') || 'high'}
                  onValueChange={(value) => updateSetting('downloadQuality', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (32 kbps)</SelectItem>
                    <SelectItem value="medium">Medium (128 kbps)</SelectItem>
                    <SelectItem value="high">High (320 kbps)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Account */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="h-4 w-4" />
              <h3 className="font-semibold">Account</h3>
            </div>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Export my data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Privacy settings
              </Button>
              <Button variant="destructive" className="w-full justify-start">
                Delete account
              </Button>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex space-x-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="flex-1"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}