import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
  Platform,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import * as Haptics from "expo-haptics";

interface LogInputSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (value: number) => void;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  current: number;
  goal: number;
  unit: string;
  max: number;
  step: number;
  isInverse?: boolean;
}

export function LogInputSheet({
  visible,
  onClose,
  onSave,
  title,
  icon,
  color,
  current,
  goal,
  unit,
  max,
  step,
  isInverse = false,
}: LogInputSheetProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const [value, setValue] = useState(current);

  const handleMinus = () => {
    const next = Math.max(0, value - step);
    setValue(next);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePlus = () => {
    const next = Math.min(max, value + step);
    setValue(next);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSave = () => {
    onSave(value);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  const progress = isInverse
    ? Math.max(0, 1 - value / Math.max(goal, 1))
    : Math.min(value / Math.max(goal, 1), 1);

  const isGoalMet = isInverse ? value <= goal : value >= goal;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.backgroundSecondary,
              paddingBottom: insets.bottom + 24,
            },
          ]}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={[styles.iconBg, { backgroundColor: color + "20" }]}>
              <Ionicons name={icon} size={24} color={color} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close-circle" size={28} color={colors.textTertiary} />
            </Pressable>
          </View>

          <View style={styles.goalRow}>
            <Text style={[styles.goalLabel, { color: colors.textSecondary }]}>
              {isInverse ? "Limit" : "Goal"}: {goal} {unit}
            </Text>
            {isGoalMet && (
              <View style={[styles.goalBadge, { backgroundColor: color + "20" }]}>
                <Ionicons name="checkmark-circle" size={14} color={color} />
                <Text style={[styles.goalBadgeText, { color }]}>Goal reached!</Text>
              </View>
            )}
          </View>

          {/* Progress bar */}
          <View style={[styles.progressBg, { backgroundColor: colors.borderLight }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: color,
                  width: `${Math.min(progress * 100, 100)}%`,
                },
              ]}
            />
          </View>

          {/* Stepper */}
          <View style={styles.stepper}>
            <Pressable
              onPress={handleMinus}
              style={[styles.stepBtn, { backgroundColor: colors.backgroundTertiary }]}
            >
              <Ionicons name="remove" size={28} color={colors.text} />
            </Pressable>

            <View style={styles.valueBox}>
              <Text style={[styles.valueText, { color }]}>{value}</Text>
              <Text style={[styles.unitText, { color: colors.textSecondary }]}>{unit}</Text>
            </View>

            <Pressable
              onPress={handlePlus}
              style={[styles.stepBtn, { backgroundColor: colors.backgroundTertiary }]}
            >
              <Ionicons name="add" size={28} color={colors.text} />
            </Pressable>
          </View>

          <Pressable
            onPress={handleSave}
            style={[styles.saveBtn, { backgroundColor: color }]}
          >
            <Text style={styles.saveBtnText}>Save</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    gap: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    flex: 1,
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  goalLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  goalBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  goalBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
  progressBg: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    marginVertical: 12,
  },
  stepBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  valueBox: {
    alignItems: "center",
    minWidth: 100,
  },
  valueText: {
    fontFamily: "Inter_700Bold",
    fontSize: 52,
    lineHeight: 60,
  },
  unitText: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    marginTop: -4,
  },
  saveBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  saveBtnText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 17,
  },
});
