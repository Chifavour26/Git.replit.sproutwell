import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { GoalCard } from "@/components/GoalCard";
import { PetAvatar } from "@/components/PetAvatar";
import { LogInputSheet } from "@/components/LogInputSheet";
import { useApp } from "@/context/AppContext";

type GoalKey = "fruitsVeggies" | "activityMinutes" | "sleepHours" | "screenTimeHours" | "waterGlasses";

const GOAL_CONFIGS: {
  key: GoalKey;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  colorKey: keyof typeof Colors.light;
  unit: string;
  max: number;
  step: number;
  isInverse?: boolean;
}[] = [
  { key: "fruitsVeggies", title: "Fruits & Veggies", icon: "nutrition", colorKey: "tint", unit: "pcs", max: 15, step: 1 },
  { key: "activityMinutes", title: "Active Play", icon: "football", colorKey: "sky", unit: "min", max: 180, step: 5 },
  { key: "sleepHours", title: "Sleep", icon: "moon", colorKey: "purple", unit: "hrs", max: 14, step: 0.5 },
  { key: "screenTimeHours", title: "Screen Time", icon: "phone-portrait", colorKey: "coral", unit: "hrs", max: 8, step: 0.5, isInverse: true },
  { key: "waterGlasses", title: "Water", icon: "water", colorKey: "sky", unit: "cup", max: 12, step: 1 },
];

function getDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getDailyScore(log: { fruitsVeggies: number; activityMinutes: number; sleepHours: number; screenTimeHours: number; waterGlasses: number }, goals: { fruitsVeggies: number; activityMinutes: number; sleepHours: number; screenTimeHours: number; waterGlasses: number }): number {
  let score = 0;
  if (log.fruitsVeggies >= goals.fruitsVeggies) score += 20;
  if (log.activityMinutes >= goals.activityMinutes) score += 20;
  if (log.sleepHours >= goals.sleepHours) score += 20;
  if (log.screenTimeHours <= goals.screenTimeHours) score += 20;
  if (log.waterGlasses >= goals.waterGlasses) score += 20;
  return score;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { activeProfile, todayLog, goals, updateDailyLog } = useApp();
  const [activeSheet, setActiveSheet] = useState<GoalKey | null>(null);

  const isWeb = Platform.OS === "web";

  if (!activeProfile) {
    return (
      <View style={[styles.emptyState, { backgroundColor: colors.background }]}>
        <MaterialCommunityIcons name="account-plus" size={64} color={colors.tint} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Welcome to KidWell</Text>
        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
          Create a profile to get started on your health journey!
        </Text>
        <Pressable
          onPress={() => router.push("/onboarding")}
          style={[styles.ctaBtn, { backgroundColor: colors.tint }]}
        >
          <Text style={styles.ctaBtnText}>Create Profile</Text>
        </Pressable>
      </View>
    );
  }

  const score = todayLog
    ? getDailyScore(
        { fruitsVeggies: todayLog.fruitsVeggies, activityMinutes: todayLog.activityMinutes, sleepHours: todayLog.sleepHours, screenTimeHours: todayLog.screenTimeHours, waterGlasses: todayLog.waterGlasses },
        goals
      )
    : 0;

  const activeGoal = activeSheet ? GOAL_CONFIGS.find((g) => g.key === activeSheet) : null;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: isWeb ? insets.top + 67 : insets.top + 16,
            paddingBottom: isWeb ? 120 : 120,
          },
        ]}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.header}>
          <LinearGradient
            colors={
              isDark
                ? ["#1F3A1F", "#0F1A0F"]
                : ["#E8F8EE", colors.background]
            }
            style={styles.headerGradient}
          />
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                {getDayGreeting()},
              </Text>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {activeProfile.name}
              </Text>
            </View>
            <View style={styles.headerRight}>
              <View style={[styles.streakBadge, { backgroundColor: colors.accent + "20" }]}>
                <MaterialCommunityIcons name="fire" size={16} color={colors.accent} />
                <Text style={[styles.streakText, { color: colors.accent }]}>
                  {activeProfile.streakDays}d
                </Text>
              </View>
              <PetAvatar
                mood={activeProfile.petMood}
                level={activeProfile.petLevel}
                petName={activeProfile.petName}
                size="medium"
              />
            </View>
          </View>

          {/* Daily Score */}
          <View style={[styles.scoreCard, { backgroundColor: colors.card }]}>
            <View>
              <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Today's Score</Text>
              <Text style={[styles.scoreValue, { color: colors.tint }]}>{score}%</Text>
            </View>
            <View style={[styles.scoreBarBg, { backgroundColor: colors.borderLight }]}>
              <View
                style={[
                  styles.scoreBarFill,
                  {
                    width: `${score}%`,
                    backgroundColor: score >= 80 ? colors.tint : score >= 50 ? colors.accent : colors.coral,
                  },
                ]}
              />
            </View>
            <Text style={[styles.scoreHint, { color: colors.textTertiary }]}>
              {score >= 80 ? "Amazing day!" : score >= 50 ? "Keep going!" : "You can do it!"}
            </Text>
          </View>
        </Animated.View>

        {/* Goals Grid */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Goals</Text>
          <View style={styles.goalsGrid}>
            {GOAL_CONFIGS.map((cfg) => {
              const current = todayLog ? todayLog[cfg.key] : 0;
              const color = (colors as Record<string, string>)[cfg.colorKey as string] as string;
              return (
                <GoalCard
                  key={cfg.key}
                  title={cfg.title}
                  icon={cfg.icon}
                  color={color}
                  current={current}
                  goal={cfg.isInverse ? cfg.max / 4 : goals[cfg.key]}
                  unit={cfg.unit}
                  onPress={() => setActiveSheet(cfg.key)}
                />
              );
            })}
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Log</Text>
          <View style={styles.quickActions}>
            {GOAL_CONFIGS.map((cfg) => {
              const current = todayLog ? todayLog[cfg.key] : 0;
              const color = (colors as Record<string, string>)[cfg.colorKey as string] as string;
              return (
                <Pressable
                  key={cfg.key}
                  onPress={() => setActiveSheet(cfg.key)}
                  style={[styles.quickAction, { backgroundColor: color + "15" }]}
                >
                  <Ionicons name={cfg.icon} size={20} color={color} />
                  <Text style={[styles.quickActionText, { color }]} numberOfLines={1}>
                    +{cfg.step} {cfg.unit}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Today Tip */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Pressable
            onPress={() => router.push("/learn")}
            style={[styles.tipCard, { backgroundColor: colors.tint + "15", borderColor: colors.tint + "30" }]}
          >
            <MaterialCommunityIcons name="lightbulb-on" size={24} color={colors.tint} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.tipTitle, { color: colors.tint }]}>Daily Tip</Text>
              <Text style={[styles.tipText, { color: colors.text }]}>
                Try to eat a rainbow of fruits and vegetables — the more colors, the more nutrients!
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.tint} />
          </Pressable>
        </Animated.View>
      </ScrollView>

      {/* Log Input Sheet */}
      {activeGoal && todayLog && (
        <LogInputSheet
          visible={!!activeSheet}
          onClose={() => setActiveSheet(null)}
          onSave={(val) => {
            if (activeSheet) updateDailyLog(activeSheet, val);
          }}
          title={activeGoal.title}
          icon={activeGoal.icon}
          color={(colors as Record<string, string>)[activeGoal.colorKey as string] as string}
          current={todayLog[activeGoal.key]}
          goal={activeGoal.isInverse ? goals.screenTimeHours : goals[activeGoal.key]}
          unit={activeGoal.unit}
          max={activeGoal.max}
          step={activeGoal.step}
          isInverse={activeGoal.isInverse}
        />
      )}
    </View>
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
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  emptyTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    textAlign: "center",
  },
  emptyDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  ctaBtn: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  ctaBtnText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 17,
  },
  header: {
    gap: 16,
    position: "relative",
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
    marginHorizontal: -20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  profileName: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    marginTop: 2,
  },
  headerRight: {
    alignItems: "center",
    gap: 8,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  streakText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
  scoreCard: {
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  scoreLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  scoreValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    lineHeight: 38,
  },
  scoreBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  scoreBarFill: {
    height: 8,
    borderRadius: 4,
  },
  scoreHint: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    marginBottom: 12,
  },
  goalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickActionText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  tipTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    marginBottom: 2,
  },
  tipText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },
});
