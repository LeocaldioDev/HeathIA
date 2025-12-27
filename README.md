<p align="center">
  <img src="https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET"/>
  <img src="https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white" alt="C#"/>
  <img src="https://img.shields.io/badge/Entity_Framework-512BD4?style=for-the-badge&logo=.net&logoColor=white" alt="EF Core"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI"/>
  <img src="https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white" alt="SQL Server"/>
</p>

<h1 align="center">🏥 HealthIA</h1>

<p align="center">
  <strong>Sistema de Avaliação Preliminar de Saúde com Inteligência Artificial</strong>
</p>

<p align="center">
  <em>Uma API robusta que utiliza IA para fornecer avaliações preliminares de saúde, conectando pacientes e médicos de forma inteligente.</em>
</p>

---

## 📖 Origem do Projeto

O **HealthIA** nasceu como um **desafio universitário** com o objetivo de desenvolver um sistema inovador de **obtenção de resultados preliminares de saúde por meio de Inteligência Artificial**. A proposta era criar uma solução que pudesse auxiliar pacientes a obterem uma primeira avaliação sobre seus sintomas, enquanto mantém profissionais médicos no controlo para validação e acompanhamento.

Este projeto representa não apenas uma entrega académica, mas uma jornada de aprendizagem profunda em:

- 🏗️ **Arquitetura de Software** - Aplicação prática de Clean Architecture
- 🔐 **Segurança** - Implementação real de autenticação JWT
- 🤖 **Integração com IA** - Conexão com o Google Gemini para análise inteligente
- 📊 **Boas Práticas** - DTOs, AutoMapper, tratamento de exceções, paginação
- 💡 **Resolução de Problemas** - Desafios reais de desenvolvimento backend

> *"Este projeto foi uma das experiências mais enriquecedoras da minha formação. Cada funcionalidade implementada representou um novo conceito aprendido e consolidado na prática."*

---

## 🎯 Visão Geral

O **HealthIA** é uma API RESTful desenvolvida em **ASP.NET Core** que serve como backend para um sistema de saúde inteligente. A aplicação permite:

- 👤 **Pacientes** descrevem seus sintomas
- 🤖 **IA (Google Gemini)** analisa e gera uma avaliação preliminar
- 👨‍⚕️ **Médicos** validam e acompanham os resultados
- 🔧 **Administradores** gerem todo o sistema

---

## ✅ Funcionalidades Implementadas

### 🔐 Autenticação & Autorização
- [x] Autenticação via **JWT (JSON Web Token)**
- [x] Tokens com tempo de expiração configurável
- [x] Endpoints protegidos por autorização
- [x] Sistema de **Roles** (Paciente, Médico, Admin)
- [x] Claims personalizadas para controlo de acesso

### 👥 Gestão de Utilizadores
- [x] Cadastro de **Pacientes** com dados pessoais completos
- [x] Cadastro de **Médicos** com especialidade
- [x] Cadastro de **Administradores**
- [x] Gestão completa de utilizadores (CRUD)
- [x] Perfis diferenciados por tipo de utilizador

### 📋 Sistema de Consultas
- [x] Criação de consultas pelos pacientes
- [x] Análise de sintomas pela **IA Gemini**
- [x] Geração de **resultados preliminares** automáticos
- [x] **Validação médica** dos resultados
- [x] Histórico completo de consultas

### 🤖 Integração com IA
- [x] Serviço dedicado para comunicação com **Google Gemini**
- [x] Interface `IGeminiService` para abstração
- [x] Processamento inteligente de sintomas
- [x] Geração de avaliações preliminares

### 🛡️ Segurança & Tratamento de Erros
- [x] **Middleware global** para tratamento de exceções
- [x] Respostas padronizadas de erro
- [x] Proteção contra exposição de dados sensíveis
- [x] Códigos HTTP apropriados
- [x] Configuração de **CORS** para frontend

### 📊 Recursos Avançados
- [x] **Paginação** em todos os endpoints de listagem
- [x] Paginação retornada via **headers HTTP**
- [x] DTOs para isolamento do domínio
- [x] **AutoMapper** para conversões automáticas
- [x] **Swagger/OpenAPI** para documentação

---

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture**, garantindo separação de responsabilidades, testabilidade e manutenibilidade:

```
📦 HealthIA
├── 📁 HealthIA.API               → Camada de Apresentação
│   ├── Controllers/              → Endpoints da API
│   │   ├── AdminController
│   │   ├── CadastroController
│   │   ├── ConsultaController
│   │   ├── MedicoController
│   │   ├── PacienteController
│   │   └── UsuarioController
│   ├── GeminiService/            → Integração com IA
│   ├── IGemini/                  → Interface do serviço IA
│   ├── Middleware/               → Tratamento global de exceções
│   ├── Errors/                   → Classes de erro padronizadas
│   ├── Extensions/               → Métodos de extensão
│   └── Models/                   → View Models
│
├── 📁 HealthIA.Application       → Camada de Aplicação
│   ├── DTOs/                     → Data Transfer Objects
│   │   ├── AdminDTO
│   │   ├── ConsultaDTO / ConsultaPostDTO
│   │   ├── MedicoDTO
│   │   ├── PacienteDTO / PacientePostDTO
│   │   └── UsuarioDTO / UsuarioPostDTO / UsuarioRegisterDTO
│   ├── Interfaces/               → Contratos de serviços
│   ├── Mapping/                  → Perfis do AutoMapper
│   └── Services/                 → Lógica de aplicação
│       ├── AdminService
│       ├── ConsultaService
│       ├── MedicoService
│       ├── PacienteService
│       └── UsuarioService
│
├── 📁 HealthIA.Domain            → Camada de Domínio
│   ├── Account/                  → Modelos de autenticação
│   ├── Entities/                 → Entidades do negócio
│   │   ├── Admin
│   │   ├── Consulta
│   │   ├── Medico
│   │   ├── Paciente
│   │   └── Usuario
│   ├── Interface/                → Contratos de repositórios
│   ├── Pagination/               → Objetos de paginação
│   ├── SystemModels/             → Modelos do sistema
│   └── Validation/               → Validações de domínio
│
├── 📁 HealthIA.Infra.Data        → Camada de Infraestrutura
│   ├── Context/                  → DbContext do EF Core
│   ├── EntitiesConfiguration/    → Configurações Fluent API
│   ├── Helper/                   → Classes auxiliares
│   ├── Identity/                 → Implementação de autenticação
│   ├── Migrations/               → Migrações do banco
│   └── Repository/               → Implementação dos repositórios
│
└── 📁 HealthIA.Infra.Ioc         → Inversão de Controlo
    ├── InjeccaoDeDependencias    → Container DI
    ├── DependencyInjectionSwagger
    └── ClaimsPrincipalExtension
```

---

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia |
|-----------|------------|
| **Framework** | ASP.NET Core 8+ |
| **Linguagem** | C# |
| **ORM** | Entity Framework Core |
| **Base de Dados** | SQL Server |
| **Autenticação** | JWT Bearer Tokens |
| **IA** | Google Gemini API |
| **Mapeamento** | AutoMapper |
| **Documentação** | Swagger / OpenAPI |
| **Arquitectura** | Clean Architecture |

---

## 🚀 Como Executar

### Pré-requisitos
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/sql-server) (ou SQL Server Express)
- Chave de API do [Google Gemini](https://makersuite.google.com/app/apikey)

### Passos

1. **Clone o repositório**
   ```bash
   git clone https://github.com/LeocaldioDev/HeathIA.git
   cd HeathIA
   ```

2. **Configure a connection string** em `appsettings.json`
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=.;Database=HealthIA;Trusted_Connection=True;TrustServerCertificate=True;"
     }
   }
   ```

3. **Configure a chave do Gemini** (variável de ambiente ou appsettings)
   ```json
   {
     "GeminiApi": {
       "ApiKey": "SUA_CHAVE_AQUI"
     }
   }
   ```

4. **Execute as migrações**
   ```bash
   dotnet ef database update --project HealthIA.Infra.Data --startup-project HealthIA.API
   ```

5. **Inicie a aplicação**
   ```bash
   dotnet run --project HealthIA.API
   ```

6. **Acesse a documentação Swagger**
   ```
   https://localhost:5001/swagger
   ```

---

## 📡 Endpoints Principais

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/cadastro/register` | Registar novo utilizador |
| `POST` | `/api/cadastro/login` | Autenticação (retorna JWT) |
| `GET` | `/api/paciente` | Listar pacientes (paginado) |
| `GET` | `/api/medico` | Listar médicos (paginado) |
| `GET` | `/api/consulta` | Listar consultas (paginado) |
| `POST` | `/api/consulta` | Criar nova consulta (aciona IA) |
| `PUT` | `/api/consulta/{id}/validar` | Validação médica |
| `GET` | `/api/admin` | Gestão administrativa |

> 📌 **Nota**: A paginação é retornada no header `Pagination` das respostas.

---

## 🎓 Aprendizagens

Este projeto proporcionou aprendizagens valiosas em:

- **Clean Architecture** na prática, não apenas na teoria
- Implementação real de **autenticação JWT** com roles e claims
- Integração com **serviços externos de IA** (Google Gemini)
- Criação de **middlewares personalizados** para tratamento de erros
- Uso correto de **DTOs** para proteger o domínio
- Configuração de **injecção de dependências** em projectos em camadas
- Implementação de **paginação eficiente** para grandes volumes de dados
- Boas práticas de **segurança em APIs**

---

## 🚧 Roadmap Futuro

- [ ] Implementação de Refresh Tokens
- [ ] Blacklist de tokens para logout seguro
- [ ] Testes unitários e de integração
- [ ] Cache distribuído com Redis
- [ ] Logs estruturados com Serilog
- [ ] Deploy em ambiente cloud (Azure/AWS)
- [ ] Rate limiting para proteção da API
- [ ] Notificações em tempo real (SignalR)

---

## 👤 Autor

<table>
  <tr>
    <td align="center">
      <strong>Leocaldio Carlos</strong><br/>
      <em>Desenvolvedor Backend</em><br/><br/>
      <a href="https://www.linkedin.com/in/leocaldio-carlos-9a197b255">
        <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
      </a>
      <a href="https://github.com/LeocaldioDev">
        <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
      </a>
    </td>
  </tr>
</table>

---

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais como parte de um desafio universitário.

---

<p align="center">
  <strong>⭐ Se este projeto te foi útil, considera deixar uma estrela!</strong>
</p>

<p align="center">
  Feito com 💜 e muito ☕ por <a href="https://github.com/LeocaldioDev">Leocaldio Carlos</a>
</p>
