import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Colors from "@/constants/colors";
import { PetMood } from "@/context/AppContext";

interface PetAvatarProps {
  mood: PetMood;
  level: number;
  petName: string;
  size?: "small" | "medium" | "large";
}

const PET_EMOJIS = {
  happy: { icon: "emoticon-excited-outline" as const, color: "#F1C40F" },
  neutral: { icon: "emoticon-neutral-outline" as const, color: "#4ECDC4" },
  sad: { icon: "emoticon-sad-outline" as const, color: "#9B59B6" },
};

const SIZE_MAP = {
  small: { container: 56, icon: 32, level: 10, fontSize: 9 },
  medium: { container: 90, icon: 52, level: 14, fontSize: 11 },
  large: { container: 120, icon: 72, level: 16, fontSize: 12 },
};

export function PetAvatar({ mood, level, petName, size = "medium" }: PetAvatarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const s = SIZE_MAP[size];

  const { icon, color } = PET_EMOJIS[mood];

  const bounceY = useSharedValue(0);
  const glowOpacity = useSharedValue(0.6);

  useEffect(() => {
    if (mood === "happy") {
      bounceY.value = withRepeat(
        withSequence(
          withTiming(-6, { duration: 500, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) })
        ),
        -1,
        false
      );
      glowOpacity.value = withRepeat(
        withSequence(withTiming(1, { duration: 800 }), withTiming(0.4, { duration: 800 })),
        -1,
        true
      );
    } else {
      bounceY.value = withTiming(0);
      glowOpacity.value = withTiming(0.3);
    }
  }, [mood, bounceY, glowOpacity]);

  const petStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceY.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={[styles.wrapper, { width: s.container, alignItems: "center" }]}>
      <View style={[styles.container, { width: s.container, height: s.container, borderRadius: s.container / 2 }]}>
        <Animated.View
          style={[
            styles.glow,
            glowStyle,
            {
              backgroundColor: color + "40",
              width: s.container,
              height: s.container,
              borderRadius: s.container / 2,
            },
          ]}
        />
        <Animated.View style={petStyle}>
          <MaterialCommunityIcons name={icon} size={s.icon} color={color} />
        </Animated.View>
        <View style={[styles.levelBadge, { backgroundColor: colors.tint }]}>
          <Text style={[styles.levelText, { fontSize: s.fontSize }]}>Lv {level}</Text>
        </View>
      </View>
      {size !== "small" && (
        <Text style={[styles.petName, { color: colors.textSecondary, fontSize: size === "large" ? 14 : 11 }]}>
          {petName}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: 4,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  glow: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  levelBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  levelText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
  },
  petName: {
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
});
