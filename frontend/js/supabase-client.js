/* ============================================================
   SUPABASE CLIENT — AI UniPod Lagos
   Backend integration with Supabase
   ============================================================ */

// Configuration - Replace with your Supabase credentials
// Get these from: https://supabase.com/dashboard/project/_/settings/api
const SUPABASE_URL = 'https://your-project.supabase.co';  // Replace with your Project URL
const SUPABASE_ANON_KEY = 'your-anon-key-here';  // Replace with your anon/public key

// Initialize Supabase client
let supabase = null;

try {
  if (window.supabase && SUPABASE_URL !== 'https://your-project.supabase.co') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase client initialized successfully');
  } else {
    console.warn('⚠️ Supabase not configured. Please update SUPABASE_URL and SUPABASE_ANON_KEY in js/supabase-client.js');
    console.warn('📖 See SUPABASE_SETUP.md for setup instructions');
  }
} catch (error) {
  console.error('❌ Failed to initialize Supabase:', error);
}

// ─── API WRAPPER ─────────────────────────────────────────────
const SupabaseAPI = {
  /**
   * Get records from a table
   * @param {string} table - Table name
   * @param {object} options - Query options
   * @returns {Promise<{data: Array, total: number}>}
   */
  async get(table, options = {}) {
    if (!supabase) {
      throw new Error('Supabase not initialized. Please configure your credentials in js/supabase-client.js');
    }

    try {
      const {
        limit = 100,
        offset = 0,
        sort = '-created_at',
        filter = {},
        published = null
      } = options;

      let query = supabase.from(table).select('*', { count: 'exact' });

      // Apply published filter
      if (published !== null) {
        query = query.eq('published', published);
      }

      // Apply custom filters
      Object.entries(filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      // Apply sorting
      if (sort) {
        const desc = sort.startsWith('-');
        const field = desc ? sort.slice(1) : sort;
        query = query.order(field, { ascending: !desc });
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error(`Supabase error fetching ${table}:`, error);
        throw error;
      }

      console.log(`✅ Fetched ${data?.length || 0} records from ${table}`);

      return {
        data: data || [],
        total: count || 0,
        limit,
        offset
      };
    } catch (error) {
      console.error(`Error fetching ${table}:`, error);
      throw error;
    }
  },

  /**
   * Get a single record by ID
   * @param {string} table - Table name
   * @param {string} id - Record ID
   * @returns {Promise<object>}
   */
  async getOne(table, id) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching ${table}/${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new record
   * @param {string} table - Table name
   * @param {object} data - Record data
   * @returns {Promise<object>}
   */
  async post(table, data) {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert([{ ...data, created_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error creating ${table} record:`, error);
      throw error;
    }
  },

  /**
   * Update a record
   * @param {string} table - Table name
   * @param {string} id - Record ID
   * @param {object} data - Updated data
   * @returns {Promise<object>}
   */
  async put(table, id, data) {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error updating ${table}/${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a record
   * @param {string} table - Table name
   * @param {string} id - Record ID
   * @returns {Promise<boolean>}
   */
  async delete(table, id) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting ${table}/${id}:`, error);
      throw error;
    }
  },

  /**
   * Upload file to Supabase Storage
   * @param {File} file - File to upload
   * @param {string} bucket - Storage bucket name
   * @param {string} path - File path in bucket
   * @returns {Promise<string>} - Public URL of uploaded file
   */
  async uploadFile(file, bucket = 'unipod-media', path = null) {
    try {
      const fileName = path || `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  /**
   * Sign in with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object>}
   */
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  /**
   * Sign out
   * @returns {Promise<void>}
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  /**
   * Get current user
   * @returns {Promise<object|null>}
   */
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    const user = await this.getCurrentUser();
    return !!user;
  }
};

// Export for use in other files
window.SupabaseAPI = SupabaseAPI;

// Set as global API (will be used by all pages)
if (supabase) {
  window.API = SupabaseAPI;
  console.log('✅ Supabase API ready for use');
} else {
  console.warn('⚠️ Supabase not configured - falling back to MockAPI if available');
  // MockAPI will be used if loaded before this script
}

// ─── REALTIME SUBSCRIPTIONS ──────────────────────────────────
const RealtimeManager = {
  subscriptions: {},

  /**
   * Subscribe to table changes
   * @param {string} table - Table name
   * @param {function} callback - Callback function
   * @param {string} event - Event type (INSERT, UPDATE, DELETE, *)
   */
  subscribe(table, callback, event = '*') {
    const channel = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', {
        event,
        schema: 'public',
        table
      }, callback)
      .subscribe();

    this.subscriptions[table] = channel;
    return channel;
  },

  /**
   * Unsubscribe from table changes
   * @param {string} table - Table name
   */
  unsubscribe(table) {
    if (this.subscriptions[table]) {
      supabase.removeChannel(this.subscriptions[table]);
      delete this.subscriptions[table];
    }
  },

  /**
   * Unsubscribe from all channels
   */
  unsubscribeAll() {
    Object.keys(this.subscriptions).forEach(table => {
      this.unsubscribe(table);
    });
  }
};

window.RealtimeManager = RealtimeManager;

// ─── AUTH STATE LISTENER ─────────────────────────────────────
if (supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session?.user?.email);
    
    // Dispatch custom event for auth changes
    window.dispatchEvent(new CustomEvent('authStateChange', {
      detail: { event, session }
    }));
  });
}

console.log('📦 Supabase client module loaded');
console.log('📖 Need help? Check SUPABASE_SETUP.md for setup instructions');
