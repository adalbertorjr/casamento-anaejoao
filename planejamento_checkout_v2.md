# Planejamento: Pagamento Efetivo e Funcional (v2)

Este documento orienta a implementação do fluxo de pagamento (PIX e Cartão) para o site estático de presentes do casamento Ana & João. Objetivo: transformar o front-end estático em um checkout seguro, confiável e simples para convidados.

---

## Resumo das opções recomendadas

1) WhatsApp + PIX (fallback/low-cost)
   - Direciona mensagem com chave PIX e resumo do pedido ao WhatsApp do casal/padrinhos.
   - Prós: sem taxas, rápida de implementar, sem backend.
   - Contras: exige acompanhamento manual para confirmar/conciliar pagamentos.

2) Mercado Pago (PIX dinâmico + Cartões)
   - Gera QR Code PIX dinâmico e sessões de cartão via API. Usa webhooks para confirmar pagamento.
   - Prós: automação, conciliação, experiência mais profissional.
   - Contras: necessita serverless para segredos; taxas aplicáveis.

3) Stripe Checkout (cartões) + gateway local/MP para PIX
   - Stripe para cartão; usar MP para PIX se desejar PIX nativo no Brasil.
   - Prós: segurança, PCI offload, webhooks robustos.
   - Contras: configurações múltiplas se usar dois gateways.

Recomendação prática: começar com WhatsApp+PIX para ativação rápida; em paralelo implementar Mercado Pago (sandbox → produção) para automação completa.

---

## Especificação técnica (mínima necessária)

Arquitetura: Jamstack + Serverless Functions (Netlify/Vercel/AWS Lambda)

Endpoints propostos (serverless):

- POST /api/checkout
  - Entrada (JSON): { orderId, items: [{id,name,price,qty}], total, customer: {name,email? ,phone?}, returnUrl }
  - Ações: validar total, criar registro de pedido em DB (ou sheet), chamar gateway para criar pagamento (PIX qr / sessão cartão), retornar dados de pagamento ao front-end.
  - Resposta (JSON): { orderId, payment: {type:'pix'|'card', qr_image_svg?, pix_key?, gateway_session_url?, expires_at } }

- POST /api/webhook
  - Recebe eventos do gateway (pagamento aprovado, recusado, estornado).
  - Validação: verificar assinatura HMAC/secret do gateway.
  - Ações: atualizar status do pedido, enviar e-mail de confirmação/recebimento para casal, acionar UI de sucesso via página de retorno.

- GET /api/order/:orderId (opcional)
  - Retorna status atual do pedido para polling (se não usar webhooks).

Banco de armazenamento sugerido:
- Opções simples: Airtable, Google Sheets, Fauna, Supabase (gratuito em planos básicos)
- Esquema mínimo "orders":
  - id (string), items (JSON), total (number), status (pending/paid/failed), payment_method, payment_meta (qr/pix/key), created_at, paid_at, customer

Idempotência: criar orderId no cliente antes do POST para evitar duplicados. Serverless deve rejeitar criação duplicada.

---

## Webhooks e conciliação

- Habilitar webhooks no gateway sandbox e validar eventos no /api/webhook.
- Implementar verificação de assinatura.
- Ao receber evento de pagamento confirmado:
  - Marcar pedido como paid
  - Enviar confirmação por e-mail (ou WhatsApp automatizado via API como Twilio/MessageBird)
  - Registrar recibo (ID da transação, valor, fees)

Retries: manter lógica para idempotência de webhooks (processamento seguro mesmo com reenvios).

---

## UX e front-end (melhorias concretas)

- Persistir carrinho em localStorage para evitar perda ao recarregar.
- Drawer do carrinho: botão fixo "Finalizar compra" e indicador de progresso durante a criação da sessão.
- Página/modal de checkout clara: mostrar método (PIX/Cartão), total, instruções de pagamento e tempo restante para QR expirado.
- PIX: mostrar QR grande, botão "Copiar chave PIX" e "Copiar linha PIX"; feedback visual ao copiar.
- Cartão: ao usar Stripe, redirecionar para Checkout (mais seguro) ou usar Elements para experiência embutida.
- Confirmação: gerar página /thank-you?orderId=xxx com resumo e próximos passos.
- Acessibilidade: contraste, labels em inputs, foco no modal, aria-live para status dinâmico.

---

## Segurança e privacidade

- Nunca expor chaves secretas no front-end. Guardar secrets em provider de serverless (env vars).
- Usar HTTPS em todas as comunicações.
- Não armazenar dados sensíveis de cartão no servidor (gateway lida com isso).
- Política de privacidade mínima: explicar que serão usados nome/email/telefone apenas para confirmação.
- Rate limiting nas endpoints serverless para evitar abuso.

---

## Testes e homologação

1. Criar contas sandbox (Mercado Pago / Stripe).
2. Implementar serverless em ambiente de staging (Vercel/Netlify). Usar ngrok se quiser testar webhooks localmente.
3. Simular pagamentos (aprovados, recusados, estornos) para validar fluxos.
4. Testar edge cases: QR expirado, duplicidade de pedido, falha de webhook.

---

## Checklist de implementação (priorizada)

1. MVP rápido (2–4h):
   - [ ] Implementar botão "Pagar via WhatsApp" com mensagem pré-populada e chave PIX.
   - [ ] Persistir carrinho em localStorage.
   - [ ] Tela de sucesso local (após confirmação manual).

2. Automação (1–2 dias):
   - [ ] Criar serverless /api/checkout que cria pagamento no gateway sandbox.
   - [ ] Criar /api/webhook e validação de assinatura.
   - [ ] Persistir orders em DB (Airtable/Supabase).
   - [ ] Implementar pagina /thank-you e e-mail de confirmação.

3. Produção (após testes):
   - [ ] Trocar chaves para produção, testar end-to-end.
   - [ ] Revisar política de privacidade e termos.
   - [ ] Monitoramento (logs, alertas para falhas de webhook).

---

## Observações de design visual e usabilidade

- Paleta de cores e tipografia já coerentes com tema elegante; garantir contraste para leitura e botões grandes em mobile.
- CTA do carrinho deve ser claramente destacado (cor sólida, sombra sutil).
- QR Code em modal deve ser grande e central em mobile; incluir instruções curtas "Abra o app do seu banco → Leia o QR".
- Considerar adicionar indicador de "presente já comprado" se algum item tiver limitação (opcional).

---

## Próximos passos sugeridos (práticos)

1. Escolher abordagem (WhatsApp rápido ou Mercado Pago para automação).
2. Se escolher automação: criar conta sandbox e prover credenciais de teste.
3. Implementar MVP WhatsApp+PIX e persistência de carrinho enquanto o backend é desenvolvido.
4. Posso gerar o código de exemplo do serverless (Node.js) para /api/checkout e /api/webhook e o snippet front-end para integrar — confirmar se deseja que eu implemente esses arquivos.

---

Ficou claro? Quer que eu gere os snippets (serverless + front-end) para começar a implementação agora?