export type PatientStatus = 'filling' | 'submitted' | 'inactive'

export interface PatientData {
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  gender: string
  nationality: string
  religion: string
  preferredLanguage: string
  phoneNumber: string
  email: string
  address: string
  emergencyContactName: string
  emergencyContactRelationship: string
  status: PatientStatus
}

export interface ServerToClientEvents {
  'staff:update': (data: PatientData) => void
}

export interface ClientToServerEvents {
  'patient:update': (data: PatientData) => void
}

export const EMPTY_PATIENT_DATA: PatientData = {
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  nationality: '',
  religion: '',
  preferredLanguage: '',
  phoneNumber: '',
  email: '',
  address: '',
  emergencyContactName: '',
  emergencyContactRelationship: '',
  status: 'inactive',
}
