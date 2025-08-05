import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tag, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  content: string;
  createdAt: Date;
  tags?: string[];
}

interface QuickNotesProps {
  notes: Note[];
}

export default function QuickNotes({ notes }: QuickNotesProps) {
  const [content, setContent] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveNoteMutation = useMutation({
    mutationFn: async (noteContent: string) => {
      await apiRequest("POST", "/api/notes", { content: noteContent });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setLastSaved(new Date());
      setContent("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (content.trim()) {
      saveNoteMutation.mutate(content);
    }
  };

  // Auto-save functionality (simplified)
  const handleContentChange = (value: string) => {
    setContent(value);
    // In a real app, you'd implement debounced auto-save here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card rounded-xl p-6"
    >
      <h2 className="text-lg font-semibold text-white mb-4">Quick Thoughts</h2>
      
      <Textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        className="w-full h-24 bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="What's on your mind?"
      />
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-1 text-slate-400 hover:text-white"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 text-slate-400 hover:text-white"
          >
            <Tag className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-xs text-slate-400">
            {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "Auto-saved 2 min ago"}
          </p>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!content.trim() || saveNoteMutation.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Recent entries */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <h3 className="text-sm font-medium text-slate-300 mb-2">Recent Entries</h3>
        <div className="space-y-2">
          {notes.slice(0, 2).map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-2 rounded bg-slate-800/30 text-sm text-slate-300"
            >
              <p className="mb-1">"{note.content}"</p>
              <p className="text-xs text-slate-400">
                {new Date(note.createdAt).toLocaleDateString()} at{' '}
                {new Date(note.createdAt).toLocaleTimeString()}
              </p>
            </motion.div>
          ))}
          {notes.length === 0 && (
            <p className="text-sm text-slate-400">No recent entries</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
