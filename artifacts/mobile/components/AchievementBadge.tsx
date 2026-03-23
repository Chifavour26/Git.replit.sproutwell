import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import Colors from "@/constants/colors";
import { Achievement } from "@/context/AppContext";

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "small" | "large";
}

const ACHIEVEMENT_COLORS: Record<string, string> = {
  streak: "#F1C40F",
  nutrition: "#2ECC71",
  activity: "#4ECDC4",
  sleep: "#9B59B6",
  water: "#3498DB",
  screen: "#E74C3C",
  allGoals: "#E67E22",
  welcome: "#2ECC71",
};

const ACHIEVEMENT_ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  streak: "fire",
  nutrition: "food-apple",
  activity: "run",
  sleep: "sleep",
  water: "water",
  screen: "cellphone-off",
  allGoals: "star",
  welcome: "hand-wave",
};

export function AchievementBadge({ achievement, size = "large" }: AchievementBadgeProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const color = ACHIEVEMENT_COLORS[achievement.type] ?? colors.tint;
  const icon = ACHIEVEMENT_ICONS[achievement.type] ?? "star";
  const isSmall = size === "small";

  return (
    <View style={[styles.badge, isSmall && styles.badgeSmall]}>
      <View
        style={[
          styles.iconContainer,
          isSmall ? styles.iconSmall : styles.iconLarge,
          { backgroundColor: color + "20" },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={isSmall ? 20 : 28}
          color={color}
        />
      </View>
      {!isSmall && (
        <>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {achievement.title}
          </Text>
          <Text style={[styles.desc, { color: colors.textSecondary }]} numberOfLines={2}>
            {achievement.description}
          </Text>
          <View style={[styles.pointsBadge, { backgroundColor: color + "15" }]}>
            <MaterialCommunityIcons name="star" size={12} color={color} />
            <Text style={[styles.points, { color }]}>+{achievement.points}</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    gap: 6,
    width: 110,
  },
  badgeSmall: {
    width: 44,
  },
  iconContainer: {
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconLarge: {
    width: 64,
    height: 64,
    borderRadius: 20,
  },
  iconSmall: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    textAlign: "center",
  },
  desc: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    textAlign: "center",
    lineHeight: 14,
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  points: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
  },
});
