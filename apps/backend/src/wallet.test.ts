import { describe, it, expect } from 'vitest';
import { SettingsService, DEFAULT_PLATFORM_SETTINGS } from './services/settings';
import { PaddleService } from './services/paddle';
import { PersonaService } from './services/persona';

describe('SettingsService', () => {
  it('returns default settings when database has no records', async () => {
    const mockDb: any = {
      prepare: () => ({
        all: async () => ({ results: [] }),
        first: async () => null,
      }),
    };

    const settings = await SettingsService.getPlatformSettings(mockDb);
    expect(settings.platform_fee_percent).toBe(7.5);
    expect(settings.carrier_onboarding_fee).toBe(25.0);
    expect(settings.broker_onboarding_fee).toBe(50.0);
    expect(settings.shipper_onboarding_fee).toBe(0.0);
    expect(settings.paddle_environment).toBe('sandbox');
    expect(settings.persona_environment).toBe('sandbox');
  });

  it('returns financial policies properly', async () => {
    const mockDb: any = {
      prepare: () => ({
        all: async () => ({
          results: [
            { key: 'platform_commission_percent', value: '8' },
            { key: 'carrier_onboarding_fee', value: '25' },
            { key: 'shipper_onboarding_fee', value: '30' },
            { key: 'broker_onboarding_fee', value: '50' },
          ]
        }),
      }),
    };

    const policies = await SettingsService.getFinancialPolicies(mockDb);
    expect(policies.commissionPercent).toBe(8);
    expect(policies.carrierFee).toBe(25);
    expect(policies.shipperFee).toBe(30);
    expect(policies.brokerFee).toBe(50);
  });
});

describe('PaddleService', () => {
  it('uses sandbox URL when environment is sandbox', () => {
    expect(PaddleService.getBaseUrl('sandbox')).toBe('https://sandbox-api.paddle.com');
    expect(PaddleService.getBaseUrl('production')).toBe('https://api.paddle.com');
  });

  it('fails connection test gracefully when api key is missing', async () => {
    const res = await PaddleService.testConnection({
      ...DEFAULT_PLATFORM_SETTINGS,
      paddle_api_key: '',
    });
    expect(res.success).toBe(false);
    expect(res.message).toContain('Paddle API Key is missing');
  });

  it('generates simulated transaction when in sandbox with no key', async () => {
    const res = await PaddleService.createTransaction(
      { ...DEFAULT_PLATFORM_SETTINGS, paddle_api_key: '' },
      {
        amount: 25,
        customerEmail: 'test@carrier.com',
        description: 'Test Carrier Onboarding Fee',
      }
    );
    expect(res.isMock).toBe(true);
    expect(res.transactionId).toBeDefined();
    expect(res.checkoutUrl).toBeDefined();
  });
});

describe('PersonaService', () => {
  it('fails connection test gracefully when api key is missing', async () => {
    const res = await PersonaService.testConnection({
      ...DEFAULT_PLATFORM_SETTINGS,
      persona_api_key: '',
    });
    expect(res.success).toBe(false);
    expect(res.message).toContain('Persona API Key is missing');
  });

  it('generates mock inquiry when template id or key is not set', async () => {
    const res = await PersonaService.createInquiry(
      { ...DEFAULT_PLATFORM_SETTINGS, persona_api_key: '', persona_template_id: '' },
      {
        userId: 'usr_123',
        email: 'driver@doxhaul.com',
      }
    );
    expect(res.isMock).toBe(true);
    expect(res.inquiryId).toBeDefined();
    expect(res.redirectUrl).toContain('withpersona.com/verify');
  });
});
