import { useState } from "react";
import { UserRegistrationForm } from "@/components/UserRegistrationForm";
import { ChatInterface } from "@/components/ChatInterface";

interface UserData {
  fullName: string;
  cpf: string;
}

const Index = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleUserRegistration = (data: UserData) => {
    setUserData(data);
  };

  const handleLogout = () => {
    setUserData(null);
  };

  if (!userData) {
    return <UserRegistrationForm onSubmit={handleUserRegistration} />;
  }

  return <ChatInterface userData={userData} onLogout={handleLogout} />;
};

export default Index;
