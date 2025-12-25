import api from '../api';
import type {
  // History Taking
  HistoryTakingRequest,
  HistoryTakingResponse,
  // Preliminary Test
  PreliminaryTestRequest,
  PreliminaryTestResponse,
  // Visual Acuity
  VisualAcuityAssessmentRequest,
  VisualAcuityAssessmentResponse,
  // External Eye
  ExternalEyeExaminationRequest,
  ExternalEyeExaminationResponse,
  UploadAttachmentRequest,
  UploadAttachmentResponse,
  // Refraction
  RefractionAssessmentRequest,
  RefractionAssessmentResponse,
  // Case Submission
  CaseSubmissionRequest,
  CaseSubmissionResponse,
} from './type.assessments';

const AssessmentAPI = {
  // ============================================
  // History Taking
  // ============================================
  async getHistoryTaking(registrationId: number): Promise<HistoryTakingResponse> {
    const response = await api.get(`/assessment/history-taking/${registrationId}`);
    return response.data;
  },

  async createOrUpdateHistoryTaking(data: HistoryTakingRequest): Promise<HistoryTakingResponse> {
    const formData = new FormData();
    formData.append('registration_id', String(data.registration_id));
    formData.append('section_a', JSON.stringify(data.section_a));
    formData.append('section_b', JSON.stringify(data.section_b));

    const response = await api.post('/assessment/history-taking', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ============================================
  // Preliminary Test
  // ============================================
  async getPreliminaryTest(registrationId: number): Promise<PreliminaryTestResponse> {
    const response = await api.get(`/assessment/preliminary-test/${registrationId}`);
    return response.data;
  },

  async createOrUpdatePreliminaryTest(
    data: PreliminaryTestRequest
  ): Promise<PreliminaryTestResponse> {
    const formData = new FormData();
    formData.append('registration_id', String(data.registration_id));
    formData.append('section_a', JSON.stringify(data.section_a));
    formData.append('section_b', JSON.stringify(data.section_b));
    formData.append('section_c', JSON.stringify(data.section_c));

    const response = await api.post('/assessment/preliminary-test', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ============================================
  // Visual Acuity Assessment
  // ============================================
  async getVisualAcuityAssessment(registrationId: number): Promise<VisualAcuityAssessmentResponse> {
    const response = await api.get(`/assessment/visual-acuity-assessment/${registrationId}`);
    return response.data;
  },

  async createOrUpdateVisualAcuityAssessment(
    data: VisualAcuityAssessmentRequest
  ): Promise<VisualAcuityAssessmentResponse> {
    const formData = new FormData();
    formData.append('registration_id', String(data.registration_id));
    formData.append('description', JSON.stringify(data.description));

    const response = await api.post('/assessment/visual-acuity-assessment', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ============================================
  // External Eye Examination
  // ============================================
  async getExternalEyeExamination(
    registrationId: number
  ): Promise<ExternalEyeExaminationResponse> {
    const response = await api.get(`/assessment/external-eye-examination/${registrationId}`);
    return response.data;
  },

  async createOrUpdateExternalEyeExamination(
    data: ExternalEyeExaminationRequest
  ): Promise<ExternalEyeExaminationResponse> {
    const formData = new FormData();
    formData.append('registration_id', String(data.registration_id));
    formData.append('anterior', JSON.stringify(data.anterior));
    formData.append('fundus', JSON.stringify(data.fundus));

    const response = await api.post('/assessment/external-eye-examination', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async uploadExternalEyeAttachment(
    registrationId: number,
    data: UploadAttachmentRequest
  ): Promise<UploadAttachmentResponse> {
    const formData = new FormData();
    // React Native file upload format
    formData.append('file', {
      uri: data.file.uri,
      name: data.file.name,
      type: data.file.type,
    } as unknown as Blob);
    formData.append('type', data.type);

    const response = await api.post(
      `/assessment/external-eye-examination/${registrationId}/attachments`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  // ============================================
  // Refraction Assessment
  // ============================================
  async getRefractionAssessment(registrationId: number): Promise<RefractionAssessmentResponse> {
    const response = await api.get(`/assessment/refraction-assessment/${registrationId}`);
    return response.data;
  },

  async createOrUpdateRefractionAssessment(
    data: RefractionAssessmentRequest
  ): Promise<RefractionAssessmentResponse> {
    const formData = new FormData();
    formData.append('registration_id', String(data.registration_id));
    formData.append('description', JSON.stringify(data.description));

    const response = await api.post('/assessment/refraction-assessment', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ============================================
  // Case Submission
  // ============================================
  async getCaseSubmission(registrationId: number): Promise<CaseSubmissionResponse> {
    const response = await api.get(`/assessment/case-submission/${registrationId}`);
    return response.data;
  },

  async createOrUpdateCaseSubmission(
    data: CaseSubmissionRequest
  ): Promise<CaseSubmissionResponse> {
    const formData = new FormData();
    formData.append('registration_id', String(data.registration_id));
    formData.append('description', JSON.stringify(data.description));

    const response = await api.post('/assessment/case-submission', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default AssessmentAPI;
