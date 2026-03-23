import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import * as Haptics from "expo-haptics";

const AVATAR_COLORS = [
  "#2ECC71", "#3498DB", "#E74C3C", "#F39C12",
  "#9B59B6", "#1ABC9C", "#E67E22", "#2980B9",
];

const PET_NAMES = ["Sunny", "Leafy", "Bouncy", "Sparky", "Mochi", "Coco", "Luna", "Bolt"];

export default function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { createProfile } = useApp();

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState(8);
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [petName, setPetName] = useState(PET_NAMES[0]);

  const isWeb = Platform.OS === "web";

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (step < 3) setStep(step + 1);
    else handleCreate();
  };

  const handleCreate = async () => {
    await createProfile({ name: name || "Champion", age, avatarColor, petName });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/");
  };

  const canProceed = step === 0 ? name.trim().length > 0 : true;

  const steps = ["Name", "Age", "Appearance", "Pet"];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: isWeb ? insets.top + 67 : insets.top + 24,
            paddingBottom: isWeb ? 34 : insets.bottom + 24,
          },
        ]}
        style={[styles.root, { backgroundColor: colors.background }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <Pressable
          onPress={() => (step > 0 ? setStep(step - 1) : router.back())}
          hitSlop={16}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>

        {/* Progress */}
        <View style={styles.progressRow}>
          {steps.map((s, i) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    i <= step ? colors.tint : colors.borderLight,
                  width: i === step ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Step 0: Name */}
        {step === 0 && (
          <Animated.View entering={FadeInDown.springify()} style={styles.stepContent}>
            <LinearGradient
              colors={isDark ? ["#1F3A1F", "#0F1A0F"] : ["#E8F8EE", colors.background]}
              style={styles.stepGradient}
            />
            <MaterialCommunityIcons name="hand-wave" size={56} color={colors.tint} />
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              What's your name?
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
              Let's personalize your health journey!
            </Text>
            <TextInput
              style={[
                styles.nameInput,
                {
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Enter your name..."
              placeholderTextColor={colors.textTertiary}
              value={name}
              onChangeText={setName}
              autoFocus
              returnKeyType="next"
              onSubmitEditing={handleNext}
              fontFamily="Inter_600SemiBold"
            />
          </Animated.View>
        )}

        {/* Step 1: Age */}
        {step === 1 && (
          <Animated.View entering={FadeInDown.springify()} style={styles.stepContent}>
            <MaterialCommunityIcons name="cake-variant" size={56} color={colors.accent} />
            <Text style={[styles.stepTitle, { color: colors.text }]}>How old are you?</Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
              Your goals are personalized for your age group.
            </Text>
            <View style={styles.agePicker}>
              <Pressable
                onPress={() => { setAge(Math.max(4, age - 1)); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                style={[styles.ageBtn, { backgroundColor: colors.backgroundTertiary }]}
              >
                <Ionicons name="remove" size={28} color={colors.text} />
              </Pressable>
              <View style={styles.ageValueBox}>
                <Text style={[styles.ageValue, { color: colors.tint }]}>{age}</Text>
                <Text style={[styles.ageUnit, { color: colors.textSecondary }]}>years old</Text>
              </View>
              <Pressable
                onPress={() => { setAge(Math.min(17, age + 1)); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                style={[styles.ageBtn, { backgroundColor: colors.backgroundTertiary }]}
              >
                <Ionicons name="add" size={28} color={colors.text} />
              </Pressable>
            </View>
          </Animated.View>
        )}

        {/* Step 2: Avatar Color */}
        {step === 2 && (
          <Animated.View entering={FadeInDown.springify()} style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Pick your color!</Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
              Choose a color that represents you.
            </Text>
            <View style={[styles.avatarPreview, { backgroundColor: avatarColor + "20", borderColor: avatarColor }]}>
              <MaterialCommunityIcons name="account-circle" size={72} color={avatarColor} />
              <Text style={[styles.avatarName, { color: avatarColor }]}>{name || "Champion"}</Text>
            </View>
            <View style={styles.colorGrid}>
              {AVATAR_COLORS.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => { setAvatarColor(color); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color },
                    avatarColor === color && styles.colorSwatchSelected,
                  ]}
                >
                  {avatarColor === color && (
                    <Ionicons name="checkmark" size={18} color="#fff" />
                  )}
                </Pressable>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Step 3: Pet Name */}
        {step === 3 && (
          <Animated.View entering={FadeInDown.springify()} style={styles.stepContent}>
            <MaterialCommunityIcons name="emoticon-excited-outline" size={56} color={colors.accent} />
            <Text style={[styles.stepTitle, { color: colors.text }]}>Name your pet!</Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
              Your virtual pet grows healthier as you meet your daily goals!
            </Text>
            <View style={styles.petNamesGrid}>
              {PET_NAMES.map((pn) => (
                <Pressable
                  key={pn}
                  onPress={() => { setPetName(pn); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                  style={[
                    styles.petNameChip,
                    {
                      backgroundColor: petName === pn ? colors.tint : colors.backgroundTertiary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.petNameText,
                      { color: petName === pn ? "#fff" : colors.text },
                    ]}
                  >
                    {pn}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        )}

        {/* CTA Button */}
        <Pressable
          onPress={handleNext}
          disabled={!canProceed}
          style={[
            styles.nextBtn,
            {
              backgroundColor: canProceed ? colors.tint : colors.borderLight,
            },
          ]}
        >
          <Text style={[styles.nextBtnText, { color: canProceed ? "#fff" : colors.textTertiary }]}>
            {step === 3 ? "Start My Journey!" : "Continue"}
          </Text>
          {step < 3 && (
            <Ionicons
              name="arrow-forward"
              size={20}
              color={canProceed ? "#fff" : colors.textTertiary}
            />
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    gap: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  progressRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
  },
  stepGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    margin: -24,
  },
  stepContent: {
    flex: 1,
    alignItems: "center",
    gap: 20,
    paddingVertical: 16,
    position: "relative",
  },
  stepTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    textAlign: "center",
  },
  stepSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
  nameInput: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  agePicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginTop: 8,
  },
  ageBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  ageValueBox: {
    alignItems: "center",
    minWidth: 100,
  },
  ageValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 64,
    lineHeight: 72,
  },
  ageUnit: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
  },
  avatarPreview: {
    borderRadius: 24,
    borderWidth: 2,
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  avatarName: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    justifyContent: "center",
  },
  colorSwatch: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  petNamesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  petNameChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  petNameText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    paddingVertical: 18,
    marginTop: 8,
  },
  nextBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
  },
});
