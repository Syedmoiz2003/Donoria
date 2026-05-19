import { supabase } from '../config/database.js';

export class DonorResponse {
  static async create(responseData) {
    const { data, error } = await supabase
      .from('donor_responses')
      .insert([{
        donor_id: responseData.donor_id,
        request_id: responseData.request_id,
        compatibility_score: responseData.compatibility_score || 0,
        status: 'pending',
        message: responseData.message,
        estimated_arrival: responseData.estimated_arrival,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('donor_responses')
      .select('*, donors(*, users(*)), donation_requests(*, hospitals(*, users(*)))')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id, updateData) {
    const { data, error } = await supabase
      .from('donor_responses')
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

  static async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('donor_responses')
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

  static async delete(id) {
    const { error } = await supabase
      .from('donor_responses')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  static async list(filters = {}) {
    let query = supabase
      .from('donor_responses')
      .select('*, donors(*, users(*)), donation_requests(*, hospitals(*, users(*)))')
      .order('created_at', { ascending: false });

    if (filters.donor_id) {
      query = query.eq('donor_id', filters.donor_id);
    }

    if (filters.request_id) {
      query = query.eq('request_id', filters.request_id);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getByDonor(donorId) {
    const { data, error } = await supabase
      .from('donor_responses')
      .select('*, donation_requests(*, hospitals(*, users(*)))')
      .eq('donor_id', donorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getByRequest(requestId) {
    const { data, error } = await supabase
      .from('donor_responses')
      .select('*, donors(*, users(*))')
      .eq('request_id', requestId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async acceptResponse(id) {
    const response = await this.findById(id);
    
    await this.updateStatus(id, 'accepted');
    
    await supabase
      .from('donor_responses')
      .update({ status: 'rejected' })
      .eq('request_id', response.request_id)
      .neq('id', id);

    return await this.findById(id);
  }

  static async completeResponse(id) {
    return await this.updateStatus(id, 'completed');
  }

  static async rejectResponse(id) {
    return await this.updateStatus(id, 'rejected');
  }

  static async cancelResponse(id) {
    return await this.updateStatus(id, 'cancelled');
  }
}

export default DonorResponse;
