import { PlatformSettings } from './settings';

export class PaddleService {
  /**
   * Returns base URL for Paddle API depending on environment
   */
  static getBaseUrl(environment: 'sandbox' | 'production'): string {
    return environment === 'production'
      ? 'https://api.paddle.com'
      : 'https://sandbox-api.paddle.com';
  }

  /**
   * Test connection using configured Paddle credentials
   */
  static async testConnection(settings: PlatformSettings): Promise<{ success: boolean; message: string; details?: any }> {
    if (!settings.paddle_api_key) {
      return {
        success: false,
        message: 'Paddle API Key is missing. Please enter your secret key and save settings.',
      };
    }

    const baseUrl = this.getBaseUrl(settings.paddle_environment);
    try {
      const response = await fetch(`${baseUrl}/event-types`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${settings.paddle_api_key.trim()}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: any = await response.json();
        return {
          success: true,
          message: `Successfully connected to Paddle (${settings.paddle_environment.toUpperCase()} mode).`,
          details: { status: response.status, dataPreview: data?.data?.length ?? 'OK' },
        };
      } else {
        const errorData: any = await response.json().catch(() => ({}));
        const errDetail = errorData?.error?.detail || errorData?.error?.message || response.statusText;
        return {
          success: false,
          message: `Paddle API responded with status ${response.status}: ${errDetail}`,
          details: errorData,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Network error connecting to Paddle: ${error?.message || 'Unknown error'}`,
      };
    }
  }

  /**
   * Verifies Paddle Webhook signature using Web Crypto HMAC SHA-256
   * Paddle-Signature format: "ts=1692290885;h1=abcdef..."
   */
  static async verifyWebhookSignature(
    signatureHeader: string | null | undefined,
    rawBody: string,
    secret: string
  ): Promise<boolean> {
    if (!secret) {
      // If secret is not yet configured, allow in development or reject
      return true;
    }

    if (!signatureHeader) {
      return false;
    }

    try {
      const parts = signatureHeader.split(';');
      let ts = '';
      let h1 = '';

      for (const part of parts) {
        const [k, v] = part.split('=');
        if (k === 'ts') ts = v;
        if (k === 'h1') h1 = v;
      }

      if (!ts || !h1) return false;

      const encoder = new TextEncoder();
      const signedPayload = `${ts}:${rawBody}`;
      
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload));
      const hashArray = Array.from(new Uint8Array(signature));
      const computedHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      return computedHex.toLowerCase() === h1.toLowerCase();
    } catch (err) {
      console.error('Webhook signature verification error:', err);
      return false;
    }
  }

  /**
   * Helper to create a Paddle checkout transaction (or mock for testing)
   */
  static async createTransaction(
    settings: PlatformSettings,
    params: {
      amount: number;
      currency?: string;
      customerEmail: string;
      description: string;
      customData?: Record<string, any>;
    }
  ): Promise<{ transactionId: string; checkoutUrl?: string; isMock?: boolean }> {
    const { amount, currency = 'USD', customerEmail, description, customData = {} } = params;

    if (!settings.paddle_api_key) {
      // Provide sandbox simulated transaction id
      const mockId = `txn_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return {
        transactionId: mockId,
        checkoutUrl: `#mock-checkout-${mockId}`,
        isMock: true,
      };
    }

    const baseUrl = this.getBaseUrl(settings.paddle_environment);
    try {
      // Amount in Paddle is represented in minor units or items
      const bodyPayload = {
        items: [
          {
            price: {
              description,
              unit_price: {
                amount: Math.round(amount * 100).toString(),
                currency_code: currency,
              },
              product: {
                name: description,
                tax_category: 'standard',
              },
            },
            quantity: 1,
          },
        ],
        customer_email: customerEmail,
        custom_data: customData,
      };

      const res = await fetch(`${baseUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.paddle_api_key.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
      });

      if (res.ok) {
        const json: any = await res.json();
        return {
          transactionId: json?.data?.id || `txn_${Date.now()}`,
          checkoutUrl: json?.data?.checkout?.url,
          isMock: false,
        };
      } else {
        const mockId = `txn_fallback_${Date.now()}`;
        return {
          transactionId: mockId,
          checkoutUrl: `#checkout-${mockId}`,
          isMock: true,
        };
      }
    } catch {
      const mockId = `txn_fallback_${Date.now()}`;
      return {
        transactionId: mockId,
        checkoutUrl: `#checkout-${mockId}`,
        isMock: true,
      };
    }
  }
}
