"use client";

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/lib/store';
import { customerProfiles, getRandomCustomerProfile } from '@/lib/customer-profiles';
import { Users, Shuffle } from 'lucide-react';

export function CustomerSelector() {
  const [open, setOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { currentCustomer, setCurrentCustomer } = useChatStore();

  const handleSelectCustomer = (customer: any) => {
    setCurrentCustomer(customer);
    setOpen(false);
  };

  const handleRandomCustomer = () => {
    const randomCustomer = getRandomCustomerProfile();
    setCurrentCustomer(randomCustomer);
    setOpen(false);
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'bg-green-500';
      case 'neutral': return 'bg-yellow-500';
      case 'frustrated': return 'bg-orange-500';
      case 'angry': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getMoodText = (mood: string) => {
    switch (mood) {
      case 'happy': return 'Zufrieden';
      case 'neutral': return 'Neutral';
      case 'frustrated': return 'Frustriert';
      case 'angry': return 'Verärgert';
      default: return 'Unbekannt';
    }
  };

  const filteredCustomers = useMemo(() => {
    return customerProfiles.filter(customer => {
      const moodMatch = selectedMood === 'all' || customer.mood === selectedMood;
      const levelMatch = selectedLevel === 'all' || customer.difficulty === parseInt(selectedLevel);
      const searchMatch = searchTerm === '' || 
                          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.background.toLowerCase().includes(searchTerm.toLowerCase());
      return moodMatch && levelMatch && searchMatch;
    });
  }, [selectedMood, selectedLevel, searchTerm]);

  const moodCounts = useMemo(() => {
    const counts: { [key: string]: number } = { all: customerProfiles.length };
    customerProfiles.forEach(customer => {
      counts[customer.mood] = (counts[customer.mood] || 0) + 1;
    });
    return counts;
  }, []);

  const levelCounts = useMemo(() => {
    const counts: { [key: string]: number } = { all: customerProfiles.length };
    customerProfiles.forEach(customer => {
      counts[customer.difficulty.toString()] = (counts[customer.difficulty.toString()] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="w-4 h-4 mr-2" />
          Kunde wählen
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[800px] translate-y-[-50%]"> {/* Increased width, adjusted height and moved up */}
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Kunden auswählen ({filteredCustomers.length} / {customerProfiles.length})</span>
            </span>
            <Button variant="outline" size="sm" onClick={handleRandomCustomer}>
              <Shuffle className="w-4 h-4 mr-2" />
              Zufällig
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 mb-4">
          <Input
            placeholder="Kunden suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="mood-filter">Stimmung</Label>
              <Select value={selectedMood} onValueChange={setSelectedMood}>
                <SelectTrigger id="mood-filter">
                  <SelectValue placeholder="Alle Stimmungen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle ({moodCounts.all})</SelectItem>
                  <SelectItem value="happy">Zufrieden ({moodCounts.happy || 0})</SelectItem>
                  <SelectItem value="neutral">Neutral ({moodCounts.neutral || 0})</SelectItem>
                  <SelectItem value="frustrated">Frustriert ({moodCounts.frustrated || 0})</SelectItem>
                  <SelectItem value="angry">Verärgert ({moodCounts.angry || 0})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="level-filter">Level</Label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger id="level-filter">
                  <SelectValue placeholder="Alle Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle ({levelCounts.all})</SelectItem>
                  {[1, 2, 3, 4, 5].map(level => (
                    <SelectItem key={level} value={level.toString()}>
                      Level {level} ({levelCounts[level.toString()] || 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto">
          {filteredCustomers.length === 0 ? (
            <p className="col-span-3 text-center text-muted-foreground">Keine Kunden gefunden, die den Filtern entsprechen.</p>
          ) : (
            filteredCustomers.map((customer, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSelectCustomer(customer)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={customer.avatar} alt={customer.name} />
                      <AvatarFallback>
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{customer.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${getMoodColor(customer.mood)}`} />
                        <span className="text-xs text-muted-foreground">
                          {getMoodText(customer.mood)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          Level {customer.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Anliegen:</p>
                      <p className="text-sm text-muted-foreground">{customer.issue}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Hintergrund:</p>
                      <p className="text-xs text-muted-foreground">{customer.background}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
