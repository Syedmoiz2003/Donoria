import { supabase } from '../config/database.js';

export class VerificationDocument {
  static async create(documentData) {
    const { data, error } = await supabase
      .from('verification_documents')
      .insert([{
        hospital_id: documentData.hospital_id || null,
        donor_id: documentData.donor_id || null,
        response_id: documentData.response_id || null,
        document_type: documentData.document_type,
        document_name: documentData.document_name,
        file_url: documentData.file_url,
        file_size: documentData.file_size,
        mime_type: documentData.mime_type,
        uploaded_at: new Date().toISOString(),
        status: 'pending',
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('verification_documents')
      .select('*, hospitals(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id, updateData) {
    const { data, error } = await supabase
      .from('verification_documents')
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

  static async updateStatus(id, status, rejectionReason = null) {
    const updateData = { status };
    
    if (rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }

    const { data, error } = await supabase
      .from('verification_documents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('verification_documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  static async list(filters = {}) {
    let query = supabase
      .from('verification_documents')
      .select('*, hospitals(*, users(*))')
      .order('uploaded_at', { ascending: false });

    if (filters.hospital_id) {
      query = query.eq('hospital_id', filters.hospital_id);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.document_type) {
      query = query.eq('document_type', filters.document_type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getByHospital(hospitalId) {
    const { data, error } = await supabase
      .from('verification_documents')
      .select('*')
      .eq('hospital_id', hospitalId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getPendingDocuments() {
    const { data, error } = await supabase
      .from('verification_documents')
      .select('*, hospitals(*, users(*))')
      .eq('status', 'pending')
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}

export default VerificationDocument;
