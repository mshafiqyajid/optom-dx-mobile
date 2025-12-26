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
    const response = await api.post('/assessment/history-taking', {
      registration_id: data.registration_id,
      section_a: data.section_a,
      section_b: data.section_b,
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
    const response = await api.post('/assessment/preliminary-test', {
      registration_id: data.registration_id,
      section_a: data.section_a,
      section_b: data.section_b,
      section_c: data.section_c,
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
    const response = await api.post('/assessment/visual-acuity-assessment', {
      registration_id: data.registration_id,
      description: data.description,
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
    const response = await api.post('/assessment/external-eye-examination', {
      registration_id: data.registration_id,
      anterior: data.anterior,
      fundus: data.fundus,
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
    const response = await api.post('/assessment/refraction-assessment', {
      registration_id: data.registration_id,
      description: data.description,
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
    const response = await api.post('/assessment/case-submission', {
      registration_id: data.registration_id,
      description: data.description,
    });
    return response.data;
  },
};

export default AssessmentAPI;
