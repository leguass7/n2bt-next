**tabela `categorias`, não tem nada haver com `user.category`**

---

1 - Cadastro de usuário

- Pode copiar do projeto `speed-bt`
- Deve haver a possibilidade de desativar o cadastro temporariamente.
  objectivo: impedir que novos usuários se cadastrem. Por enquanto deixar mocado flag no código.

---

2 - Listar torneios

- No Card de Torneio deve haver "data limite" para inscrição
- Torneio deve haver "data limite" para expiração (tornio já aconteceu ou está acontecendo)
- Desaparecer botão de "incrição" quando limite expirar
- Ao clicar em "increva-se", abre para págian de inscrição `tournament/{id}`
- Card do torneio deve haver link para download PDF do regulamento. (pdf mokado na pasta `/public` do next)
- Card do torneio deve conter descrição (verificar possibilidade de texto inteligente HTML)

---

3 - Página do torneio

- a. Tabs com categorias permitidas para usuário realizar inscrição. _objetivo: selecionar uma categoria para inscrição_
- b. Usuário deve selecionar um parceiro (pair) antes de avançar
- c. Usuário avança para pagamento. Copiar lógica de pix no projeto `speed-bt`

3a - Torneio que já expirou, mostrará apenas ranking com pontuações

> Não pode se inscrever duas vezes na mesma categoria do torneio. **table `categories`**

---

▶️Principiante - fem
▶️Iniciante - Fem e mas
▶️Intermediário- masculino
▶️Mista - iniciante e Intermediário
