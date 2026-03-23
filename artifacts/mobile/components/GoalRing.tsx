import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface GoalRingProps {
  current: number;
  goal: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  label?: string;
  unit?: string;
  showValues?: boolean;
}

export function GoalRing({
  current,
  goal,
  color,
  size = 72,
  strokeWidth = 7,
  label,
  unit = "",
  showValues = true,
}: GoalRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / Math.max(goal, 1), 1);

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, animatedProgress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  const isComplete = current >= goal;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color + "25"}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isComplete ? color : color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {showValues && (
        <View style={[StyleSheet.absoluteFill, styles.center]}>
          <Text style={[styles.value, { color }]}>
            {current}
            <Text style={[styles.unit, { color }]}>{unit}</Text>
          </Text>
          {label && <Text style={[styles.label, { color: color + "AA" }]}>{label}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    textAlign: "center",
  },
  unit: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
  },
  label: {
    fontFamily: "Inter_400Regular",
    fontSize: 9,
    textAlign: "center",
    marginTop: 1,
  },
});
