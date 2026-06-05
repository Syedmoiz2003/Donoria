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
      .eq('user_id', userId);

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
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
       .select('*, users(*)')
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
    // First, get all request IDs belonging to this hospital
    const { data: requests, error: reqError } = await supabase
      .from('donation_requests')
      .select('id')
      .eq('hospital_id', hospitalId);

    if (reqError) throw reqError;
    if (!requests || requests.length === 0) return [];

    const requestIds = requests.map(r => r.id);

    // Then, get responses for those requests
    const { data, error } = await supabase
      .from('donor_responses')
      .select('*, donors(*, users(*)), donation_requests(*)')
      .in('request_id', requestIds)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}

export default Hospital;
