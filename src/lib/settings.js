// lib/settings.js
import { prisma } from "@/lib/prisma";

/**
 * Get a single setting by key
 * @param {string} key - Setting key
 * @param {any} defaultValue - Default value if setting not found
 * @returns {Promise<any>} Setting value
 */
export async function getSetting(key, defaultValue = null) {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key },
    });

    if (!setting) {
      return defaultValue;
    }

    // Parse value based on type
    switch (setting.type) {
      case "NUMBER":
        return parseFloat(setting.value);
      case "BOOLEAN":
        return setting.value === "true";
      case "JSON":
        try {
          return JSON.parse(setting.value);
        } catch (e) {
          console.error(`Failed to parse JSON for key: ${key}`);
          return defaultValue;
        }
      default:
        return setting.value;
    }
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Get multiple settings
 * @param {string[]} keys - Array of setting keys
 * @returns {Promise<object>} Object with key-value pairs
 */
export async function getSettings(keys) {
  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: keys,
        },
      },
    });

    return settings.reduce((acc, setting) => {
      let value = setting.value;

      switch (setting.type) {
        case "NUMBER":
          value = parseFloat(value);
          break;
        case "BOOLEAN":
          value = value === "true";
          break;
        case "JSON":
          try {
            value = JSON.parse(value);
          } catch (e) {
            console.error(`Failed to parse JSON for key: ${setting.key}`);
          }
          break;
      }

      acc[setting.key] = value;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {};
  }
}

/**
 * Get all settings
 * @returns {Promise<object>} Object with all settings
 */
export async function getAllSettings() {
  try {
    const settings = await prisma.setting.findMany();

    return settings.reduce((acc, setting) => {
      let value = setting.value;

      switch (setting.type) {
        case "NUMBER":
          value = parseFloat(value);
          break;
        case "BOOLEAN":
          value = value === "true";
          break;
        case "JSON":
          try {
            value = JSON.parse(value);
          } catch (e) {
            console.error(`Failed to parse JSON for key: ${setting.key}`);
          }
          break;
      }

      acc[setting.key] = value;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching all settings:", error);
    return {};
  }
}

/**
 * Update or create a setting
 * @param {string} key - Setting key
 * @param {any} value - Setting value
 * @param {string} type - Setting type (STRING, NUMBER, BOOLEAN, JSON)
 * @param {string} description - Setting description
 * @returns {Promise<object>} Updated setting
 */
export async function updateSetting(key, value, type = "STRING", description = null) {
  try {
    // Convert value to string
    let stringValue;
    switch (type) {
      case "NUMBER":
        stringValue = String(value);
        break;
      case "BOOLEAN":
        stringValue = String(value);
        break;
      case "JSON":
        stringValue = JSON.stringify(value);
        break;
      default:
        stringValue = String(value);
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: {
        value: stringValue,
        type,
        ...(description && { description }),
      },
      create: {
        key,
        value: stringValue,
        type,
        description,
      },
    });

    return setting;
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    throw error;
  }
}

/**
 * Delete a setting
 * @param {string} key - Setting key
 * @returns {Promise<boolean>} Success status
 */
export async function deleteSetting(key) {
  try {
    await prisma.setting.delete({
      where: { key },
    });
    return true;
  } catch (error) {
    console.error(`Error deleting setting ${key}:`, error);
    return false;
  }
}

// Example usage in other files:
//
// import { getSetting, getSettings, getAllSettings } from '@/lib/settings';
//
// // Get single setting
// const commissionRate = await getSetting('affiliateCommissionRate', 5);
//
// // Get multiple settings
// const settings = await getSettings(['businessName', 'businessEmail']);
//
// // Get all settings
// const allSettings = await getAllSettings();
