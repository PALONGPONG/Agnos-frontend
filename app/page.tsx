'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import {
  EMPTY_PATIENT_DATA,
  type ClientToServerEvents,
  type PatientData,
  type PatientStatus,
  type ServerToClientEvents,
} from './type/formtype';
import { SOCKET_URL } from './lib/socket'

type FormProps = {
  initialValues?: Partial<PatientData>
}

const INACTIVITY_TIMEOUT = 5000


const buildInitialState = (initialValues: Partial<PatientData> = {}): PatientData =>
  ({
    ...EMPTY_PATIENT_DATA,
    ...initialValues,
    status: initialValues.status ?? 'inactive',
  } as PatientData)

function Form({ initialValues }: FormProps) {
  const [formData, setFormData] = useState<PatientData>(buildInitialState(initialValues))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [connectionState, setConnectionState] = useState<'connecting' | 'live' | 'offline'>(
    'connecting'
  )
  const [lastInteraction, setLastInteraction] = useState<number>(() => Date.now())
  const socketRef =
    useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)
  const latestDataRef = useRef<PatientData>(formData)

  useEffect(() => {
    latestDataRef.current = formData
  }, [formData])

  const sendpayload = useCallback((payload: PatientData) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('patient:update', payload)
    }
  }, [])

  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_URL, {
      transports: ['websocket'],
    })
    socketRef.current = socket

    socket.on('connect', () => {
      setConnectionState('live')
      sendpayload(latestDataRef.current)
    })
    socket.on('disconnect', () => setConnectionState('offline'))

    return () => {
      socket.disconnect()
    }
  }, [sendpayload])

  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceInteraction = Date.now() - lastInteraction
      if (
        latestDataRef.current.status !== 'submitted' &&
        timeSinceInteraction > INACTIVITY_TIMEOUT &&
        latestDataRef.current.status !== 'inactive'
      ) {
        const inactivePayload = { ...latestDataRef.current, status: 'inactive' as PatientStatus }
        latestDataRef.current = inactivePayload
        setFormData(inactivePayload)
        sendpayload(inactivePayload)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [sendpayload, lastInteraction])

  const validatePhone = (phone: string) => {
    const phonePattern = /^\+?\d{8,15}$/
    return phonePattern.test(phone.replace(/[\s-]/g, ''))
  }

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updated: PatientData = { ...prev, [name]: value, status: 'filling' }
      latestDataRef.current = updated
      setLastInteraction(Date.now())
      sendpayload(updated)
      return updated
    })

    if (errors[name]) {
      setErrors((prev) => {
        const updatedErrors = { ...prev }
        delete updatedErrors[name]
        return updatedErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const requiredFields: (keyof PatientData)[] = [
      'firstName',
      'lastName',
      'dateOfBirth',
      'gender',
      'nationality',
      'preferredLanguage',
      'phoneNumber',
      'email',
      'address',
    ]

    const newErrors: Record<string, string> = {}
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required'
      }
    })

    if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number'
    }
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      const submittedPayload: PatientData = {
        ...formData,
        status: 'submitted',
      }
      setFormData(submittedPayload)
      await sendpayload(submittedPayload)
      alert('Form submitted successfully!')
    }
  }



  return (
    <main className="mx-auto my-6 max-w-5xl rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
        
          <h1 className="text-2xl font-semibold text-slate-900">Patient form</h1>
          <p className="text-sm text-slate-600">Connection status: <span className="font-semibold">{connectionState}</span></p>
     
        </div>
     
      </header>

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
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
                value={formData.firstName}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {errors.firstName && <p className="text-xs text-red-600">{errors.firstName}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="middleName" className="text-sm font-medium text-slate-700">
                Middle Name (optional)
              </label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
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
                value={formData.lastName}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {errors.lastName && <p className="text-xs text-red-600">{errors.lastName}</p>}
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
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {errors.dateOfBirth && <p className="text-xs text-red-600">{errors.dateOfBirth}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="gender" className="text-sm font-medium text-slate-700">
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="text-xs text-red-600">{errors.gender}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nationality" className="text-sm font-medium text-slate-700">
                Nationality *
              </label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {errors.nationality && <p className="text-xs text-red-600">{errors.nationality}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="religion" className="text-sm font-medium text-slate-700">
                Religion (optional)
              </label>
              <input
                type="text"
                id="religion"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
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
                value={formData.preferredLanguage}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {errors.preferredLanguage && (
                <p className="text-xs text-red-600">{errors.preferredLanguage}</p>
              )}
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
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {errors.phoneNumber && <p className="text-xs text-red-600">{errors.phoneNumber}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="address" className="text-sm font-medium text-slate-700">
                Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {errors.address && <p className="text-xs text-red-600">{errors.address}</p>}
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
                value={formData.emergencyContactName}
                onChange={handleChange}
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
                value={formData.emergencyContactRelationship}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Your progress is mirrored to the staff dashboard instantly. Submit when you are ready.
          </p>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            Submit form
          </button>
        </div>
      </form>
    </main>
  )
}

export default Form
