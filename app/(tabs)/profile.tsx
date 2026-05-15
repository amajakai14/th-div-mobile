import { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { usePushToken } from '../../hooks/usePushToken';
import { useWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from '../../queries/useWatchlist';
import { TickerCard } from '../../components/TickerCard';

export default function ProfileScreen() {
  const { C, accent } = useTheme();
  const { userId, signOut } = useAuth();
  const { status: pushStatus, register } = usePushToken();
  const watchlist = useWatchlist();
  const { mutate: addToWatchlist } = useAddToWatchlist();
  const { mutate: removeFromWatchlist } = useRemoveFromWatchlist();

  const [watchlistInput, setWatchlistInput] = useState('');

  function handleAdd() {
    const ticker = watchlistInput.trim().toUpperCase();
    if (!ticker) return;
    addToWatchlist(ticker);
    setWatchlistInput('');
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={styles.container}
    >
      {/* Section 1 — Account */}
      <View>
        <Text style={[styles.sectionLabel, { color: C.muted }]}>ACCOUNT</Text>
        <View style={[styles.card, { backgroundColor: C.surface }]}>
          <Text style={{ color: C.text, fontSize: 13 }} numberOfLines={1}>
            {userId ?? '—'}
          </Text>
          <TouchableOpacity
            onPress={signOut}
            style={[styles.outlineBtn, { borderColor: C.divider }]}
          >
            <Text style={[styles.outlineBtnLabel, { color: C.text }]}>
              Sign out
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Section 2 — Notifications */}
      <View>
        <Text style={[styles.sectionLabel, { color: C.muted }]}>NOTIFICATIONS</Text>
        <View style={[styles.card, { backgroundColor: C.surface }]}>
          <View style={styles.row}>
            <Text style={{ color: C.text, fontSize: 15, fontWeight: '500', flex: 1 }}>
              XD Alerts
            </Text>
            <Switch
              value={pushStatus === 'registered'}
              thumbColor={pushStatus === 'registered' ? accent.today : C.muted}
              trackColor={{ false: C.divider, true: accent.today + '33' }}
              onValueChange={(v) => {
                if (v) register();
              }}
            />
          </View>
        </View>
        {pushStatus === 'denied' && (
          <Text style={[styles.statusNote, { color: C.muted }]}>
            Notifications blocked — enable in Settings
          </Text>
        )}
        {pushStatus === 'error' && (
          <Text style={[styles.statusNote, { color: C.muted }]}>
            Registration failed. Tap to retry.
          </Text>
        )}
      </View>

      {/* Section 3 — Watchlist */}
      <View>
        <Text style={[styles.sectionLabel, { color: C.muted }]}>WATCHLIST</Text>

        {/* Add row */}
        <View style={styles.addRow}>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: C.divider,
                backgroundColor: C.surface,
                color: C.text,
              },
            ]}
            value={watchlistInput}
            onChangeText={setWatchlistInput}
            placeholder="Ticker"
            placeholderTextColor={C.muted}
            autoCapitalize="characters"
            returnKeyType="done"
            onSubmitEditing={handleAdd}
          />
          <TouchableOpacity
            onPress={handleAdd}
            style={[styles.addBtn, { backgroundColor: accent.today }]}
          >
            <Text style={[styles.addBtnLabel, { color: C.surface }]}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        {watchlist.isLoading ? (
          <ActivityIndicator color={accent.today} style={{ marginTop: 12 }} />
        ) : watchlist.data && watchlist.data.length > 0 ? (
          <View style={styles.tickerList}>
            {watchlist.data.map((w) => (
              <TickerCard
                key={w.ticker}
                ticker={w.ticker}
                onRemove={(t) => removeFromWatchlist(t)}
              />
            ))}
          </View>
        ) : (
          <Text style={[styles.emptyNote, { color: C.muted }]}>
            No tickers on watchlist
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  card: {
    borderRadius: 12,
    padding: 12,
  },
  outlineBtn: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    marginTop: 8,
    alignItems: 'center',
  },
  outlineBtnLabel: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusNote: {
    fontSize: 12,
    marginTop: 6,
  },
  addRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  addBtn: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnLabel: {
    fontWeight: '600',
  },
  tickerList: {
    gap: 8,
  },
  emptyNote: {
    fontSize: 13,
    marginTop: 4,
  },
});
