import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { EDUCATIONAL_CONTENT } from "@/constants/quiz";

const CATEGORY_COLORS = {
  nutrition: "#2ECC71",
  activity: "#4ECDC4",
  sleep: "#9B59B6",
  health: "#E74C3C",
};

const CATEGORY_ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  nutrition: "food-apple",
  activity: "run-fast",
  sleep: "sleep",
  health: "heart-pulse",
};

export default function LearnDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const content = EDUCATIONAL_CONTENT.find((c) => c.id === id);

  if (!content) {
    return (
      <View style={[styles.error, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Content not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backLink, { color: colors.tint }]}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const catColor = CATEGORY_COLORS[content.category];
  const catIcon = CATEGORY_ICONS[content.category];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: isWeb ? insets.top + 67 : insets.top + 16,
            paddingBottom: isWeb ? 60 : insets.bottom + 40,
          },
        ]}
      >
        {/* Back */}
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
          <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
        </Pressable>

        {/* Hero */}
        <Animated.View entering={FadeInDown.delay(0).springify()}>
          <View
            style={[
              styles.heroCard,
              { backgroundColor: catColor + "18" },
            ]}
          >
            <View style={[styles.heroIcon, { backgroundColor: catColor + "25" }]}>
              <MaterialCommunityIcons name={catIcon} size={48} color={catColor} />
            </View>
            <View style={[styles.categoryTag, { backgroundColor: catColor }]}>
              <Text style={styles.categoryTagText}>{content.category}</Text>
            </View>
            <Text style={[styles.heroTitle, { color: colors.text }]}>{content.title}</Text>
            <Text style={[styles.heroDesc, { color: colors.textSecondary }]}>
              {content.description}
            </Text>
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={14} color={catColor} />
              <Text style={[styles.metaText, { color: catColor }]}>{content.duration} read</Text>
            </View>
          </View>
        </Animated.View>

        {/* Tips List */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Text style={[styles.tipsTitle, { color: colors.text }]}>Key Takeaways</Text>
          <View style={styles.tipsList}>
            {content.tips.map((tip, i) => (
              <Animated.View
                key={i}
                entering={FadeInDown.delay(120 + i * 60).springify()}
                style={[styles.tipItem, { backgroundColor: colors.card }]}
              >
                <View style={[styles.tipNumber, { backgroundColor: catColor }]}>
                  <Text style={styles.tipNumberText}>{i + 1}</Text>
                </View>
                <Text style={[styles.tipText, { color: colors.text }]}>{tip}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Quiz CTA */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Pressable
            onPress={() => router.push({ pathname: "/quiz/[id]", params: { id: "daily" } })}
            style={[styles.quizCTA, { backgroundColor: colors.accent + "18", borderColor: colors.accent + "40" }]}
          >
            <MaterialCommunityIcons name="brain" size={24} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.quizCTATitle, { color: colors.text }]}>Test Your Knowledge</Text>
              <Text style={[styles.quizCTADesc, { color: colors.textSecondary }]}>
                Take the health quiz and earn points!
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.accent} />
          </Pressable>
        </Animated.View>
      </ScrollView>
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
  error: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
  },
  backLink: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
  },
  backText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  heroCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  heroIcon: {
    width: 88,
    height: 88,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryTagText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    textTransform: "capitalize",
  },
  heroTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    textAlign: "center",
  },
  heroDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  tipsTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    marginBottom: 4,
  },
  tipsList: {
    gap: 10,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tipNumberText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
  tipText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  quizCTA: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  quizCTATitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
  quizCTADesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    marginTop: 2,
  },
});
