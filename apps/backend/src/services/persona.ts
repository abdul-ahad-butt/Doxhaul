import { PlatformSettings } from './settings';

export class PersonaService {
  private static BASE_URL = 'https://withpersona.com/api/v1';

  /**
   * Test Persona connection using configured API key & template ID
   */
  static async testConnection(settings: PlatformSettings): Promise<{ success: boolean; message: string; details?: any }> {
    if (!settings.persona_api_key) {
      return {
        success: false,
        message: 'Persona API Key is missing. Please enter your secret key and save settings.',
      };
    }

    try {
      const response = await fetch(`${this.BASE_URL}/inquiry-templates`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${settings.persona_api_key.trim()}`,
          'Persona-Version': '2023-01-05',
          'Content-Type': 'application/json',
          'Key-Inflection': 'camel',
        },
      });

      if (response.ok) {
        const data: any = await response.json();
        const templates = data?.data || [];
        const templateExists = settings.persona_template_id 
          ? templates.some((t: any) => t.id === settings.persona_template_id.trim())
          : false;

        return {
          success: true,
          message: `Persona connection verified successfully (${settings.persona_environment.toUpperCase()} mode).` + 
            (settings.persona_template_id 
              ? (templateExists ? ' Template ID found!' : ' Note: configured template ID was not in standard templates list, but API key is valid.')
              : ''),
          details: { templateCount: templates.length },
        };
      } else {
        const errJson: any = await response.json().catch(() => ({}));
        return {
          success: false,
          message: `Persona API responded with ${response.status}: ${errJson?.errors?.[0]?.title || response.statusText}`,
          details: errJson,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Network error connecting to Persona: ${error?.message || 'Unknown error'}`,
      };
    }
  }

  /**
   * Creates a Persona verification inquiry for a user
   */
  static async createInquiry(
    settings: PlatformSettings,
    params: {
      userId: string;
      email: string;
      name?: string;
      referenceId?: string;
    }
  ): Promise<{ inquiryId: string; redirectUrl?: string; isMock?: boolean }> {
    const { userId, referenceId = userId } = params;

    if (!settings.persona_api_key || !settings.persona_template_id) {
      // Mock inquiry for sandbox / unconfigured flow
      const mockInquiryId = `inq_mock_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      return {
        inquiryId: mockInquiryId,
        redirectUrl: `https://withpersona.com/verify?inquiry-id=${mockInquiryId}`,
        isMock: true,
      };
    }

    try {
      const response = await fetch(`${this.BASE_URL}/inquiries`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.persona_api_key.trim()}`,
          'Persona-Version': '2023-01-05',
          'Content-Type': 'application/json',
          'Key-Inflection': 'camel',
        },
        body: JSON.stringify({
          data: {
            attributes: {
              inquiryTemplateId: settings.persona_template_id.trim(),
              referenceId,
            },
          },
        }),
      });

      if (response.ok) {
        const json: any = await response.json();
        const inquiryId = json?.data?.id;
        return {
          inquiryId,
          redirectUrl: `https://withpersona.com/verify?inquiry-id=${inquiryId}`,
          isMock: false,
        };
      } else {
        const mockInquiryId = `inq_fallback_${Date.now()}`;
        return {
          inquiryId: mockInquiryId,
          redirectUrl: `https://withpersona.com/verify?inquiry-id=${mockInquiryId}`,
          isMock: true,
        };
      }
    } catch {
      const mockInquiryId = `inq_fallback_${Date.now()}`;
      return {
        inquiryId: mockInquiryId,
        redirectUrl: `https://withpersona.com/verify?inquiry-id=${mockInquiryId}`,
        isMock: true,
      };
    }
  }
}
