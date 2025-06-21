import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Mail, LogOut, Settings, Heart, Trophy } from "lucide-react";
import type { User as UserType } from "@shared/schema";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
}

export default function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  const joinDate = new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Info */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.profileImageUrl || undefined} alt="Profile" />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {initials || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user.email?.split('@')[0] || 'User'
                }
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
            </div>
          </div>

          {/* Account Info */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300">Email:</span>
              <span className="font-medium">{user.email}</span>
            </div>
            
            <div className="flex items-center space-x-3 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300">Member since:</span>
              <span className="font-medium">{joinDate}</span>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Achievements</div>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Favorites</div>
            </Card>
          </div>

          {/* Account Status */}
          <div className="flex items-center justify-center">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Active Account
            </Badge>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={onClose}
            >
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </Button>
            
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => window.location.href = '/api/logout'}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}