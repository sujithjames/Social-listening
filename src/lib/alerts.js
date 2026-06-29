const ALERTS_KEY = 'sl.alerts.v1'

function readAll() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ALERTS_KEY) || '{}')
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function loadAlerts(topicName) {
  const all = readAll()
  return Array.isArray(all[topicName]) ? all[topicName] : []
}

export function saveAlerts(topicName, alerts) {
  const all = readAll()
  all[topicName] = alerts
  localStorage.setItem(ALERTS_KEY, JSON.stringify(all))
}
