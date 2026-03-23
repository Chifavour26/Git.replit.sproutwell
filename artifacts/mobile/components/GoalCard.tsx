import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import Colors from "@/constants/colors";
import { GoalRing } from "./GoalRing";

interface GoalCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  current: number;
  goal: number;
  unit: string;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GoalCard({ title, icon, color, current, goal, unit, onPress }: GoalCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isComplete = current >= goal;

  return (
    <AnimatedPressable
      onPressIn={() => { scale.value = withSpring(0.96); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      onPress={onPress}
      style={[animatedStyle, styles.card, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}
    >
      <View style={[styles.iconBg, { backgroundColor: color + "18" }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{title}</Text>
      <GoalRing
        current={current}
        goal={goal}
        color={color}
        size={64}
        strokeWidth={6}
        unit={unit}
        showValues
      />
      {isComplete && (
        <View style={[styles.completeBadge, { backgroundColor: color }]}>
          <Ionicons name="checkmark" size={10} color="#fff" />
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    position: "relative",
    minWidth: 90,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    textAlign: "center",
  },
  completeBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
