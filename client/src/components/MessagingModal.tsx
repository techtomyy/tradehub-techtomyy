import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Send, Paperclip, Clock, CheckCircle } from "lucide-react";

interface MessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
}

export default function MessagingModal({ isOpen, onClose, transactionId }: MessagingModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: transaction } = useQuery({
    queryKey: [`/api/transactions/${transactionId}`],
    enabled: isOpen && !!transactionId,
  });

  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: [`/api/transactions/${transactionId}/messages`],
    enabled: isOpen && !!transactionId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/messages", {
        transactionId,
        content,
      });
      return response.json();
    },
    onSuccess: () => {
      setNewMessage("");
      refetchMessages();
      queryClient.invalidateQueries({ queryKey: [`/api/transactions/${transactionId}/messages`] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages]);

  const otherUser = transaction && user ? (
    user.id === transaction.buyerId ? transaction.seller : transaction.buyer
  ) : null;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        {/* Header */}
        <DialogHeader className="p-6 border-b">
          <div className="flex items-center space-x-3">
            {otherUser && (
              <Avatar>
                <AvatarImage src={otherUser.profileImageUrl} />
                <AvatarFallback>
                  {otherUser.firstName?.[0]}{otherUser.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              <DialogTitle>
                {otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Transaction Chat'}
              </DialogTitle>
              <p className="text-sm text-gray-600">
                Transaction #{transactionId.slice(-8)}
              </p>
            </div>
            {transaction && (
              <Badge variant="outline" className="ml-auto">
                {transaction.status.replace('_', ' ')}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 max-h-96 space-y-4">
          {messages?.map((message: any) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
                {message.senderId !== user?.id && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={otherUser?.profileImageUrl} />
                    <AvatarFallback className="text-xs">
                      {otherUser?.firstName?.[0]}{otherUser?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`rounded-lg p-3 ${
                  message.senderId === user?.id
                    ? 'bg-primary text-white'
                    : message.isSystemMessage
                    ? 'bg-gray-100 text-gray-800 border border-gray-200'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {message.isSystemMessage && (
                    <div className="flex items-center mb-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      <span className="text-xs font-medium">System</span>
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((attachment: string, index: number) => (
                        <div key={index} className="flex items-center text-xs">
                          <Paperclip className="h-3 w-3 mr-1" />
                          <a href={attachment} target="_blank" rel="noopener noreferrer" className="underline">
                            Attachment {index + 1}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className={`text-xs mt-1 ${
                    message.senderId === user?.id ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {formatTime(message.createdAt)}
                  </p>
                </div>
                
                {message.senderId === user?.id && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.profileImageUrl} />
                    <AvatarFallback className="text-xs">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
          
          {(!messages || messages.length === 0) && (
            <div className="text-center py-8">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="border-t p-4">
          <div className="flex space-x-2">
            <Button type="button" variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={sendMessageMutation.isPending}
            />
            <Button 
              type="submit" 
              disabled={!newMessage.trim() || sendMessageMutation.isPending}
              className="bg-primary hover:bg-blue-700"
            >
              {sendMessageMutation.isPending ? (
                <Clock className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
