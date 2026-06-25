import { StoredSession } from '../agent/singerProfile';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function formatPracticeDuration(totalMinutes: number): string {
  if (totalMinutes <= 0) return '0m';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function getSessionsInRange(sessions: StoredSession[], startMs: number, endMs: number): StoredSession[] {
  const now = Date.now();
  return sessions.filter((session) => {
    const age = now - new Date(session.date).getTime();
    return age >= startMs && age < endMs;
  });
}

export function formatWeekDelta(current: number, previous: number, unit: string): string {
  if (current === 0 && previous === 0) return `No change vs last 7 days`;
  if (previous === 0) return `↑ ${current} ${unit} this week`;
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) return `Same as last 7 days`;
  const arrow = pct > 0 ? '↑' : '↓';
  return `${arrow} ${Math.abs(pct)}% vs last 7 days`;
}

export function formatScoreWeekDelta(currentAvg: number, previousAvg: number): string {
  if (currentAvg === 0 && previousAvg === 0) return 'No sessions yet';
  if (previousAvg === 0) return `↑ ${currentAvg} pts this week`;
  const delta = currentAvg - previousAvg;
  if (delta === 0) return 'Same as last 7 days';
  const arrow = delta > 0 ? '↑' : '↓';
  return `${arrow} ${Math.abs(delta)} pts vs last 7 days`;
}

export function averageOverall(sessions: StoredSession[]): number {
  if (sessions.length === 0) return 0;
  return Math.round(sessions.reduce((sum, s) => sum + s.overall, 0) / sessions.length);
}

export function totalPracticeMinutes(sessions: StoredSession[]): number {
  return Math.round(sessions.reduce((sum, s) => sum + s.sessionSeconds, 0) / 60);
}

export function buildWeekComparisons(sessions: StoredSession[]) {
  const thisWeek = getSessionsInRange(sessions, 0, WEEK_MS);
  const lastWeek = getSessionsInRange(sessions, WEEK_MS, WEEK_MS * 2);

  return {
    sessionsThisWeek: thisWeek.length,
    sessionsLastWeek: lastWeek.length,
    sessionsDelta: formatWeekDelta(thisWeek.length, lastWeek.length, 'sessions'),
    scoreThisWeek: averageOverall(thisWeek),
    scoreLastWeek: averageOverall(lastWeek),
    scoreDelta: formatScoreWeekDelta(averageOverall(thisWeek), averageOverall(lastWeek)),
    minutesThisWeek: totalPracticeMinutes(thisWeek),
    minutesLastWeek: totalPracticeMinutes(lastWeek),
    minutesDelta: formatWeekDelta(totalPracticeMinutes(thisWeek), totalPracticeMinutes(lastWeek), 'min'),
  };
}
