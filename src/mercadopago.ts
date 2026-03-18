/**
 * Mercado Pago Integration Module
 * Handles payments, subscriptions, and webhooks for ForteTrain
 * 
 * API Docs: https://www.mercadopago.com.br/developers/pt/reference
 */

export interface MercadoPagoConfig {
  accessToken: string;
  publicKey: string;
  webhookSecret?: string;
}

export interface CreatePreferencePayload {
  items: Array<{
    title: string;
    description?: string;
    quantity: number;
    unit_price: number;
    currency_id?: string;
  }>;
  payer?: {
    name?: string;
    surname?: string;
    email?: string;
    phone?: { area_code?: string; number?: string };
    identification?: { type?: string; number?: string };
  };
  back_urls?: {
    success?: string;
    failure?: string;
    pending?: string;
  };
  auto_return?: 'approved' | 'all';
  external_reference?: string;
  notification_url?: string;
  metadata?: Record<string, any>;
}

export interface CreateSubscriptionPayload {
  reason: string; // Plan name
  auto_recurring: {
    frequency: number; // 1
    frequency_type: 'months' | 'days';
    transaction_amount: number;
    currency_id: string; // 'BRL'
  };
  back_url: string;
  payer_email: string;
  external_reference?: string;
  status?: 'authorized' | 'paused' | 'cancelled';
}

export class MercadoPagoClient {
  private accessToken: string;
  private publicKey: string;
  private baseURL = 'https://api.mercadopago.com';

  constructor(config: MercadoPagoConfig) {
    this.accessToken = config.accessToken;
    this.publicKey = config.publicKey;
  }

  /**
   * Create a payment preference (checkout link)
   */
  async createPreference(payload: CreatePreferencePayload): Promise<any> {
    const response = await fetch(`${this.baseURL}/checkout/preferences`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`MercadoPago API Error: ${JSON.stringify(error)}`);
    }

    return response.json();
  }

  /**
   * Create a recurring subscription (preapproval)
   */
  async createSubscription(payload: CreateSubscriptionPayload): Promise<any> {
    const response = await fetch(`${this.baseURL}/preapproval`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`MercadoPago API Error: ${JSON.stringify(error)}`);
    }

    return response.json();
  }

  /**
   * Get payment details
   */
  async getPayment(paymentId: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`MercadoPago API Error: ${JSON.stringify(error)}`);
    }

    return response.json();
  }

  /**
   * Get subscription (preapproval) details
   */
  async getSubscription(subscriptionId: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/preapproval/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`MercadoPago API Error: ${JSON.stringify(error)}`);
    }

    return response.json();
  }

  /**
   * Update subscription status
   */
  async updateSubscription(subscriptionId: string, status: 'authorized' | 'paused' | 'cancelled'): Promise<any> {
    const response = await fetch(`${this.baseURL}/preapproval/${subscriptionId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`MercadoPago API Error: ${JSON.stringify(error)}`);
    }

    return response.json();
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<any> {
    return this.updateSubscription(subscriptionId, 'cancelled');
  }

  /**
   * Search payments by external_reference
   */
  async searchPayments(externalReference: string): Promise<any> {
    const response = await fetch(
      `${this.baseURL}/v1/payments/search?external_reference=${externalReference}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`MercadoPago API Error: ${JSON.stringify(error)}`);
    }

    return response.json();
  }

  /**
   * Create customer
   */
  async createCustomer(payload: {
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: { area_code?: string; number?: string };
    identification?: { type?: string; number?: string };
    description?: string;
  }): Promise<any> {
    const response = await fetch(`${this.baseURL}/v1/customers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`MercadoPago API Error: ${JSON.stringify(error)}`);
    }

    return response.json();
  }

  /**
   * Get customer
   */
  async getCustomer(customerId: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/v1/customers/${customerId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`MercadoPago API Error: ${JSON.stringify(error)}`);
    }

    return response.json();
  }

  /**
   * Verify webhook signature (x-signature header)
   */
  verifyWebhookSignature(signature: string, dataId: string, secret: string): boolean {
    // MercadoPago webhook signature verification
    // Format: ts={timestamp},v1={hmac_sha256}
    // TODO: Implement HMAC verification if webhook secret is configured
    return true; // For now, always return true (verify in production)
  }
}

/**
 * Helper functions for ForteTrain integration
 */

export function getPlanPrice(planType: string, billingCycle: 'monthly' | 'annual'): number {
  const prices: Record<string, { monthly: number; annual: number }> = {
    start: { monthly: 99.90, annual: 999.00 },
    pro: { monthly: 199.90, annual: 1999.00 },
    enterprise: { monthly: 499.90, annual: 4999.00 }
  };

  return prices[planType]?.[billingCycle] || 0;
}

export function getPlanName(planType: string): string {
  const names: Record<string, string> = {
    start: 'ForteTrain Start',
    pro: 'ForteTrain Pro',
    enterprise: 'ForteTrain Enterprise'
  };

  return names[planType] || 'ForteTrain Plan';
}

export function mapMercadoPagoStatus(mpStatus: string): string {
  // Map MercadoPago payment status to internal status
  const statusMap: Record<string, string> = {
    approved: 'completed',
    authorized: 'completed',
    pending: 'pending',
    in_process: 'pending',
    in_mediation: 'pending',
    rejected: 'failed',
    cancelled: 'failed',
    refunded: 'refunded',
    charged_back: 'refunded'
  };

  return statusMap[mpStatus] || 'pending';
}

export function mapSubscriptionStatus(mpStatus: string): string {
  // Map MercadoPago subscription status to internal status
  const statusMap: Record<string, string> = {
    authorized: 'active',
    paused: 'delinquent',
    cancelled: 'cancelled',
    pending: 'trial'
  };

  return statusMap[mpStatus] || 'trial';
}
