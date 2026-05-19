import { supabase } from '../config/database.js';

export class DonationRequest {
  static async create(requestData) {
    const { data, error } = await supabase
      .from('donation_requests')
      .insert([{
        hospital_id: requestData.hospital_id,
        request_type: requestData.request_type,
        blood_group: requestData.blood_group,
        rh_factor: requestData.rh_factor,
        organ_type: requestData.organ_type,
        urgency_level: requestData.urgency_level,
        quantity: requestData.quantity,
        unit: requestData.unit || 'units',
        deadline: requestData.deadline,
        description: requestData.description,
        status: 'active',
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('donation_requests')
      .select('*, hospitals(*, users(*))')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id, updateData) {
    const { data, error } = await supabase
      .from('donation_requests')
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

  static async delete(id) {
    const { error } = await supabase
      .from('donation_requests')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  static async list(filters = {}) {
    let query = supabase
      .from('donation_requests')
      .select('*, hospitals(*, users(*))')
      .order('created_at', { ascending: false });

    if (filters.hospital_id) {
      query = query.eq('hospital_id', filters.hospital_id);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.request_type) {
      query = query.eq('request_type', filters.request_type);
    }

    if (filters.blood_group) {
      query = query.eq('blood_group', filters.blood_group);
    }

    if (filters.urgency_level) {
      query = query.eq('urgency_level', filters.urgency_level);
    }

    if (filters.city) {
      query = query.eq('hospitals.city', filters.city);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getActiveRequests() {
    const { data, error } = await supabase
      .from('donation_requests')
      .select('*, hospitals(*, users(*))')
      .eq('status', 'active')
      .gt('deadline', new Date().toISOString())
      .order('urgency_level', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getResponses(requestId) {
    const { data, error } = await supabase
      .from('donor_responses')
      .select('*, donors(*, users(*))')
      .eq('request_id', requestId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('donation_requests')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUrgentRequests() {
    const { data, error } = await supabase
      .from('donation_requests')
      .select('*, hospitals(*, users(*))')
      .eq('status', 'active')
      .in('urgency_level', ['critical', 'high'])
      .gt('deadline', new Date().toISOString())
      .order('deadline', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async getExpiredRequests() {
    const { data, error } = await supabase
      .from('donation_requests')
      .select('*, hospitals(*, users(*))')
      .eq('status', 'active')
      .lt('deadline', new Date().toISOString())
      .order('deadline', { ascending: true });

    if (error) throw error;
    return data;
  }
}

export default DonationRequest;
