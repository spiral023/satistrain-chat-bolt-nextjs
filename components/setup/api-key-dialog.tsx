"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useChatStore } from '@/lib/store';
import { Key, ExternalLink, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export function ApiKeyDialog() {
  const [open, setOpen] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const [secretPw, setSecretPw] = useState('');
  const { apiKey, setApiKey } = useChatStore();

  const handleSecretKeyCheck = async () => {
    if (!secretPw.trim()) {
      toast.error('Bitte geben Sie das Secret PW ein');
      return;
    }

    try {
      const response = await fetch('/api/get-secret-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secretPw: secretPw.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler bei der Überprüfung des Secret PW');
      }

      setApiKey(data.apiKey);
      setOpen(false);
      setSecretPw('');
      toast.success('API Key erfolgreich über Secret PW eingerichtet');
    } catch (error: any) {
      // Fehlerbehandlung für den Fall, dass die Antwort kein gültiges JSON ist
      if (error instanceof SyntaxError) {
        toast.error("Fehler: Ungültige Antwort vom Server.");
      } else {
        toast.error(error.message);
      }
    }
  };

  const handleSave = () => {
    if (!tempKey.trim()) {
      toast.error('Bitte geben Sie einen API Key ein');
      return;
    }

    if (!tempKey.startsWith('sk-')) {
      toast.error('Der API Key muss mit "sk-" beginnen');
      return;
    }

    setApiKey(tempKey.trim());
    setOpen(false);
    setTempKey('');
    toast.success('API Key erfolgreich gespeichert');
  };

  const handleOpen = () => {
    setTempKey(apiKey);
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={handleOpen}>
          <Key className="w-4 h-4 mr-2" />
          {apiKey ? 'API Key ändern' : 'API Key einrichten'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5" />
            <span>OpenAI API Key</span>
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manuell</TabsTrigger>
            <TabsTrigger value="secret">Secret PW</TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <div className="space-y-4 pt-4">
              <Alert>
                <Shield className="w-4 h-4" />
                <AlertDescription>
                  Ihr API Key wird nur lokal in Ihrem Browser gespeichert und nie an unsere Server übertragen.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="sk-..."
                  className="font-mono"
                />
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <p>So erhalten Sie Ihren API Key:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Besuchen Sie die OpenAI Platform</li>
                  <li>Erstellen Sie ein Konto oder melden Sie sich an</li>
                  <li>Gehen Sie zu "API Keys" in Ihrem Dashboard</li>
                  <li>Erstellen Sie einen neuen API Key</li>
                </ol>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto"
                  onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  OpenAI Platform öffnen
                </Button>
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
          </TabsContent>
          <TabsContent value="secret">
            <div className="space-y-4 pt-4">
              <Alert>
                <Shield className="w-4 h-4" />
                <AlertDescription>
                  Geben Sie das Secret Passwort ein, um den API Key sicher von den Umgebungsvariablen zu laden.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="secretPw">Secret PW</Label>
                <Input
                  id="secretPw"
                  type="password"
                  value={secretPw}
                  onChange={(e) => setSecretPw(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={handleSecretKeyCheck}>
                  Key laden
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
