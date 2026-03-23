import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useApp, DailyLog } from "@/context/AppContext";
import { GoalRing } from "@/components/GoalRing";

interface WeekLog {
  date: string;
  label: string;
  score: number;
  fruitsVeggies: number;
  activityMinutes: number;
  sleepHours: number;
  waterGlasses: number;
}

function getWeekDates(): { date: string; label: string }[] {
  const result = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    result.push({
      date: d.toISOString().split("T")[0],
      label: i === 0 ? "Today" : d.toLocaleDateString("en", { weekday: "short" }),
    });
  }
  return result;
}

function scoreLog(log: DailyLog, goals: { fruitsVeggies: number; activityMinutes: number; sleepHours: number; screenTimeHours: number; waterGlasses: number }): number {
  let s = 0;
  if (log.fruitsVeggies >= goals.fruitsVeggies) s++;
  if (log.activityMinutes >= goals.activityMinutes) s++;
  if (log.sleepHours >= goals.sleepHours) s++;
  if (log.screenTimeHours <= goals.screenTimeHours) s++;
  if (log.waterGlasses >= goals.waterGlasses) s++;
  return Math.round((s / 5) * 100);
}

export default function TrackScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { activeProfile, todayLog, goals } = useApp();
  const [weekData, setWeekData] = useState<WeekLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isWeb = Platform.OS === "web";

  useEffect(() => {
    if (!activeProfile) return;
    const loadWeek = async () => {
      const dates = getWeekDates();
      const loaded: WeekLog[] = [];
      for (const { date, label } of dates) {
        const key = `log_${activeProfile.id}_${date}`;
        const raw = await AsyncStorage.getItem(key);
        if (raw) {
          const log: DailyLog = JSON.parse(raw);
          loaded.push({
            date,
            label,
            score: scoreLog(log, goals),
            fruitsVeggies: log.fruitsVeggies,
            activityMinutes: log.activityMinutes,
            sleepHours: log.sleepHours,
            waterGlasses: log.waterGlasses,
          });
        } else {
          loaded.push({ date, label, score: 0, fruitsVeggies: 0, activityMinutes: 0, sleepHours: 0, waterGlasses: 0 });
        }
      }
      setWeekData(loaded);
      setIsLoading(false);
    };
    loadWeek();
  }, [activeProfile, goals]);

  if (!activeProfile) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.background }]}>
        <MaterialCommunityIcons name="chart-line" size={56} color={colors.tint} />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Create a profile to start tracking
        </Text>
      </View>
    );
  }

  const maxScore = Math.max(...weekData.map((w) => w.score), 1);
  const avgScore =
    weekData.length > 0
      ? Math.round(weekData.reduce((a, b) => a + b.score, 0) / weekData.length)
      : 0;
  const bestDay = weekData.reduce((best, d) => (d.score > best.score ? d : best), weekData[0] || { label: "-", score: 0 });

  const todayStats = [
    { key: "fruitsVeggies", label: "Fruits & Veggies", value: todayLog?.fruitsVeggies ?? 0, goal: goals.fruitsVeggies, unit: "pcs", color: colors.tint },
    { key: "activityMinutes", label: "Active Play", value: todayLog?.activityMinutes ?? 0, goal: goals.activityMinutes, unit: "min", color: colors.sky },
    { key: "sleepHours", label: "Sleep", value: todayLog?.sleepHours ?? 0, goal: goals.sleepHours, unit: "hrs", color: colors.purple },
    { key: "waterGlasses", label: "Water", value: todayLog?.waterGlasses ?? 0, goal: goals.waterGlasses, unit: "cups", color: "#3498DB" },
  ];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.scroll,
        {
          paddingTop: isWeb ? insets.top + 67 : insets.top + 20,
          paddingBottom: isWeb ? 120 : 120,
        },
      ]}
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.headerSection}>
        <Text style={[styles.title, { color: colors.text }]}>Progress</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {activeProfile.name}'s weekly overview
        </Text>
      </Animated.View>

      {/* Weekly Summary Cards */}
      <Animated.View entering={FadeInDown.delay(80).springify()} style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
          <MaterialCommunityIcons name="chart-line-variant" size={22} color={colors.tint} />
          <Text style={[styles.summaryValue, { color: colors.text }]}>{avgScore}%</Text>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Weekly Avg</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
          <MaterialCommunityIcons name="trophy" size={22} color={colors.accent} />
          <Text style={[styles.summaryValue, { color: colors.text }]}>{bestDay?.score ?? 0}%</Text>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Best Day</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
          <MaterialCommunityIcons name="fire" size={22} color={colors.coral} />
          <Text style={[styles.summaryValue, { color: colors.text }]}>{activeProfile.streakDays}</Text>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Day Streak</Text>
        </View>
      </Animated.View>

      {/* Weekly Bar Chart */}
      <Animated.View entering={FadeInDown.delay(160).springify()}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>This Week</Text>
        <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
          <View style={styles.bars}>
            {weekData.map((day) => {
              const height = Math.max((day.score / 100) * 100, 4);
              const barColor =
                day.score >= 80
                  ? colors.tint
                  : day.score >= 50
                  ? colors.accent
                  : day.score > 0
                  ? colors.coral
                  : colors.borderLight;
              return (
                <View key={day.date} style={styles.barItem}>
                  <Text style={[styles.barScore, { color: colors.textTertiary }]}>
                    {day.score > 0 ? `${day.score}%` : ""}
                  </Text>
                  <View style={[styles.barBg, { backgroundColor: colors.borderLight }]}>
                    <View
                      style={[styles.barFill, { height, backgroundColor: barColor }]}
                    />
                  </View>
                  <Text style={[styles.barLabel, { color: colors.textSecondary }]}>
                    {day.label.slice(0, 3)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </Animated.View>

      {/* Today's Breakdown */}
      <Animated.View entering={FadeInDown.delay(240).springify()}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Breakdown</Text>
        <View style={[styles.breakdownCard, { backgroundColor: colors.card }]}>
          <View style={styles.ringsRow}>
            {todayStats.map((stat) => (
              <View key={stat.key} style={styles.ringItem}>
                <GoalRing
                  current={stat.value}
                  goal={stat.goal}
                  color={stat.color}
                  size={72}
                  strokeWidth={7}
                  unit={stat.unit}
                  showValues
                />
                <Text style={[styles.ringLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>

      {/* Total Points */}
      <Animated.View entering={FadeInDown.delay(320).springify()}>
        <View style={[styles.pointsCard, { backgroundColor: colors.tint + "15", borderColor: colors.tint + "30" }]}>
          <MaterialCommunityIcons name="star-four-points" size={32} color={colors.tint} />
          <View>
            <Text style={[styles.pointsValue, { color: colors.tint }]}>
              {activeProfile.totalPoints} pts
            </Text>
            <Text style={[styles.pointsLabel, { color: colors.textSecondary }]}>
              Total health points earned
            </Text>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    gap: 24,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyText: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
  },
  headerSection: {
    gap: 4,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
  },
  summaryLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    textAlign: "center",
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    marginBottom: 12,
  },
  chartCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 140,
    gap: 4,
  },
  barItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  barScore: {
    fontFamily: "Inter_400Regular",
    fontSize: 8,
  },
  barBg: {
    width: "100%",
    height: 100,
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 6,
  },
  barLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
  },
  breakdownCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  ringsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  ringItem: {
    alignItems: "center",
    gap: 8,
  },
  ringLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    textAlign: "center",
    maxWidth: 60,
  },
  pointsCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  pointsValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
  },
  pointsLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    marginTop: 2,
  },
});
