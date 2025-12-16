# App Gympass style app.

## RFs (Requisitos Funcionais)

- [x] Deve ser possivel se cadastrar
- [x] Deve ser possivel se autenticar
- [x] Deve ser possivel obter o perfil de um usuário logado
- [ ] Deve ser possivel obter o numero de check-ins realizados pelo usuário logado
- [x] Deve ser possivel o usuario obter seu historico de check-ins
- [ ] Deve ser possivel o usuário buscar academias próximas
- [ ] Deve ser possivel o usuário buscar uma academias pelo nome
- [x] Deve ser possivel o usuário realizar check-in em uma academia
- [ ] Deve ser possivel validar o check-in de um usuário
- [x] Deve ser possivel cadastrar uma academia

## RNs (Regras de negocios)

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado
- [x] O usuário não pode fazer 2 check-ins no mesmo dia
- [x] O usuário não pode fazer check-in se não estiver perto (300m) da academia
- [ ] O check-in só pode ser validado até 20 minutos após criado
- [ ] O check-in só pode ser validado por administradores
- [ ] A academia só pode ser cadastrada por adminstradores

## RNFs (Requisitos não-funcionais)

- [x] A senha do usuário precisa estar criptografada
- [x] Os dados da aplicação precisam estar persistidos em um banco PostreSQL
- [x] Todas as listas de dados precisar estar paginada com 20 itens por página
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token)
