import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

function CalendarIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Path
        d="M3 8h16M7 3v2m8-2v2M4 5h14a1 1 0 011 1v13a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChartIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Path
        d="M4 16l4-4 4 3 4-6"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 19h16"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function PersonIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Circle cx={11} cy={7} r={4} stroke={color} strokeWidth={1.7} />
      <Path
        d="M3 19c0-3.314 3.582-6 8-6s8 2.686 8 6"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}

const ICONS = [CalendarIcon, ChartIcon, PersonIcon];
const LABELS = ['Calendar', 'Portfolio', 'Profile'];

export function TabBar({ state, navigation }: TabBarProps) {
  const { C, accent } = useTheme();

  const s = StyleSheet.create({
    bar: {
      flexDirection: 'row',
      height: 64,
      backgroundColor: C.surface,
      borderTopWidth: 1,
      borderTopColor: C.divider,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },
    label: {
      fontSize: 10.5,
      fontWeight: '600',
    },
  });

  return (
    <View style={s.bar}>
      {state.routes.map((route: any, i: number) => {
        const focused = state.index === i;
        const color = focused ? accent.today : C.muted;
        const Icon = ICONS[i];
        return (
          <TouchableOpacity
            key={route.key}
            style={s.tab}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}
          >
            <Icon color={color} />
            <Text style={[s.label, { color }]}>{LABELS[i]}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
