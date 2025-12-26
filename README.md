# HealthIA

## Visão Geral

O **HealthIA** é um projeto backend desenvolvido em **ASP.NET Core**, com foco em boas práticas de arquitetura, segurança e organização de código. O objetivo principal do projeto é servir como base sólida para aplicações de saúde, explorando conceitos modernos como **Clean Architecture**, **JWT Authentication**, **DTOs**, **AutoMapper**, **tratamento centralizado de exceções**, **paginação**, e integração com serviços externos de IA.

Este repositório representa um projeto em constante evolução, utilizado tanto para fins de estudo quanto para demonstração técnica de competências em desenvolvimento backend com .NET.

---

## Objetivos do Projeto

* Construir uma API robusta, escalável e segura
* Aplicar princípios de **separação de responsabilidades**
* Evitar o acoplamento direto entre camadas
* Garantir que erros internos não sejam expostos ao cliente
* Implementar autenticação e autorização com **JWT**
* Trabalhar com boas práticas de acesso a dados
* integração de IA

---

## Arquitetura

O projeto segue uma abordagem inspirada em **Clean Architecture**, organizada em camadas bem definidas:

### 📁 HealthIA.API

* Camada de entrada da aplicação
* Controllers
* Middlewares (ex.: tratamento global de exceções)
* Configuração de autenticação, autorização e pipeline HTTP

### 📁 HealthIA.Application

* Regras de aplicação
* DTOs (Data Transfer Objects)
* Services
* Interfaces de serviços
* Integração com serviços externos (ex.: IA)

### 📁 HealthIA.Domain

* Entidades do domínio
* Interfaces de repositórios
* Regras de negócio
* Objetos de valor

### 📁 HealthIA.Infra

* Implementação de repositórios
* Acesso a banco de dados
* Configuração de ORM
* Implementações concretas das interfaces do domínio

---

## Tecnologias Utilizadas

* **.NET / ASP.NET Core**
* **C#**
* **Entity Framework Core**
* **SQL Server / SQLite** (dependendo do ambiente)
* **JWT (JSON Web Token)**
* **AutoMapper**
* **Dependency Injection**

---

## Autenticação e Segurança

O projeto utiliza **JWT Authentication**, onde:

* O token é auto-contido
* Possui tempo de expiração configurado
* Endpoints protegidos exigem token válido
* O logout não invalida o token imediatamente (comportamento esperado em JWTs stateless)

A estrutura está preparada para futura implementação de:

* Blacklist de tokens
* Refresh Tokens
* Controle de sessão

---

## Tratamento de Exceções

Foi implementado um **middleware global de exceções**, garantindo que:

* Exceções não tratadas não exponham detalhes do backend
* Respostas sigam um padrão consistente
* Códigos HTTP apropriados sejam retornados

Isso aumenta significativamente a segurança e a confiabilidade da API.

---

## DTOs e AutoMapper

O uso de **DTOs** evita a exposição direta das entidades de domínio.

O **AutoMapper** é utilizado para:

* Converter entidades em DTOs
* Reduzir código repetitivo
* Manter o domínio isolado da camada de apresentação

---

## Paginação

A API suporta **paginação de resultados**, melhorando:

* Performance
* Consumo de dados
* Experiência do cliente

Esse padrão é essencial para aplicações que lidam com grandes volumes de dados.

---

## Status do Projeto

🚧 **Em desenvolvimento**

Novas funcionalidades, melhorias de segurança e otimizações de arquitetura estão sendo implementadas continuamente.

---

## Como Executar o Projeto

1. Clone o repositório
2. Configure a string de conexão no `appsettings.json`
3. Configure as variáveis de ambiente necessárias (ex.: chaves de API)
4. Execute as migrações do banco de dados
5. Inicie a aplicação

---

## Observações Importantes

* Este repositório tem foco educacional e demonstrativo
* Nem todas as funcionalidades finais estão expostas
* Algumas integrações podem estar parcialmente implementadas

---

## Contato

Para mais informações, feedback ou oportunidades de colaboração, entre em contato através do meu **LinkedIn**:

🔗 www.linkedin.com/in/leocaldio-carlos-9a197b255


