import { supabase } from '../config/database.js';

const VALID_LANGUAGES = ['en', 'ur'];

export class User {
  static validateLanguage(language) {
    if (!language) return 'en'; // Default to English
    if (!VALID_LANGUAGES.includes(language)) {
      throw new Error(`Invalid language. Only English (en) and Urdu (ur) are supported.`);
    }
    return language;
  }

  static async create(userData) {
    const preferredLanguage = this.validateLanguage(userData.preferred_language);

    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: userData.email,
        password: userData.password,
        full_name: userData.full_name,
        phone: userData.phone,
        role: userData.role,
        preferred_language: preferredLanguage,
        is_active: true,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async update(id, updateData) {
    const updateFields = { ...updateData, updated_at: new Date().toISOString() };
    
    if (updateData.preferred_language) {
      updateFields.preferred_language = this.validateLanguage(updateData.preferred_language);
    }

    const { data, error } = await supabase
      .from('users')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  static async list(filters = {}) {
    let query = supabase.from('users').select('*');

    if (filters.role) {
      query = query.eq('role', filters.role);
    }

    if (filters.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async updateLastLogin(id) {
    const { error } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

export default User;
