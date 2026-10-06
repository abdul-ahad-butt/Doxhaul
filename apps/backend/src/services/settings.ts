export interface PlatformSettings {
  paddle_environment: 'sandbox' | 'production';
  paddle_vendor_id: string;
  paddle_api_key: string;
  paddle_client_token: string;
  paddle_webhook_secret: string;
  platform_fee_percent: number;
  carrier_onboarding_fee: number;
  shipper_onboarding_fee: number;
  broker_onboarding_fee: number;
  persona_environment: 'sandbox' | 'production';
  persona_api_key: string;
  persona_template_id: string;
}

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  paddle_environment: 'sandbox',
  paddle_vendor_id: '',
  paddle_api_key: '',
  paddle_client_token: '',
  paddle_webhook_secret: '',
  platform_fee_percent: 7.5,
  carrier_onboarding_fee: 25.00,
  shipper_onboarding_fee: 0.00,
  broker_onboarding_fee: 50.00,
  persona_environment: 'sandbox',
  persona_api_key: '',
  persona_template_id: '',
};

export class SettingsService {
  /**
   * Retrieves all platform settings with fallback to defaults
   */
  static async getPlatformSettings(db: D1Database): Promise<PlatformSettings> {
    try {
      const rows = await db.prepare('SELECT key, value FROM platform_settings').all<{ key: string; value: string }>();
      const settingsMap: Record<string, string> = {};
      
      for (const row of rows.results || []) {
        settingsMap[row.key] = row.value;
      }

      return {
        paddle_environment: (settingsMap['paddle_environment'] === 'production' ? 'production' : 'sandbox'),
        paddle_vendor_id: settingsMap['paddle_vendor_id'] || DEFAULT_PLATFORM_SETTINGS.paddle_vendor_id,
        paddle_api_key: settingsMap['paddle_api_key'] || DEFAULT_PLATFORM_SETTINGS.paddle_api_key,
        paddle_client_token: settingsMap['paddle_client_token'] || DEFAULT_PLATFORM_SETTINGS.paddle_client_token,
        paddle_webhook_secret: settingsMap['paddle_webhook_secret'] || DEFAULT_PLATFORM_SETTINGS.paddle_webhook_secret,
        platform_fee_percent: parseFloat(settingsMap['platform_fee_percent'] ?? `${DEFAULT_PLATFORM_SETTINGS.platform_fee_percent}`),
        carrier_onboarding_fee: parseFloat(settingsMap['carrier_onboarding_fee'] ?? `${DEFAULT_PLATFORM_SETTINGS.carrier_onboarding_fee}`),
        shipper_onboarding_fee: parseFloat(settingsMap['shipper_onboarding_fee'] ?? `${DEFAULT_PLATFORM_SETTINGS.shipper_onboarding_fee}`),
        broker_onboarding_fee: parseFloat(settingsMap['broker_onboarding_fee'] ?? `${DEFAULT_PLATFORM_SETTINGS.broker_onboarding_fee}`),
        persona_environment: (settingsMap['persona_environment'] === 'production' ? 'production' : 'sandbox'),
        persona_api_key: settingsMap['persona_api_key'] || DEFAULT_PLATFORM_SETTINGS.persona_api_key,
        persona_template_id: settingsMap['persona_template_id'] || DEFAULT_PLATFORM_SETTINGS.persona_template_id,
      };
    } catch (error) {
      console.warn('Could not read platform_settings table, using defaults:', error);
      return { ...DEFAULT_PLATFORM_SETTINGS };
    }
  }

  /**
   * Updates multiple platform settings in D1
   */
  static async updatePlatformSettings(
    db: D1Database,
    updates: Partial<Record<string, string | number>>
  ): Promise<PlatformSettings> {
    // Ensure table exists
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS platform_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        description TEXT,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `).run().catch(() => {});

    const stmts: D1PreparedStatement[] = [];

    for (const [key, val] of Object.entries(updates)) {
      if (val !== undefined && val !== null) {
        const strVal = String(val).trim();
        stmts.push(
          db.prepare(`
            INSERT INTO platform_settings (key, value, updated_at)
            VALUES (?, ?, datetime('now'))
            ON CONFLICT(key) DO UPDATE SET 
              value = excluded.value, 
              updated_at = datetime('now')
          `).bind(key, strVal)
        );
      }
    }

    if (stmts.length > 0) {
      await db.batch(stmts);
    }

    return await this.getPlatformSettings(db);
  }

  /**
   * Get a single setting key
   */
  static async getSetting(db: D1Database, key: string, defaultValue: string = ''): Promise<string> {
    try {
      const row = await db.prepare('SELECT value FROM platform_settings WHERE key = ?').bind(key).first<{ value: string }>();
      return row?.value ?? defaultValue;
    } catch {
      return defaultValue;
    }
  }
}
