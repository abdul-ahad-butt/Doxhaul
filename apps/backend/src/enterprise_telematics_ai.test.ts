import { describe, it, expect } from 'vitest';
import { scanChatMessageForCircumvention, verifyDeliveryDocuments, testConnection as testGeminiConnection } from './services/geminiService';
import { testSamsaraConnection, testMotiveConnection, testProject44Connection } from './services/telematics';

describe('Enterprise Gemini AI & Telematics Suite', () => {
  describe('Gemini AI Chat Anti-Circumvention (Pre-Award)', () => {
    it('should block phone numbers during bidding', async () => {
      const res = await scanChatMessageForCircumvention('Call my cell at 312-555-0199 to discuss the load', '');
      expect(res.isSafe).toBe(false);
      expect(res.reason).toContain('prohibited');
    });

    it('should block email addresses during bidding', async () => {
      const res = await scanChatMessageForCircumvention('Reach me at dispatch@fastfreight.com', '');
      expect(res.isSafe).toBe(false);
      expect(res.reason).toContain('prohibited');
    });

    it('should block off-platform payment methods (Zelle, Venmo, Wire)', async () => {
      const res = await scanChatMessageForCircumvention('Can you send payment through zelle or wire transfer off-platform?', '');
      expect(res.isSafe).toBe(false);
      expect(res.reason).toContain('prohibited');
    });

    it('should allow legitimate freight rate and schedule negotiations', async () => {
      const res = await scanChatMessageForCircumvention('Can we negotiate pickup for Friday 8:00 AM? We have a 53ft reefer ready.', '');
      expect(res.isSafe).toBe(true);
    });
  });

  describe('Gemini AI Document Audit (e-BOL & POD)', () => {
    it('should audit delivery documentation with carrier/broker separation and signatures', async () => {
      const result = await verifyDeliveryDocuments(
        'mock://documents/signed_bol_pod_bundle.pdf',
        {
          loadId: 'load_test_9001',
          referenceNumber: 'DX-9001',
          carrierCompany: 'Swift Line Express LLC',
          shipperCompany: 'Midwest Freight Logistics',
          brokerCompany: 'Apex Brokerage Partners'
        },
        'mock_gemini_key'
      );

      expect(result.valid).toBe(true);
      expect(result.consigneeSigned).toBe(true);
      expect(result.carrierDistinctFromBroker).toBe(true);
      expect(result.billToUnambiguous).toBe(true);
      expect(result.carrierMatches).toBe(true);
      expect(result.signatureConfidence).toBeGreaterThan(0.8);
      expect(typeof result.notes).toBe('string');
    });
  });

  describe('Telematics & Gateway Test Connections', () => {
    it('should test Samsara ELD gateway connection', async () => {
      const res = await testSamsaraConnection('samsara_test_token_123');
      expect(res.success).toBe(true);
      expect(res.message).toContain('Connected');
    });

    it('should test Motive (KeepTruckin) gateway connection', async () => {
      const res = await testMotiveConnection('motive_test_api_key_456');
      expect(res.success).toBe(true);
      expect(res.message).toContain('Connected');
    });

    it('should test Project44 movement gateway connection', async () => {
      const res = await testProject44Connection('p44_client_id_789', 'p44_secret_abc');
      expect(res.success).toBe(true);
      expect(res.message).toContain('Connected');
    });

    it('should test Google Gemini AI engine connection', async () => {
      const res = await testGeminiConnection('AIzaSyMockTestKey');
      expect(res.success).toBe(true);
      expect(res.message).toContain('Connected');
    });
  });
});
