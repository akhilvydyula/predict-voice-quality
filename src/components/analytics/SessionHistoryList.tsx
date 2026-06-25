import { StyleSheet, Text, View } from 'react-native';

import { StoredSession } from '../../agent/singerProfile';
import { formatFullDate, formatSessionDuration } from '../../analytics/sessionAnalytics';
import { StatusBadge } from '../ui/StatusBadge';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type SessionHistoryListProps = {
  sessions: StoredSession[];
};

export function SessionHistoryList({ sessions }: SessionHistoryListProps) {
  if (sessions.length === 0) return null;

  return (
    <View style={styles.list}>
      {sessions.map((session, index) => (
        <View key={session.id} style={[styles.row, index > 0 && styles.rowBorder]}>
          <View style={styles.main}>
            <Text style={styles.date}>{formatFullDate(session.date)}</Text>
            <Text style={styles.meta}>
              {formatSessionDuration(session.sessionSeconds)} · {session.focusArea} ·{' '}
              {session.inTunePercent}% in tune
            </Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.score}>{session.overall}</Text>
            <StatusBadge
              label={session.overall >= 75 ? 'Strong' : session.overall >= 55 ? 'Developing' : 'Focus'}
              tone={session.overall >= 75 ? 'success' : session.overall >= 55 ? 'warning' : 'info'}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surfaceElevated,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  main: {
    flex: 1,
    gap: 4,
  },
  date: {
    ...typography.bodyBold,
    fontSize: 14,
  },
  meta: {
    ...typography.bodySmall,
  },
  right: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  score: {
    ...typography.h2,
    color: colors.primaryBright,
  },
});
