// Dynamic config loader - Returns config based on environment
import { config as prodConfig } from './config.js';

export async function getConfig() {
  if (process.env.NODE_ENV === 'development') {
    try {
      const { config: localConfig } = await import('./config.local.js');
      console.log('Using local config');
      return localConfig;
    } catch {
      console.log('Local config not found, using production config');
      return prodConfig;
    }
  } else {
    console.log('Using production config');
    return prodConfig;
  }
}

export default prodConfig; // Fallback for synchronous access