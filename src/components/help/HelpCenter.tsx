
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from 'lucide-react';
import { HelpChat } from './HelpChat';

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = React.useState("");
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Central de Ajuda</h2>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Pesquisar ajuda..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="chat">
        <TabsList className="grid w-full grid-cols-4 bg-burgundy-light text-white">
          <TabsTrigger 
            value="chat" 
            className="text-white data-[state=active]:bg-burgundy data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-burgundy-dark"
          >
            Chat de Ajuda
          </TabsTrigger>
          <TabsTrigger 
            value="faq"
            className="text-white data-[state=active]:bg-burgundy data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-burgundy-dark"
          >
            FAQ
          </TabsTrigger>
          <TabsTrigger 
            value="tutoriais"
            className="text-white data-[state=active]:bg-burgundy data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-burgundy-dark"
          >
            Tutoriais
          </TabsTrigger>
          <TabsTrigger 
            value="contato"
            className="text-white data-[state=active]:bg-burgundy data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-burgundy-dark"
          >
            Contato
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="pt-4">
          <HelpChat />
        </TabsContent>
        
        <TabsContent value="faq" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
              <CardDescription>
                Respostas para as perguntas mais comuns sobre a plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FaqItem 
                question="Como faço upload de arquivos?" 
                answer="Para fazer upload de arquivos, navegue até a aba 'Upload' no menu principal, clique no botão 'Selecionar arquivo' e escolha o arquivo que deseja enviar. Em seguida, preencha os metadados necessários e clique em 'Enviar'."
              />
              
              <FaqItem 
                question="Como utilizo os filtros de metadados?" 
                answer="Na aba 'Filtros', você encontrará todos os metadados disponíveis para seus documentos. Selecione os valores desejados e todas as consultas subsequentes considerarão apenas os documentos que correspondem aos critérios selecionados."
              />
              
              <FaqItem 
                question="Como escolher um modelo diferente de IA?" 
                answer="Acesse a aba 'Configurações' e você encontrará uma seção para selecionar o modelo de IA preferido. Escolha o modelo desejado na lista suspensa e clique em 'Salvar preferência'."
              />
              
              <FaqItem 
                question="Como gerar imagens com a IA?" 
                answer="Acesse a aba 'Gerar Imagem', digite um prompt descritivo no campo de texto, configure as opções de geração conforme necessário e clique em 'Gerar Imagem'. Após alguns segundos, sua imagem será exibida e você poderá baixá-la."
              />
              
              <FaqItem 
                question="Como excluir documentos carregados?" 
                answer="Na aba 'Deletar', selecione a categoria e o nome do arquivo que deseja excluir e confirme a exclusão. Note que essa ação não pode ser desfeita."
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tutoriais" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Vídeos Tutoriais</CardTitle>
              <CardDescription>
                Guias passo a passo para ajudar você a usar todas as funcionalidades da plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TutorialCard 
                  title="Começando com a IAprópria" 
                  description="Aprenda os conceitos básicos para começar a usar a plataforma."
                  imageUrl="/placeholder.svg"
                  videoUrl="#"
                />
                
                <TutorialCard 
                  title="Processamento de Documentos" 
                  description="Como fazer upload, categorizar e consultar documentos."
                  imageUrl="/placeholder.svg"
                  videoUrl="#"
                />
                
                <TutorialCard 
                  title="Utilizando Filtros de Metadados" 
                  description="Aprenda a filtrar informações para consultas mais precisas."
                  imageUrl="/placeholder.svg"
                  videoUrl="#"
                />
                
                <TutorialCard 
                  title="Geração de Imagens com IA" 
                  description="Como criar imagens impressionantes com nossa ferramenta de IA."
                  imageUrl="/placeholder.svg"
                  videoUrl="#"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contato" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Entre em Contato</CardTitle>
              <CardDescription>
                Precisa de ajuda adicional? Entre em contato com nosso suporte.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Nome</label>
                    <Input id="name" placeholder="Seu nome" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" placeholder="seu@email.com" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Assunto</label>
                  <Input id="subject" placeholder="Assunto da mensagem" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Mensagem</label>
                  <textarea 
                    id="message" 
                    className="w-full min-h-[120px] px-3 py-2 text-sm border rounded-md"
                    placeholder="Digite sua mensagem aqui..."
                  />
                </div>
                
                <Button type="submit" className="w-full">Enviar Mensagem</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg">
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex w-full justify-between p-4 font-medium text-left" 
        >
          {question}
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 pt-0 text-sm">
        {answer}
      </CollapsibleContent>
    </Collapsible>
  );
}

function TutorialCard({ 
  title, 
  description, 
  imageUrl, 
  videoUrl 
}: { 
  title: string; 
  description: string; 
  imageUrl: string; 
  videoUrl: string; 
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="aspect-video bg-muted relative">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white">
            Assistir Vídeo
          </Button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
