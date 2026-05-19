import { supabase } from '../config/database.js';

export class Hospital {
  static async create(hospitalData) {
    const { data, error } = await supabase
      .from('hospitals')
      .insert([{
        user_id: hospitalData.user_id,
        hospital_name: hospitalData.hospital_name,
        license_number: hospitalData.license_number,
        address: hospitalData.address,
        city: hospitalData.city,
        state: hospitalData.state,
        zip_code: hospitalData.zip_code,
        latitude: hospitalData.latitude,
        longitude: hospitalData.longitude,
        contact_person: hospitalData.contact_person,
        emergency_contact: hospitalData.emergency_contact,
        is_verified: false,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*, users(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id, updateData) {
    const { data, error } = await supabase
      .from('hospitals')
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

  static async verify(id) {
    const { data, error } = await supabase
      .from('hospitals')
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async list(filters = {}) {
    let query = supabase.from('hospitals').select('*, users(*)');

    if (filters.is_verified !== undefined) {
      query = query.eq('is_verified', filters.is_verified);
    }

    if (filters.city) {
      query = query.eq('city', filters.city);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getDonationRequests(hospitalId) {
    const { data, error } = await supabase
      .from('donation_requests')
      .select('*')
      .eq('hospital_id', hospitalId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getResponses(hospitalId) {
    const { data, error } = await supabase
      .from('donor_responses')
      .select('*, donors(*), donation_requests(*)')
      .eq('donation_requests.hospital_id', hospitalId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}

export default Hospital;
