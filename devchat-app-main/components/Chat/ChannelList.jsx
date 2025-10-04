"use client";

import React, { useState, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hash, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { app } from "@/services/firebase";

const ChannelList = () => {
  const { currentChannel, setCurrentChannel } = useChat();
  const [channels, setChannels] = useState([]);
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");
  const db = getFirestore(app);

  // Fetch channels from Firestore
  useEffect(() => {
    const fetchChannels = async () => {
      const querySnapshot = await getDocs(collection(db, "channels"));
      const channelData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChannels(channelData);
    };

    fetchChannels();
  }, []);

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (newChannelName.trim()) {
      try {
        const newChannel = {
          name: newChannelName.trim(),
          description: newChannelDescription.trim(),
        };
        const docRef = await addDoc(collection(db, "channels"), newChannel);
        setChannels([...channels, { id: docRef.id, ...newChannel }]); // Update local state
        setNewChannelName("");
        setNewChannelDescription("");
        setIsCreatingChannel(false);
      } catch (error) {
        console.error("Error creating channel:", error);
      }
    }
  };

  return (
    <div className="py-2">
      <div className="flex items-center justify-between px-4 mb-2">
        <h3 className="text-sm font-semibold">Channels</h3>
        <Dialog open={isCreatingChannel} onOpenChange={setIsCreatingChannel}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add Channel</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new channel</DialogTitle>
              <DialogDescription>Add a new channel to discuss specific topics</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateChannel}>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Channel Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. react-help"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="What's this channel about?"
                    value={newChannelDescription}
                    onChange={(e) => setNewChannelDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreatingChannel(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Channel</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-1 px-1">
          {channels.map((channel) => (
            <TooltipProvider key={channel.id} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={currentChannel?.id === channel.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-sm px-2"
                    onClick={() => setCurrentChannel(channel)}
                  >
                    <Hash className="h-4 w-4 mr-2" />
                    {channel.name}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{channel.description || `#${channel.name}`}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChannelList;