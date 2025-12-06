// Helpers para calcular fechas en horario Argentina (GMT-3)

// Helper: calcular próximo viernes 20:00 GMT-3 (Argentina)
export const getNextFridayArgentinaTime = (): Date => {
  const now = new Date()

  console.log('🕐 [FRIDAY] Hora actual (local):', now.toLocaleString())
  console.log('🕐 [FRIDAY] Hora actual (UTC):', now.toUTCString())
  console.log('🕐 [FRIDAY] Hora actual (ISO):', now.toISOString())

  // Convertir a UTC y luego ajustar a Argentina (UTC-3)
  const nowUTC = new Date(now.toISOString())

  // Calcular la hora actual en Argentina (UTC - 3 horas)
  const argentinaTime = new Date(nowUTC.getTime() - 3 * 60 * 60 * 1000)

  console.log('🇦🇷 [FRIDAY] Hora en Argentina:', argentinaTime.toISOString())
  console.log('🇦🇷 [FRIDAY] Día de semana en Argentina:', argentinaTime.getUTCDay(), '(0=Dom, 1=Lun, 5=Vie)')

  // Calcular días hasta viernes (5 = Friday) usando UTC
  const dayOfWeek = argentinaTime.getUTCDay()
  const hoursInArgentina = argentinaTime.getUTCHours()

  let daysUntilFriday = (5 - dayOfWeek + 7) % 7

  // Si es viernes pero ya pasaron las 20:00 en Argentina, ir al próximo viernes
  if (dayOfWeek === 5 && hoursInArgentina >= 20) {
    daysUntilFriday = 7
  }

  // Si estamos en el día antes del viernes o antes, y no es viernes
  if (daysUntilFriday === 0 && dayOfWeek !== 5) {
    daysUntilFriday = 7
  }

  console.log('📅 [FRIDAY] Días hasta el viernes:', daysUntilFriday)

  // Crear la fecha del próximo viernes a las 20:00 en Argentina
  // Esto significa: viernes 20:00 Argentina = viernes 23:00 UTC
  const nextFridayUTC = new Date(argentinaTime)
  nextFridayUTC.setUTCDate(argentinaTime.getUTCDate() + daysUntilFriday)
  nextFridayUTC.setUTCHours(20, 0, 0, 0) // 20:00 en "tiempo Argentina"

  // Ahora convertir esas 20:00 Argentina a UTC (sumar 3 horas)
  const nextFridayRealUTC = new Date(nextFridayUTC.getTime() + 3 * 60 * 60 * 1000)

  console.log('🎯 [FRIDAY] Próximo viernes UTC:', nextFridayRealUTC.toISOString())
  console.log('🎯 [FRIDAY] Próximo viernes (debe ser Vie 23:00 UTC):', nextFridayRealUTC.toUTCString())

  // Crear fecha local a partir de la UTC
  const result = new Date(nextFridayRealUTC.toISOString())

  console.log('✅ [FRIDAY] Resultado final (local timezone):', result.toLocaleString())
  console.log('✅ [FRIDAY] Resultado final (ISO):', result.toISOString())
  console.log('---')

  return result
}

// Helper: calcular último día del mes a las 20:00 GMT-3 (Argentina)
export const getNextMonthlyDrawArgentinaTime = (): Date => {
  const now = new Date()

  console.log('🕐 [MONTHLY] Hora actual (local):', now.toLocaleString())
  console.log('🕐 [MONTHLY] Hora actual (UTC):', now.toUTCString())
  console.log('🕐 [MONTHLY] Hora actual (ISO):', now.toISOString())

  // Convertir a UTC y luego ajustar a Argentina (UTC-3)
  const nowUTC = new Date(now.toISOString())

  // Calcular la hora actual en Argentina (UTC - 3 horas)
  const argentinaTime = new Date(nowUTC.getTime() - 3 * 60 * 60 * 1000)

  console.log('🇦🇷 [MONTHLY] Hora en Argentina:', argentinaTime.toISOString())
  console.log('🇦🇷 [MONTHLY] Mes actual en Argentina:', argentinaTime.getUTCMonth() + 1)

  // Calcular último día del mes actual en Argentina usando UTC methods
  const year = argentinaTime.getUTCFullYear()
  const month = argentinaTime.getUTCMonth()

  // Último día del mes actual
  const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0, 20, 0, 0, 0))

  console.log('📅 [MONTHLY] Último día del mes (en tiempo Argentina):', lastDayOfMonth.toISOString())

  // Verificar si ya pasó el sorteo de este mes
  const sorteoAlreadyPassed = argentinaTime.getTime() > lastDayOfMonth.getTime()

  console.log('📅 [MONTHLY] ¿Ya pasó el sorteo?:', sorteoAlreadyPassed)

  let targetDate: Date

  // Si ya pasó el sorteo de este mes, calcular el siguiente
  if (sorteoAlreadyPassed) {
    console.log('⚠️ [MONTHLY] Sorteo ya pasó, calculando próximo mes')
    targetDate = new Date(Date.UTC(year, month + 2, 0, 20, 0, 0, 0))
    console.log('🎯 [MONTHLY] Último día del próximo mes:', targetDate.toISOString())
  } else {
    console.log('🎯 [MONTHLY] Usando último día del mes actual')
    targetDate = lastDayOfMonth
  }

  // Convertir a UTC real (sumar 3 horas porque 20:00 Argentina = 23:00 UTC)
  const targetUTC = new Date(targetDate.getTime() + 3 * 60 * 60 * 1000)

  console.log('🎯 [MONTHLY] Target UTC (debe ser 23:00):', targetUTC.toISOString())

  // Crear fecha local a partir de la UTC
  const result = new Date(targetUTC.toISOString())

  console.log('✅ [MONTHLY] Resultado final (local timezone):', result.toLocaleString())
  console.log('✅ [MONTHLY] Resultado final (ISO):', result.toISOString())
  console.log('---')

  return result
}
