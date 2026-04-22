# Water Base 💧
Anotações pessoais com banco de dados NoSql

## Tecnologias usados
- HTML
- javascript
- REACT
- firebase
  
## Acesso

[⛓ Water Base](https://rodrigoalvys.github.io/water-base/)
  
## Estrutura do Bando de Dados(Firebase)

O banco de dados possui uma estrutura em árvore com um nó principal `profiles`, que armazena todos os perfis de usuários:

```json
{
    "profiles": {
        "{uid_do_usuario}": {
            "email": "usuario@exemplo.com",
            "tipo": "comum",
            "criadoEm": "2024-01-15T10:30:00.000Z",
            "anotacoes": {
                "{id_da_nota}": {
                    "titulo": "Título da anotação",
                    "conteudo": "Conteúdo da anotação...",
                    "criadoEm": "2024-01-15T10:30:00.000Z",
                    "atualizadoEm": "2024-01-15T14:20:00.000Z"
                }
            }
        }
    }
}
```
  
### Nó profiles

Nó raiz que guarda tódos os perfis do sistema.

|Nome|Tipo|
|---|-----|
|*UID*|Object|
  
### Nó profiles/*UID*(perfis)

Nó que contem dados no usuário.

|Nome|Tipo|Obrigatório|Descrição|
|----|----|:---------:|---------|
|Email|string|sim|Email utilizado no login|
|Tipo|string|sim|Determina o nível de acesso: Comum e admin|
|CriadoEm|string|sim|Data em que o perfil foi criado|
|Anotações|object|sim|Container das anotações do usuáiro|
  
### Nó profiles/*UID*/anotacoes

Armazena todas as anotações do usuário

|Nome|tipo|Descrição|
|----|----|---------|
|*Id_nota*|Object|Identificador único da anotação

### Nó profiles/*UID*/anotacoes/*Id_nota*

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|:-----------:|-----------|
| titulo | string | Sim | Título da anotação |
| conteudo | string | Sim | Conteúdo/texto da anotação |
| criadoEm | string | Sim | Data de criação da anotação |
| atualizadoEm | string | Sim | Data da última edição |

## Regras de Segurança (Firebase Realtime Database)

```json
{
  "rules": {
    "profiles": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$uid": {
        ".read": "auth.uid === $uid || root.child('profiles/' + auth.uid + '/tipo').val() === 'admin'",
        ".write": "auth.uid === $uid || root.child('profiles/' + auth.uid + '/tipo').val() === 'admin'"
      }
    }
  }
}
```

### Explicação das regras:

| Regra | Significado |
|-------|-------------|
| profiles/.read: "auth != null" | Usuários autenticados podem listar perfis |
| profiles/.write: "auth != null" | Usuários autenticados podem escrever perfis |
| $uid/.read: "auth.uid === $uid" | Usuário pode ler seu próprio perfil |
| $uid/.read: "... root.child(...).val() === 'admin'" | Administradores podem ler qualquer perfil |
| $uid/.write | Mesma lógica do read (próprio perfil ou admin) |

##  Níveis de Acesso

### Usuário Comum (tipo: "comum")

- ✅ Criar, editar e excluir suas próprias anotações
- ✅ Visualizar apenas suas anotações
- ❌ Não pode ver anotações de outros usuários
- ❌ Não pode gerenciar perfis

### Administrador (tipo: "admin")

- ✅ Todos os poderes do usuário comum
- ✅ Visualizar todos os perfis cadastrados
- ✅ Criar novos perfis (usuários)
- ✅ Editar tipo de perfil (comum/admin)
- ✅ Excluir perfis (exceto o próprio)

## Imagens

<img width="932" height="464" alt="login" src="https://github.com/user-attachments/assets/07aecd9a-0faf-40dc-a6cc-d7f227c8d906" />
Login  
<br><br>
<img width="932" height="494" alt="Admin" src="https://github.com/user-attachments/assets/e49ac9d3-dc0a-4a7c-9a3a-ad26d7a8081f" />
Página de admin  
<br><br>
<img width="932" height="494" alt="Perfil_comum" src="https://github.com/user-attachments/assets/1e04c93a-2628-4524-85e4-e04079eb7ef7" />
Página de usuário  
<br>

## Licença

MIT

