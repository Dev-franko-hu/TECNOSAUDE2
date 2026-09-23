# Tecnosaude

Site público da consultoria fitness Tecnosaude.

## Antes de divulgar o site

1. Abra `script.js`.
2. Localize `whatsappNumber` dentro de `CONFIG`.
3. Substitua `5511999999999` pelo seu número real, usando apenas números:
   - código do país (`55`);
   - DDD;
   - número do WhatsApp.
4. Faça o commit e aguarde o GitHub Pages atualizar.

Exemplo para `(11) 98765-4321`:

```js
whatsappNumber: "5511987654321"
```

## Funcionamento

- O visitante informa nome, telefone e consentimento antes de começar.
- O plano precisa ser selecionado antes do formulário.
- O formulário é dividido em cinco etapas e valida os campos obrigatórios.
- Ao enviar, os dados são formatados e enviados para o WhatsApp configurado.
- O formulário usa `localStorage` apenas como rascunho no navegador; ele não substitui um banco de dados.

## Publicação

No GitHub, abra `Settings > Pages`, selecione `Deploy from a branch`, escolha `main` e `/(root)`, e salve.
