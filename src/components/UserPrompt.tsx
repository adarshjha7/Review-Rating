import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserStorage } from "@/lib/userStorage";

interface UserPromptProps {
  isOpen: boolean;
  onUserSet: (username: string) => void;
  onClose: () => void;
}

export function UserPrompt({ isOpen, onUserSet, onClose }: UserPromptProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!UserStorage.isValidUsername(username)) {
      setError("Username must be between 2 and 50 characters");
      return;
    }

    const user = UserStorage.setUser(username);
    onUserSet(user.username);
    setUsername("");
    setError("");
  };

  const handleClose = () => {
    setUsername("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Fitness Books Reviews!</DialogTitle>
          <DialogDescription>
            Please enter your name to start reviewing books. You'll be able to
            rate and review any book, but only once per book.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Your Name</Label>
            <Input
              id="username"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full gradient-bg">
              Get Started
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
