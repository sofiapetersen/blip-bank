import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Shield } from "lucide-react";

interface UserRegistrationFormProps {
  onSubmit: (data: { fullName: string; cpf: string }) => void;
}

export function UserRegistrationForm({ onSubmit }: UserRegistrationFormProps) {
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataConsent, setDataConsent] = useState(false);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return value;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && cpf && dataConsent) {
      onSubmit({ fullName, cpf: cpf.replace(/\D/g, "") });
    }
  };

  const isFormValid = fullName.length >= 2 && cpf.replace(/\D/g, "").length === 11 && dataConsent;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <UserCheck className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Bem-vindo ao Chat do Blip Bank</CardTitle>
          <CardDescription>
            Para começar, precisamos de algumas informações básicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Digite seu nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCPFChange}
                maxLength={14}
                required
              />
            </div>

            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm">Coleta de Dados Sensíveis</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Coletamos e processamos seus dados para fornecer o melhor atendimento possível. 
                      Suas informações são protegidas conforme a LGPD.
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dataConsent"
                      checked={dataConsent}
                      onCheckedChange={(checked) => setDataConsent(checked as boolean)}
                    />
                    <Label 
                      htmlFor="dataConsent" 
                      className="text-xs cursor-pointer"
                    >
                      Concordo com a coleta e processamento dos meus dados
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!isFormValid}
            >
              Iniciar Chat
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}