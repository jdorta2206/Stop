import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, Search, X, Plus, Phone, MessageSquare } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Contact {
  id: string;
  name: string;
  phone: string;
  avatarUrl?: string;
}

interface ContactsManagerProps {
  language: 'es' | 'en' | 'fr' | 'pt';
  roomCode: string;
  onClose: () => void;
}

// Mock contacts for demo purposes
const mockContacts: Contact[] = [
  { id: '1', name: 'Ana García', phone: '+34600123456', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Carlos Rodríguez', phone: '+34600789012', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
  { id: '3', name: 'Elena Martín', phone: '+34600345678', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
  { id: '4', name: 'Javier López', phone: '+34600901234', avatarUrl: 'https://i.pravatar.cc/150?img=7' },
  { id: '5', name: 'María Sánchez', phone: '+34600567890', avatarUrl: 'https://i.pravatar.cc/150?img=9' },
  { id: '6', name: 'Pablo Fernández', phone: '+34600112233' },
  { id: '7', name: 'Sara Díaz', phone: '+34600445566', avatarUrl: 'https://i.pravatar.cc/150?img=10' },
  { id: '8', name: 'Luis Torres', phone: '+34600778899' }
];

const content = {
  es: {
    title: 'Invitar Contactos',
    search: 'Buscar contactos',
    noResults: 'No se encontraron contactos',
    inviteVia: 'Invitar vía',
    whatsapp: 'WhatsApp',
    sms: 'SMS',
    inviteMessage: '¡Únete a mi partida de STOP! Usa el código',
    close: 'Cerrar',
    myContacts: 'Mis Contactos',
    searchContacts: 'Buscar por nombre o teléfono',
    inviteSent: 'Invitación enviada',
    inviteAll: 'Invitar a todos'
  },
  en: {
    title: 'Invite Contacts',
    search: 'Search contacts',
    noResults: 'No contacts found',
    inviteVia: 'Invite via',
    whatsapp: 'WhatsApp',
    sms: 'SMS',
    inviteMessage: 'Join my STOP game! Use the code',
    close: 'Close',
    myContacts: 'My Contacts',
    searchContacts: 'Search by name or phone',
    inviteSent: 'Invitation sent',
    inviteAll: 'Invite all'
  },
  fr: {
    title: 'Inviter des Contacts',
    search: 'Rechercher des contacts',
    noResults: 'Aucun contact trouvé',
    inviteVia: 'Inviter via',
    whatsapp: 'WhatsApp',
    sms: 'SMS',
    inviteMessage: 'Rejoins ma partie de STOP! Utilise le code',
    close: 'Fermer',
    myContacts: 'Mes Contacts',
    searchContacts: 'Rechercher par nom ou téléphone',
    inviteSent: 'Invitation envoyée',
    inviteAll: 'Inviter tous'
  },
  pt: {
    title: 'Convidar Contatos',
    search: 'Pesquisar contatos',
    noResults: 'Nenhum contato encontrado',
    inviteVia: 'Convidar via',
    whatsapp: 'WhatsApp',
    sms: 'SMS',
    inviteMessage: 'Entre no meu jogo STOP! Use o código',
    close: 'Fechar',
    myContacts: 'Meus Contatos',
    searchContacts: 'Pesquisar por nome ou telefone',
    inviteSent: 'Convite enviado',
    inviteAll: 'Convidar todos'
  }
};

export default function ContactsManager({ language, roomCode, onClose }: ContactsManagerProps) {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(mockContacts);
  const [invitedContacts, setInvitedContacts] = useState<Set<string>>(new Set());

  const t = content[language];

  // Filter contacts based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredContacts(contacts);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = contacts.filter(contact => 
      contact.name.toLowerCase().includes(query) || 
      contact.phone.includes(query)
    );
    setFilteredContacts(filtered);
  }, [searchQuery, contacts]);

  // In a real app, we would fetch contacts from the device
  const requestContacts = async () => {
    // This would use the Contacts API in a real mobile app
    console.log("Requesting contacts access");
    // For demo, we're using mock data
  };

  useEffect(() => {
    requestContacts();
  }, []);

  const inviteViaWhatsApp = (contact: Contact) => {
    const message = encodeURIComponent(`${t.inviteMessage} ${roomCode} https://stop-game.app/join/${roomCode}`);
    const url = `https://wa.me/${contact.phone.replace(/[+\s]/g, '')}?text=${message}`;
    
    // Mark as invited
    setInvitedContacts(prev => new Set([...prev, contact.id]));
    
    // Open WhatsApp
    window.open(url, '_blank');
  };

  const inviteViaSMS = (contact: Contact) => {
    const message = encodeURIComponent(`${t.inviteMessage} ${roomCode}`);
    const url = `sms:${contact.phone}?body=${message}`;
    
    // Mark as invited
    setInvitedContacts(prev => new Set([...prev, contact.id]));
    
    // Open SMS app
    window.location.href = url;
  };

  const inviteAllViaWhatsApp = () => {
    const message = encodeURIComponent(`${t.inviteMessage} ${roomCode} https://stop-game.app/join/${roomCode}`);
    
    // This would be a group message in real implementation
    // For demo, we'll just open WhatsApp
    window.open(`https://web.whatsapp.com/`, '_blank');
    
    // Mark all as invited
    setInvitedContacts(new Set(contacts.map(c => c.id)));
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white w-full max-w-md max-h-[80vh] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={20} />
          <h3 className="font-bold text-xl">{t.title}</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white">
          <X size={20} />
        </Button>
      </CardHeader>
      
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
          <Input
            placeholder={t.searchContacts}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/20 border-white/30 text-white placeholder-white/60"
          />
        </div>
      </div>
      
      <CardContent className="overflow-y-auto flex-grow">
        <div className="space-y-1 mt-2">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-sm text-white/70">{t.myContacts} ({filteredContacts.length})</h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={inviteAllViaWhatsApp}
              className="bg-white/10 border-white/30 text-white text-xs hover:bg-green-700"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              {t.inviteAll}
            </Button>
          </div>
          
          {filteredContacts.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <p>{t.noResults}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-white/20">
                      {contact.avatarUrl ? (
                        <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                      ) : (
                        <AvatarFallback className="bg-red-700 text-white">
                          {contact.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-xs text-white/70">{contact.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {invitedContacts.has(contact.id) ? (
                      <span className="text-xs text-green-400">{t.inviteSent}</span>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-green-400 hover:text-white hover:bg-green-700"
                          onClick={() => inviteViaWhatsApp(contact)}
                          title={`${t.inviteVia} WhatsApp`}
                        >
                          <MessageSquare size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-blue-400 hover:text-white hover:bg-blue-700"
                          onClick={() => inviteViaSMS(contact)}
                          title={`${t.inviteVia} SMS`}
                        >
                          <Phone size={18} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}