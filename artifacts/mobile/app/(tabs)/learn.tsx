import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
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
import { EDUCATIONAL_CONTENT, QUIZ_QUESTIONS } from "@/constants/quiz";

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

export default function LearnScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const isWeb = Platform.OS === "web";

  const categories = ["all", "nutrition", "activity", "sleep", "health"];

  const filteredContent =
    activeCategory === "all"
      ? EDUCATIONAL_CONTENT
      : EDUCATIONAL_CONTENT.filter((c) => c.category === activeCategory);

  const quizCount = QUIZ_QUESTIONS.length;

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
        <Text style={[styles.title, { color: colors.text }]}>Learn</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Discover healthy habits through fun lessons
        </Text>
      </Animated.View>

      {/* Quiz Banner */}
      <Animated.View entering={FadeInDown.delay(80).springify()}>
        <Pressable
          onPress={() => router.push({ pathname: "/quiz/[id]", params: { id: "daily" } })}
          style={[styles.quizBanner, { backgroundColor: colors.accent + "20" }]}
        >
          <View style={[styles.quizIcon, { backgroundColor: colors.accent + "30" }]}>
            <MaterialCommunityIcons name="brain" size={28} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.quizTitle, { color: colors.text }]}>Health Quiz Challenge</Text>
            <Text style={[styles.quizSubtitle, { color: colors.textSecondary }]}>
              {quizCount} questions about nutrition, activity & sleep
            </Text>
          </View>
          <View style={[styles.quizBadge, { backgroundColor: colors.accent }]}>
            <Text style={styles.quizBadgeText}>Play</Text>
          </View>
        </Pressable>
      </Animated.View>

      {/* Category Filter */}
      <Animated.View entering={FadeInDown.delay(120).springify()}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const catColor = cat === "all" ? colors.tint : CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS];
            return (
              <Pressable
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isActive ? catColor : catColor + "18",
                  },
                ]}
              >
                {cat !== "all" && (
                  <MaterialCommunityIcons
                    name={CATEGORY_ICONS[cat]}
                    size={14}
                    color={isActive ? "#fff" : catColor}
                  />
                )}
                <Text
                  style={[
                    styles.categoryText,
                    { color: isActive ? "#fff" : catColor },
                  ]}
                >
                  {cat === "all" ? "All Topics" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* Content Cards */}
      <Animated.View entering={FadeInDown.delay(180).springify()} style={styles.contentList}>
        {filteredContent.map((content, i) => {
          const catColor = CATEGORY_COLORS[content.category];
          const catIcon = CATEGORY_ICONS[content.category];
          return (
            <Pressable
              key={content.id}
              onPress={() => router.push({ pathname: "/learn/[id]", params: { id: content.id } })}
              style={[styles.contentCard, { backgroundColor: colors.card }]}
            >
              <View style={[styles.contentIconBg, { backgroundColor: catColor + "18" }]}>
                <MaterialCommunityIcons name={catIcon} size={28} color={catColor} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={styles.contentMeta}>
                  <View style={[styles.categoryPill, { backgroundColor: catColor + "18" }]}>
                    <Text style={[styles.categoryPillText, { color: catColor }]}>
                      {content.category}
                    </Text>
                  </View>
                  <View style={styles.durationRow}>
                    <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                    <Text style={[styles.duration, { color: colors.textTertiary }]}>
                      {content.duration}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.contentTitle, { color: colors.text }]}>{content.title}</Text>
                <Text style={[styles.contentDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                  {content.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </Pressable>
          );
        })}
      </Animated.View>

      {/* Fun Facts */}
      <Animated.View entering={FadeInDown.delay(240).springify()}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Did You Know?</Text>
        <View style={[styles.factCard, { backgroundColor: colors.purple + "15", borderColor: colors.purple + "30" }]}>
          <MaterialCommunityIcons name="star-shooting" size={24} color={colors.purple} />
          <Text style={[styles.factText, { color: colors.text }]}>
            Your body grows the most while you sleep! Getting enough rest helps your brain remember what you learned today.
          </Text>
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
    gap: 20,
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
  quizBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 16,
  },
  quizIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  quizTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  quizSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    marginTop: 2,
  },
  quizBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quizBadgeText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  categories: {
    gap: 8,
    paddingRight: 4,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  contentList: {
    gap: 12,
  },
  contentCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  contentIconBg: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  contentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryPillText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    textTransform: "capitalize",
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  duration: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  contentTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
  contentDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    marginBottom: 4,
  },
  factCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  factText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});
