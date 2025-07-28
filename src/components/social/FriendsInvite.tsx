import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MessageCircle, 
  Share2, 
  UserPlus, 
  Phone, 
  Mail, 
  Copy,
  Check,
  Facebook,
  WhatsApp,
  Instagram,
  Twitter
} from 'lucide-react';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  photo?: string;
  isInvited?: boolean;
}

interface FacebookFriend {
  id: string;
  name: string;
  photo: string;
  isInvited?: boolean;
}

type LanguageOption = 'es' | 'en' | 'fr' | 'pt';

interface FriendsInviteProps {
  language?: LanguageOption;
}

export default function FriendsInvite({ language = 'es' }: FriendsInviteProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [facebookFriends, setFacebookFriends] = useState<FacebookFriend[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [isLoadingFacebook, setIsLoadingFacebook] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const content = {
    es: {
      inviteFriends: "Invitar Amigos",
      contacts: "Contactos",
      facebook: "Facebook",
      socialShare: "Compartir en Redes",
      inviteMessage: "¡Únete a mí en Stop Game! 🎮",
      gameUrl: "Juega conmigo en:",
      loadContacts: "Cargar Contactos",
      connectFacebook: "Conectar Facebook",
      invite: "Invitar",
      invited: "Invitado",
      searchFriends: "Buscar amigos...",
      noContacts: "No hay contactos disponibles",
      noFacebookFriends: "No hay amigos de Facebook",
      copyLink: "Copiar Enlace",
      linkCopied: "¡Enlace copiado!",
      shareWhatsApp: "Compartir en WhatsApp",
      shareInstagram: "Compartir en Instagram",
      shareTwitter: "Compartir en Twitter",
      inviteViaEmail: "Invitar por Email",
      inviteViaSMS: "Invitar por SMS",
      customMessage: "Mensaje personalizado"
    },
    en: {
      inviteFriends: "Invite Friends",
      contacts: "Contacts",
      facebook: "Facebook",
      socialShare: "Social Share",
      inviteMessage: "Join me on Stop Game! 🎮",
      gameUrl: "Play with me at:",
      loadContacts: "Load Contacts",
      connectFacebook: "Connect Facebook",
      invite: "Invite",
      invited: "Invited",
      searchFriends: "Search friends...",
      noContacts: "No contacts available",
      noFacebookFriends: "No Facebook friends",
      copyLink: "Copy Link",
      linkCopied: "Link copied!",
      shareWhatsApp: "Share on WhatsApp",
      shareInstagram: "Share on Instagram",
      shareTwitter: "Share on Twitter",
      inviteViaEmail: "Invite via Email",
      inviteViaSMS: "Invite via SMS",
      customMessage: "Custom message"
    },
    fr: {
      inviteFriends: "Inviter des Amis",
      contacts: "Contacts",
      facebook: "Facebook",
      socialShare: "Partage Social",
      inviteMessage: "Rejoins-moi sur Stop Game! 🎮",
      gameUrl: "Joue avec moi sur:",
      loadContacts: "Charger les Contacts",
      connectFacebook: "Connecter Facebook",
      invite: "Inviter",
      invited: "Invité",
      searchFriends: "Rechercher des amis...",
      noContacts: "Aucun contact disponible",
      noFacebookFriends: "Aucun ami Facebook",
      copyLink: "Copier le Lien",
      linkCopied: "Lien copié!",
      shareWhatsApp: "Partager sur WhatsApp",
      shareInstagram: "Partager sur Instagram",
      shareTwitter: "Partager sur Twitter",
      inviteViaEmail: "Inviter par Email",
      inviteViaSMS: "Inviter par SMS",
      customMessage: "Message personnalisé"
    },
    pt: {
      inviteFriends: "Convidar Amigos",
      contacts: "Contatos",
      facebook: "Facebook",
      socialShare: "Compartilhar Social",
      inviteMessage: "Junte-se a mim no Stop Game! 🎮",
      gameUrl: "Jogue comigo em:",
      loadContacts: "Carregar Contatos",
      connectFacebook: "Conectar Facebook",
      invite: "Convidar",
      invited: "Convidado",
      searchFriends: "Buscar amigos...",
      noContacts: "Nenhum contato disponível",
      noFacebookFriends: "Nenhum amigo do Facebook",
      copyLink: "Copiar Link",
      linkCopied: "Link copiado!",
      shareWhatsApp: "Compartilhar no WhatsApp",
      shareInstagram: "Compartilhar no Instagram",
      shareTwitter: "Compartilhar no Twitter",
      inviteViaEmail: "Convidar por Email",
      inviteViaSMS: "Convidar por SMS",
      customMessage: "Mensagem personalizada"
    }
  };

  const t = content[language];

  // Simular carga de contactos (en una app real, esto vendría de la API de contactos)
  const loadContacts = async () => {
    setIsLoadingContacts(true);
    
    // Simular contactos de ejemplo
    setTimeout(() => {
      const mockContacts: Contact[] = [
        { id: '1', name: 'Ana García', phone: '+34 666 123 456', email: 'ana@email.com' },
        { id: '2', name: 'Carlos López', phone: '+34 666 789 012', email: 'carlos@email.com' },
        { id: '3', name: 'María Rodríguez', phone: '+34 666 345 678', email: 'maria@email.com' },
        { id: '4', name: 'Luis Martínez', phone: '+34 666 901 234', email: 'luis@email.com' },
        { id: '5', name: 'Carmen Sánchez', phone: '+34 666 567 890', email: 'carmen@email.com' }
      ];
      setContacts(mockContacts);
      setIsLoadingContacts(false);
    }, 1500);
  };

  // Simular conexión con Facebook (en una app real, esto usaría Facebook SDK)
  const connectFacebook = async () => {
    setIsLoadingFacebook(true);
    
    // Simular amigos de Facebook de ejemplo
    setTimeout(() => {
      const mockFacebookFriends: FacebookFriend[] = [
        { id: '1', name: 'Pedro Fernández', photo: 'https://i.pravatar.cc/150?img=1' },
        { id: '2', name: 'Laura González', photo: 'https://i.pravatar.cc/150?img=2' },
        { id: '3', name: 'Diego Ruiz', photo: 'https://i.pravatar.cc/150?img=3' },
        { id: '4', name: 'Sofia Jiménez', photo: 'https://i.pravatar.cc/150?img=4' },
        { id: '5', name: 'Andrés Torres', photo: 'https://i.pravatar.cc/150?img=5' }
      ];
      setFacebookFriends(mockFacebookFriends);
      setIsLoadingFacebook(false);
    }, 2000);
  };

  const inviteContact = (contactId: string) => {
    setContacts(prev => 
      prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, isInvited: true }
          : contact
      )
    );
    toast.success(`Invitación enviada a ${contacts.find(c => c.id === contactId)?.name}`);
  };

  const inviteFacebookFriend = (friendId: string) => {
    setFacebookFriends(prev => 
      prev.map(friend => 
        friend.id === friendId 
          ? { ...friend, isInvited: true }
          : friend
      )
    );
    toast.success(`Invitación enviada a ${facebookFriends.find(f => f.id === friendId)?.name}`);
  };

  const copyGameLink = () => {
    const gameUrl = window.location.origin;
    navigator.clipboard.writeText(gameUrl);
    setCopiedLink(true);
    toast.success(t.linkCopied);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const message = `${t.inviteMessage}\n${t.gameUrl} ${window.location.origin}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareOnTwitter = () => {
    const message = `${t.inviteMessage} ${window.location.origin}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareOnInstagram = () => {
    // Instagram no permite compartir enlaces directamente, solo copiamos al portapapeles
    const message = `${t.inviteMessage}\n${window.location.origin}`;
    navigator.clipboard.writeText(message);
    toast.success('Mensaje copiado. Pégalo en tu historia de Instagram');
  };

  const inviteViaEmail = (email: string, name: string) => {
    const subject = encodeURIComponent('¡Únete a Stop Game!');
    const body = encodeURIComponent(`Hola ${name},\n\n${t.inviteMessage}\n\n${t.gameUrl} ${window.location.origin}\n\n¡Espero verte pronto en el juego!`);
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    window.open(mailtoUrl);
  };

  const inviteViaSMS = (phone: string, name: string) => {
    const message = encodeURIComponent(`Hola ${name}! ${t.inviteMessage} ${window.location.origin}`);
    const smsUrl = `sms:${phone}?body=${message}`;
    window.open(smsUrl);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFacebookFriends = facebookFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-white/20">
          <UserPlus className="w-4 h-4 mr-2" />
          {t.inviteFriends}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t.inviteFriends}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contacts">{t.contacts}</TabsTrigger>
            <TabsTrigger value="facebook">{t.facebook}</TabsTrigger>
            <TabsTrigger value="social">{t.socialShare}</TabsTrigger>
          </TabsList>

          {/* Buscador */}
          <div className="my-4">
            <Input
              placeholder={t.searchFriends}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <TabsContent value="contacts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t.contacts}</h3>
              <Button onClick={loadContacts} disabled={isLoadingContacts}>
                <Phone className="w-4 h-4 mr-2" />
                {isLoadingContacts ? 'Cargando...' : t.loadContacts}
              </Button>
            </div>

            {contacts.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Phone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{t.noContacts}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {filteredContacts.map((contact) => (
                  <Card key={contact.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={contact.photo} alt={contact.name} />
                            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{contact.name}</h4>
                            <div className="text-sm text-gray-500 space-y-1">
                              {contact.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {contact.phone}
                                </div>
                              )}
                              {contact.email && (
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {contact.email}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {contact.phone && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => inviteViaSMS(contact.phone!, contact.name)}
                            >
                              <MessageCircle className="h-3 w-3" />
                            </Button>
                          )}
                          
                          {contact.email && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => inviteViaEmail(contact.email!, contact.name)}
                            >
                              <Mail className="h-3 w-3" />
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            onClick={() => inviteContact(contact.id)}
                            disabled={contact.isInvited}
                            className={contact.isInvited ? 'bg-green-500' : ''}
                          >
                            {contact.isInvited ? (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                {t.invited}
                              </>
                            ) : (
                              t.invite
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="facebook" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t.facebook}</h3>
              <Button onClick={connectFacebook} disabled={isLoadingFacebook}>
                <Facebook className="w-4 h-4 mr-2" />
                {isLoadingFacebook ? 'Conectando...' : t.connectFacebook}
              </Button>
            </div>

            {facebookFriends.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Facebook className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{t.noFacebookFriends}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {filteredFacebookFriends.map((friend) => (
                  <Card key={friend.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={friend.photo} alt={friend.name} />
                            <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{friend.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              <Facebook className="h-3 w-3 mr-1" />
                              Facebook
                            </Badge>
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => inviteFacebookFriend(friend.id)}
                          disabled={friend.isInvited}
                          className={friend.isInvited ? 'bg-green-500' : ''}
                        >
                          {friend.isInvited ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              {t.invited}
                            </>
                          ) : (
                            t.invite
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <h3 className="text-lg font-semibold">{t.socialShare}</h3>
            
            <div className="grid gap-4">
              {/* Copiar enlace */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{t.copyLink}</h4>
                      <p className="text-sm text-gray-500">Comparte el enlace directamente</p>
                    </div>
                    <Button onClick={copyGameLink} variant="outline">
                      {copiedLink ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          {t.linkCopied}
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          {t.copyLink}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <MessageCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{t.shareWhatsApp}</h4>
                        <p className="text-sm text-gray-500">Envía un mensaje a tus contactos</p>
                      </div>
                    </div>
                    <Button onClick={shareOnWhatsApp} className="bg-green-500 hover:bg-green-600">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Compartir
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Instagram */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-100 rounded-full">
                        <Instagram className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{t.shareInstagram}</h4>
                        <p className="text-sm text-gray-500">Comparte en tu historia</p>
                      </div>
                    </div>
                    <Button onClick={shareOnInstagram} className="bg-pink-500 hover:bg-pink-600">
                      <Instagram className="h-4 w-4 mr-2" />
                      Compartir
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Twitter */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Twitter className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{t.shareTwitter}</h4>
                        <p className="text-sm text-gray-500">Publica un tweet</p>
                      </div>
                    </div>
                    <Button onClick={shareOnTwitter} className="bg-blue-500 hover:bg-blue-600">
                      <Twitter className="h-4 w-4 mr-2" />
                      Compartir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}