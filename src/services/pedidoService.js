import { fetchAuth } from './api'

export const pedidoService = {
  checkoutHospedado: (direccionId) =>
    fetchAuth('/pedidos/checkout', {
      method: 'POST',
      body: JSON.stringify({ direccion_id: direccionId }),
    }),

  checkoutTarjeta: ({ direccionId, cardToken, acceptanceToken, personalAuthToken }) =>
    fetchAuth('/pedidos/checkout/tarjeta', {
      method: 'POST',
      body: JSON.stringify({
        direccion_id: direccionId,
        card_token: cardToken,
        acceptance_token: acceptanceToken,
        personal_auth_token: personalAuthToken,
      }),
    }),

  misCompras: () => fetchAuth('/pedidos'),

  estadoPedido: (numero) => fetchAuth(`/pedidos/${numero}`),
}
