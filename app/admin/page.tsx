'use client'

import { useEffect, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import {
  EMPTY_PATIENT_DATA,
  type ClientToServerEvents,
  type PatientData,
  type ServerToClientEvents,
} from '../type/formtype'
import Modal from '../component/modal'
import { SOCKET_URL } from '../lib/socket'


type ConnectionState = 'connecting' | 'live' | 'offline'

function AdminPage() {

  const [patientData, setPatientData] = useState<PatientData>(EMPTY_PATIENT_DATA)
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting')
  const [lastUpdate, setLastUpdate] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_URL, {
      transports: ['websocket'],
    })

    socket.on('connect', () => setConnectionState('live'))
    socket.on('disconnect', () => setConnectionState('offline'))
    socket.on('staff:update', (data) => {
      setPatientData(data)
      setLastUpdate(Date.now())
    })
      
    return () => {
      socket.disconnect()
    }
  }, [])
   
  useEffect(() => {
    if (patientData.status === 'submitted') {
      setShowModal(true)
    }
  }, [patientData.status])

  const lastUpdateText = lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'No updates yet'

  return (
    <div>
      {showModal && (
        <Modal patientData={patientData} onClose={() => setShowModal(false)} />
      )}
    <main className="mx-auto my-6 max-w-5xl rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
        
          <h1 className="text-2xl font-semibold text-slate-900">Patient Dashboard</h1>
          <p className="text-sm text-slate-600">Status: <span className="font-semibold">{patientData.status}</span></p>
          <p className="text-sm text-slate-600">Connection: <span className="font-semibold">{connectionState}</span></p>
        </div>
     
      </header>

      <form className="space-y-6" noValidate>
        <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Personal details</h2>
              <p className="text-sm text-slate-600">Basic identification information</p>
            </div>
            <span className="text-xs text-slate-500">Required fields marked *</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={patientData.firstName}
                readOnly
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="middleName" className="text-sm font-medium text-slate-700">
                Middle Name (optional)
              </label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                value={patientData.middleName}
                readOnly
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={patientData.lastName}
                readOnly
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
       
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Demographics</h2>
              <p className="text-sm text-slate-600">Background details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="dateOfBirth" className="text-sm font-medium text-slate-700">
                Date of Birth *
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={patientData.dateOfBirth}
                readOnly
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
         
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="gender" className="text-sm font-medium text-slate-700">
                Gender *
              </label>
              <input
                type="text"
                id="gender"
                name="gender"
                value={patientData.gender
                }
                readOnly
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
          
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nationality" className="text-sm font-medium text-slate-700">
                Nationality *
              </label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                value={patientData.nationality}
                readOnly
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
             
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="religion" className="text-sm font-medium text-slate-700">
                Religion (optional)
              </label>
              <input
                type="text"
                id="religion"
                name="religion"
                value={patientData.religion}
                readOnly
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="flex flex-col gap-1.5 lg:col-span-2">
              <label htmlFor="preferredLanguage" className="text-sm font-medium text-slate-700">
                Preferred Language *
              </label>
              <input
                type="text"
                id="preferredLanguage"
                name="preferredLanguage"
                value={patientData.preferredLanguage}
                readOnly
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
              <p className="text-sm text-slate-600">Reachable details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phoneNumber" className="text-sm font-medium text-slate-700">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={patientData.phoneNumber}
                readOnly
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={patientData.email}
                readOnly
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="address" className="text-sm font-medium text-slate-700">
                Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={patientData.address}
                readOnly
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Emergency Contact</h2>
              <p className="text-sm text-slate-600">Optional but recommended</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="emergencyContactName" className="text-sm font-medium text-slate-700">
                Contact Name
              </label>
              <input
                type="text"
                id="emergencyContactName"
                name="emergencyContactName"
                value={patientData.emergencyContactName}
                readOnly
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="emergencyContactRelationship"
                className="text-sm font-medium text-slate-700"
              >
                Relationship
              </label>
              <input
                type="text"
                id="emergencyContactRelationship"
                name="emergencyContactRelationship"
                value={patientData.emergencyContactRelationship}
                readOnly
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </section>
      </form>
     
    </main>
    </div>
  )
}

export default AdminPage
