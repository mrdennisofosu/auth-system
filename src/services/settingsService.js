import { delay } from '../mock/delay'
import { mockSettings } from '../mock/mockSettings'
import { recordActivity } from '../mock/mockActivity'
import { ACTIVITY_TYPE } from '../constants/activity'

// MOCK SERVICE for system settings.
// getPublicSettings = the few settings any visitor's browser needs (a real backend
// exposes these on a public endpoint). getSettings / updateSettings = administrators only.

const clone = (value) => JSON.parse(JSON.stringify(value))

export async function getPublicSettings() {
  await delay(200)
  return { publicRegistrationEnabled: mockSettings.registration.publicRegistrationEnabled }
}

export async function getSettings() {
  await delay(400)
  return clone(mockSettings)
}

// Input: { general, registration, security, session }
export async function updateSettings(newSettings, actor) {
  await delay(800)

  const registrationChanged =
    newSettings.registration.publicRegistrationEnabled !==
    mockSettings.registration.publicRegistrationEnabled

  mockSettings.general = { ...newSettings.general }
  mockSettings.registration = { ...newSettings.registration }
  mockSettings.security = { ...newSettings.security }
  mockSettings.session = { ...newSettings.session }

  const registrationText = registrationChanged
    ? `${mockSettings.registration.publicRegistrationEnabled ? 'Enabled' : 'Disabled'} public registration. `
    : ''

  recordActivity({
    type: ACTIVITY_TYPE.ADMIN_ACTION,
    actorName: actor.fullName,
    actorEmail: actor.email,
    description: `${registrationText}Updated the system settings.`,
  })

  return clone(mockSettings)
}