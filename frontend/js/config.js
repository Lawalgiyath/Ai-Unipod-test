/* ============================================================
   CONFIGURATION — AI UniPod Lagos
   Central configuration file
   ============================================================ */

'use strict';

// ─── SUPABASE CONFIGURATION ──────────────────────────────────
// Get these values from: https://supabase.com/dashboard/project/_/settings/api
const CONFIG = {
  supabase: {
    url: 'https://your-project.supabase.co',  // Replace with your Project URL
    anonKey: 'your-anon-key-here'  // Replace with your anon/public key
  },
  
  // Site settings
  site: {
    name: 'AI UniPod Lagos',
    tagline: 'UNILAG × UNDP Timbuktoo Initiative',
    email: 'info@unipod.unilag.edu.ng',
    phone: '+234 XXX XXX XXXX',
    address: 'University of Lagos, Akoka Campus, Lagos, Nigeria'
  },
  
  // Feature flags
  features: {
    useMockData: true,  // Set to false when Supabase is configured
    enableRealtime: true,
    enableFileUploads: true,
    enableAuth: true
  },
  
  // API settings
  api: {
    defaultLimit: 100,
    cacheTimeout: 5 * 60 * 1000  // 5 minutes
  }
};

// Check if Supabase is configured
CONFIG.isSupabaseConfigured = () => {
  return CONFIG.supabase.url !== 'https://your-project.supabase.co' 
    && CONFIG.supabase.anonKey !== 'your-anon-key-here';
};

// Export configuration
window.CONFIG = CONFIG;

console.log('⚙️ Configuration loaded');
console.log('📊 Using mock data:', CONFIG.features.useMockData);
console.log('🔧 Supabase configured:', CONFIG.isSupabaseConfigured());

if (!CONFIG.isSupabaseConfigured() && !CONFIG.features.useMockData) {
  console.warn('⚠️ WARNING: Supabase not configured and mock data is disabled!');
  console.warn('📖 Please see SUPABASE_SETUP.md for setup instructions');
}
