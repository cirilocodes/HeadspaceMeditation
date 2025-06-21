import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Play, Clock, X } from "lucide-react";
import type { Session } from "@shared/schema";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaySession: (session: Session) => void;
}

export default function SearchModal({ isOpen, onClose, onPlaySession }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allSessions = [] } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
  });

  const filteredSessions = allSessions.filter(session =>
    searchQuery.length > 0 && (
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handlePlaySession = (session: Session) => {
    onPlaySession(session);
    onClose();
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "text-green bg-green bg-opacity-20";
      case "intermediate":
        return "text-primary-blue bg-primary-blue bg-opacity-20";
      case "advanced":
        return "text-accent-orange bg-accent-orange bg-opacity-20";
      default:
        return "text-light bg-gray-100";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Sessions</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-light" />
            <Input
              placeholder="Search meditations, sleep stories, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3">
            {searchQuery.length === 0 ? (
              <div className="text-center py-8 text-light">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start typing to search sessions...</p>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="text-center py-8 text-light">
                <p>No sessions found for "{searchQuery}"</p>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => handlePlaySession(session)}
                >
                  <img
                    src={session.imageUrl}
                    alt={session.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 dark:text-white truncate">
                      {session.title}
                    </h4>
                    <p className="text-sm text-light truncate">
                      {session.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className={`${getLevelColor(session.level)} border-0 text-xs`}>
                        {session.level}
                      </Badge>
                      <span className="text-xs text-light capitalize">
                        {session.category}
                      </span>
                      <span className="text-xs text-light">•</span>
                      <div className="flex items-center text-xs text-light">
                        <Clock className="h-3 w-3 mr-1" />
                        {session.duration === 0 ? "Continuous" : `${session.duration} min`}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    className="w-10 h-10 bg-primary-blue text-white rounded-full hover:bg-primary-blue-light flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaySession(session);
                    }}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}