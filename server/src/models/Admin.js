import { supabase } from '../config/database.js';

export class Admin {
  static async create(adminData) {
    const { data, error } = await supabase
      .from('admins')
      .insert([{
        user_id: adminData.user_id,
        department: adminData.department,
        permissions: adminData.permissions || [],
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('admins')
      .select('*, users(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id, updateData) {
    const { data, error } = await supabase
      .from('admins')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async list() {
    const { data, error } = await supabase
      .from('admins')
      .select('*, users(*)');

    if (error) throw error;
    return data;
  }

  static async getDashboardStats() {
    const [usersCount, hospitalsCount, donorsCount, requestsCount, responsesCount] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('hospitals').select('id', { count: 'exact', head: true }),
      supabase.from('donors').select('id', { count: 'exact', head: true }),
      supabase.from('donation_requests').select('id', { count: 'exact', head: true }),
      supabase.from('donor_responses').select('id', { count: 'exact', head: true }),
    ]);

    return {
      users: usersCount.count || 0,
      hospitals: hospitalsCount.count || 0,
      donors: donorsCount.count || 0,
      donationRequests: requestsCount.count || 0,
      donorResponses: responsesCount.count || 0,
    };
  }

  static async getRecentActivity(limit = 10) {
    const [recentUsers, recentRequests, recentResponses] = await Promise.all([
      supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit),
      supabase
        .from('donation_requests')
        .select('*, hospitals(*, users(*))')
        .order('created_at', { ascending: false })
        .limit(limit),
      supabase
        .from('donor_responses')
        .select('*, donors(*, users(*)), donation_requests(*)')
        .order('created_at', { ascending: false })
        .limit(limit),
    ]);

    return {
      users: recentUsers.data || [],
      donationRequests: recentRequests.data || [],
      donorResponses: recentResponses.data || [],
    };
  }
}

export default Admin;
