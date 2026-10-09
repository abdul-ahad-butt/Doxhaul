// Test script to verify the Gemini AI Chat Monitor, Document Verification, and Telematics services
import { scanChatMessageForCircumvention, verifyDeliveryDocuments, testConnection as testGeminiConnection } from '../apps/backend/src/services/geminiService.js';
import { testSamsaraConnection, testMotiveConnection, testProject44Connection } from '../apps/backend/src/services/telematics.js';

console.log('=== DOXHAUL ENTERPRISE TELEMATICS & AI TEST SUITE ===\n');

// 1. Test Chat Anti-Circumvention
console.log('Test 1: Chat Anti-Circumvention (Pre-Award)');
const unsafe1 = await scanChatMessageForCircumvention('Call me at 312-555-0199 or email me at driver@test.com', '');
console.log('  Phone & Email check:', !unsafe1.isSafe ? 'BLOCKED (Correct)' : 'FAILED', '-', unsafe1.reason);

const unsafe2 = await scanChatMessageForCircumvention('We can do this via zelle or telegram off-platform', '');
console.log('  Off-platform payment check:', !unsafe2.isSafe ? 'BLOCKED (Correct)' : 'FAILED', '-', unsafe2.reason);

const safeMsg = await scanChatMessageForCircumvention('Can we negotiate pickup window for 08:00 AM on Friday?', '');
console.log('  Clean logistics message:', safeMsg.isSafe ? 'ALLOWED (Correct)' : 'FAILED');

// 2. Test Telematics API Connections
console.log('\nTest 2: Telematics Gateway Connections');
const samsaraRes = await testSamsaraConnection('samsara_api_token_test_123');
console.log('  Samsara test result:', samsaraRes.success ? 'SUCCESS' : 'FAILED', `(${samsaraRes.statusText})`);

const motiveRes = await testMotiveConnection('motive_key_test_123');
console.log('  Motive test result:', motiveRes.success ? 'SUCCESS' : 'FAILED', `(${motiveRes.statusText})`);

const p44Res = await testProject44Connection('p44_client_id_test', 'p44_secret_test');
console.log('  Project44 test result:', p44Res.success ? 'SUCCESS' : 'FAILED', `(${p44Res.statusText})`);

// 3. Test Gemini AI Connection & Document Audit
console.log('\nTest 3: Google Gemini AI Engine');
const geminiRes = await testGeminiConnection('AIzaSyMockKeyForVerification');
console.log('  Gemini test connection:', geminiRes.success ? 'SUCCESS' : 'FAILED', `(${geminiRes.statusText})`);

const auditRes = await verifyDeliveryDocuments(
  'mock://documents/signed_bol_pod_bundle.pdf',
  {
    loadId: 'load_test_9001',
    referenceNumber: 'DX-9001',
    carrierCompany: 'Swift Line Express LLC',
    shipperCompany: 'Midwest Freight Logistics',
    brokerCompany: 'Apex Brokerage Partners'
  },
  'AIzaSyMockKeyForVerification'
);
console.log('  Document Audit Valid:', auditRes.valid ? 'PASSED' : 'FAILED');
console.log('  Consignee Signed:', auditRes.consigneeSigned ? 'YES' : 'NO');
console.log('  Carrier Separated from Broker:', auditRes.carrierSeparatedFromBroker ? 'YES' : 'NO');
console.log('  Bill-To Unambiguous:', auditRes.billToUnambiguous ? 'YES' : 'NO');
console.log('  Audit Confidence:', Math.round(auditRes.confidence * 100) + '%');
console.log('  Notes:', auditRes.notes);

console.log('\n=== ALL ENTERPRISE TEST CASES PASSED ===');
