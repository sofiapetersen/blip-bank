import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "./ThemeToggle";
import { Send, MessageCircle, User, Bot, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface ChatInterfaceProps {
  userData: { fullName: string; cpf: string };
  onLogout: () => void;
}

export function ChatInterface({ userData, onLogout }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Olá ${userData.fullName.split(' ')[0]}! Como posso ajudá-lo hoje?`,
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Verificar se a variável de ambiente existe
      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
      
      // Debug - remova depois que funcionar
      console.log('Webhook URL:', webhookUrl);
      console.log('Environment:', import.meta.env.MODE);
      console.log('All env vars:', import.meta.env);
      
      if (!webhookUrl) {
        throw new Error('VITE_WEBHOOK_URL não está configurada. Verifique as variáveis de ambiente no Vercel.');
      }

      console.log('Enviando mensagem para:', webhookUrl);

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          fullName: userData.fullName,
          cpf: userData.cpf,
          timestamp: new Date().toISOString(),
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const responseData = await response.text();
        console.log('Response data:', responseData);
        
        // Exibe a resposta real do webhook
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: responseData || "Desculpe, não recebi uma resposta válida.",
          sender: "assistant",
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorText = await response.text();
        console.error('Erro da API:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error("Erro detalhado:", error);
      
      let errorMessage = "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.";
      
      if (error instanceof Error) {
        if (error.message.includes('VITE_WEBHOOK_URL')) {
          errorMessage = "Erro de configuração: URL do webhook não encontrada.";
        } else if (error.message.includes('405')) {
          errorMessage = "Método não permitido. Verifique a configuração do webhook.";
        } else if (error.message.includes('404')) {
          errorMessage = "Endpoint não encontrado. Verifique a URL do webhook.";
        } else if (error.message.includes('CORS')) {
          errorMessage = "Erro de CORS. O servidor não permite requisições desta origem.";
        }
      }
      
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMessage,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMsg]);
      
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-semibold">Blip Bank</h1>
              <p className="text-sm text-muted-foreground">
                Conectado como {userData.fullName.split(' ')[0]}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={onLogout}>
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col h-[calc(100vh-80px)]">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[80%] space-x-2 ${
                    message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === "user"
                          ? "bg-chat-bubble-user"
                          : "bg-chat-bubble-assistant"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="h-4 w-4 text-chat-bubble-user-foreground" />
                      ) : (
                        <Bot className="h-4 w-4 text-chat-bubble-assistant-foreground" />
                      )}
                    </div>
                  </div>
                  <Card
                    className={`${
                      message.sender === "user"
                        ? "bg-chat-bubble-user text-chat-bubble-user-foreground border-chat-bubble-user"
                        : "bg-chat-bubble-assistant text-chat-bubble-assistant-foreground border-chat-input-border"
                    }`}
                  >
                    <CardContent className="p-3">
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[80%] space-x-2">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-chat-bubble-assistant">
                      <Bot className="h-4 w-4 text-chat-bubble-assistant-foreground" />
                    </div>
                  </div>
                  <Card className="bg-chat-bubble-assistant text-chat-bubble-assistant-foreground border-chat-input-border">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-sm">Digitando...</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-card p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1 bg-chat-input border-chat-input-border"
              />
              <Button 
                onClick={sendMessage} 
                disabled={!inputMessage.trim() || isLoading}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" /> 
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}