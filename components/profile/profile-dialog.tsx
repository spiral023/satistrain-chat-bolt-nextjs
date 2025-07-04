"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/lib/store';
import { User, Trophy, Star, Zap } from 'lucide-react';
import { toast } from 'sonner';

export function ProfileDialog() {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const { userProfile, setUserProfile, updateUserProfile } = useChatStore();

  useEffect(() => {
    // Load profile from localStorage on mount
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('user_profile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
      }
    }
  }, [setUserProfile]);

  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.firstName);
      setLastName(userProfile.lastName);
      setUsername(userProfile.username);
    }
  }, [userProfile]);

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim() || !username.trim()) {
      toast.error('Bitte füllen Sie alle Felder aus');
      return;
    }

    if (username.length < 3) {
      toast.error('Das Userkürzel muss mindestens 3 Zeichen lang sein');
      return;
    }

    const profileData = {
      id: userProfile?.id || Date.now().toString(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      createdAt: userProfile?.createdAt || new Date(),
      totalSessions: userProfile?.totalSessions || 0,
      averageScore: userProfile?.averageScore || 0,
      bestScore: userProfile?.bestScore || 0,
      totalXP: userProfile?.totalXP || 0,
      level: userProfile?.level || 1,
    };

    if (userProfile) {
      updateUserProfile(profileData);
    } else {
      setUserProfile(profileData);
    }

    setOpen(false);
    toast.success('Profil erfolgreich gespeichert');
  };

  const getInitials = () => {
    if (userProfile) {
      return `${userProfile.firstName[0]}${userProfile.lastName[0]}`;
    }
    return firstName && lastName ? `${firstName[0]}${lastName[0]}` : 'U';
  };

  const getLevelProgress = () => {
    if (!userProfile) return 0;
    const currentLevelXP = userProfile.level * 1000;
    const nextLevelXP = (userProfile.level + 1) * 1000;
    const progress = ((userProfile.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <User className="w-4 h-4 mr-2" />
          {userProfile ? userProfile.username : 'Profil'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Benutzerprofil</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Avatar and Stats */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userProfile?.avatar} alt="Profile" />
              <AvatarFallback className="text-lg">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            {userProfile && (
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">
                  {userProfile.firstName} {userProfile.lastName}
                </h3>
                <Badge variant="secondary">@{userProfile.username}</Badge>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold">{userProfile.level}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Level</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Trophy className="w-4 h-4 text-orange-500" />
                      <span className="font-bold">{userProfile.bestScore}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Bestwert</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="w-4 h-4 text-blue-500" />
                      <span className="font-bold">{userProfile.totalXP}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">XP</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Vorname</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Max"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Nachname</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Mustermann"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Userkürzel</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="mmustermann"
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground">
                Mindestens 3 Zeichen, wird in der Rangliste angezeigt
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave}>
              Speichern
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}