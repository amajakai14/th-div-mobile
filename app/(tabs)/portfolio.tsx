import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { usePortfolio, useAddHolding, useRemoveHolding } from '../../queries/usePortfolio';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { HoldingCard } from '../../components/HoldingCard';
import { ErrorToast } from '../../components/ErrorToast';
import { OfflineBadge } from '../../components/OfflineBadge';

export default function PortfolioScreen() {
  const { C, accent, radius, font } = useTheme();
  const { isOnline } = useNetworkStatus();
  const { data: holdings, isLoading } = usePortfolio();
  const addHolding = useAddHolding();
  const removeHolding = useRemoveHolding();

  const [ticker, setTicker] = useState('');
  const [qty, setQty] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleAdd() {
    const trimmedTicker = ticker.trim();
    const parsedQty = Number(qty);

    if (!trimmedTicker) {
      setErrorMsg('Ticker is required');
      return;
    }
    if (!qty || parsedQty <= 0 || !Number.isFinite(parsedQty)) {
      setErrorMsg('Quantity must be greater than 0');
      return;
    }

    addHolding.mutate(
      { ticker: trimmedTicker.toUpperCase(), quantity: parsedQty },
      {
        onSuccess: () => {
          setTicker('');
          setQty('');
        },
        onError: (e) => {
          setErrorMsg(e.message ?? 'Failed to add holding');
        },
      }
    );
  }

  function handleRemove(t: string) {
    removeHolding.mutate(t, {
      onError: (e) => {
        setErrorMsg(e.message ?? 'Failed to remove holding');
      },
    });
  }

  return (
    <View style={[styles.root, { backgroundColor: C.bg }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.header, { color: C.text }]}>Portfolio</Text>
        </View>

        {!isOnline && <OfflineBadge />}

        {/* Add holding form */}
        <View style={[styles.formCard, { backgroundColor: C.surface, borderColor: C.divider }]}>
          <Text style={[styles.fieldLabel, { color: C.muted }]}>ADD HOLDING</Text>

          <View style={styles.inputRow}>
            <View style={[styles.inputWrap, { flex: 2 }]}>
              <Text style={[styles.fieldLabel, { color: C.muted }]}>TICKER</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: C.surface, borderColor: C.divider, color: C.text },
                ]}
                placeholder="e.g. PTT"
                placeholderTextColor={C.muted}
                value={ticker}
                onChangeText={setTicker}
                autoCapitalize="characters"
                returnKeyType="next"
              />
            </View>

            <View style={[styles.inputWrap, { flex: 1 }]}>
              <Text style={[styles.fieldLabel, { color: C.muted }]}>QTY</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: C.surface, borderColor: C.divider, color: C.text },
                ]}
                placeholder="100"
                placeholderTextColor={C.muted}
                value={qty}
                onChangeText={setQty}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={handleAdd}
              />
            </View>
          </View>

          <Pressable
            style={[styles.addBtn, { backgroundColor: accent.today, borderRadius: radius.md }]}
            onPress={handleAdd}
            disabled={addHolding.isPending}
          >
            {addHolding.isPending ? (
              <ActivityIndicator color={C.surface} size="small" />
            ) : (
              <Text style={[styles.addBtnText, { color: C.surface }]}>Add</Text>
            )}
          </Pressable>
        </View>

        {/* Holdings list */}
        <Text style={[styles.sectionLabel, { color: C.muted }]}>HOLDINGS</Text>

        {isLoading ? (
          <ActivityIndicator color={accent.today} style={styles.loader} />
        ) : !holdings || holdings.length === 0 ? (
          <Text style={[styles.emptyText, { color: C.muted }]}>No holdings yet</Text>
        ) : (
          <View style={styles.list}>
            {holdings.map((h) => (
              <HoldingCard key={h.ticker} holding={h} onRemove={handleRemove} />
            ))}
          </View>
        )}
      </ScrollView>

      {errorMsg !== null && (
        <ErrorToast message={errorMsg} onDismiss={() => setErrorMsg(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
  },
  formCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputWrap: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: '500',
  },
  addBtn: {
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  list: {
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 24,
  },
  loader: {
    paddingVertical: 24,
  },
});
