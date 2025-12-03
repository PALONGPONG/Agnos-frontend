import React from 'react'
import { PatientData } from '../type/formtype'
function Modal({ patientData, onClose }: { patientData: PatientData; onClose?: () => void }) {
  const handleClose = onClose ?? (() => undefined)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 text-gray-900">
      <div className="relative w-full max-w-xl rounded-xl bg-white p-8 shadow-2xl">
      
        <h1 className="mb-4 text-2xl font-semibold text-center">Patient Details</h1>
        <div className="space-y-4 text-sm">
          <section className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <h2 className="col-span-full text-xs font-semibold uppercase tracking-wide text-slate-600">Personal</h2>
            <p><strong>First Name:</strong> {patientData.firstName}</p>
            <p><strong>Middle Name:</strong> {patientData.middleName}</p>
            <p><strong>Last Name:</strong> {patientData.lastName}</p>
            <p><strong>Date of Birth:</strong> {patientData.dateOfBirth}</p>
            <p><strong>Gender:</strong> {patientData.gender}</p>
            <p><strong>Nationality:</strong> {patientData.nationality}</p>
            <p><strong>Religion:</strong> {patientData.religion}</p>
            <p><strong>Preferred Language:</strong> {patientData.preferredLanguage}</p>
          </section>

          <section className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <h2 className="col-span-full text-xs font-semibold uppercase tracking-wide text-slate-600">Contact</h2>
            <p><strong>Phone Number:</strong> {patientData.phoneNumber}</p>
            <p><strong>Email:</strong> {patientData.email}</p>
            <p className="sm:col-span-2"><strong>Address:</strong> {patientData.address}</p>
          </section>

          <section className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <h2 className="col-span-full text-xs font-semibold uppercase tracking-wide text-slate-600">Emergency Contact</h2>
            <p><strong>Name:</strong> {patientData.emergencyContactName}</p>
            <p><strong>Relationship:</strong> {patientData.emergencyContactRelationship}</p>
          </section>

          <section className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <h2 className="col-span-full text-xs font-semibold uppercase tracking-wide text-slate-600">Status</h2>
            <p><strong>Status:</strong> {patientData.status}</p>
          </section>
        </div>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute right-3 top-3 rounded-full p-2 text-slate-500 transition bg-red-100 hover:bg-red-200 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center"
        >
          <span>Close</span>
        </button>
      </div>
    </div>
  )
}

export default Modal
