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
import { PetAvatar } from "@/components/PetAvatar";
import { AchievementBadge } from "@/components/AchievementBadge";
import { useApp } from "@/context/AppContext";

const AVATAR_COLORS = ["#2ECC71", "#3498DB", "#E74C3C", "#F39C12", "#9B59B6", "#1ABC9C"];

const FAMILY_TIPS = [
  {
    title: "Cook Together",
    desc: "Involve kids in meal prep — they're more likely to eat what they helped make!",
    icon: "chef-hat" as const,
    color: "#2ECC71",
  },
  {
    title: "Active Family Time",
    desc: "Replace 30 minutes of screen time with a family walk or bike ride.",
    icon: "bike" as const,
    color: "#4ECDC4",
  },
  {
    title: "Bedtime Routine",
    desc: "Consistent bedtimes improve sleep quality — aim for the same time nightly.",
    icon: "moon-waning-crescent" as const,
    color: "#9B59B6",
  },
  {
    title: "Model Good Habits",
    desc: "Children copy what they see. Eat fruits and veggies enthusiastically yourself!",
    icon: "heart-multiple" as const,
    color: "#E74C3C",
  },
];

export default function FamilyScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { profiles, activeProfile, setActiveProfile, achievements } = useApp();
  const isWeb = Platform.OS === "web";

  const profileAchievements = achievements.filter(
    (a) => a.profileId === activeProfile?.id
  );

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
        <Text style={[styles.title, { color: colors.text }]}>Family</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Manage profiles and track everyone's health
        </Text>
      </Animated.View>

      {/* Profiles Section */}
      <Animated.View entering={FadeInDown.delay(80).springify()}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Kids Profiles</Text>
          <Pressable
            onPress={() => router.push("/onboarding")}
            style={[styles.addBtn, { backgroundColor: colors.tint }]}
          >
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.addBtnText}>Add</Text>
          </Pressable>
        </View>

        {profiles.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
            <MaterialCommunityIcons name="account-child" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No profiles yet. Add a child to start!
            </Text>
            <Pressable
              onPress={() => router.push("/onboarding")}
              style={[styles.emptyBtn, { backgroundColor: colors.tint }]}
            >
              <Text style={styles.emptyBtnText}>Create First Profile</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.profilesList}>
            {profiles.map((profile) => {
              const isActive = activeProfile?.id === profile.id;
              return (
                <Pressable
                  key={profile.id}
                  onPress={() => setActiveProfile(profile)}
                  style={[
                    styles.profileCard,
                    {
                      backgroundColor: isActive ? colors.tint + "15" : colors.card,
                      borderColor: isActive ? colors.tint : colors.border,
                      borderWidth: isActive ? 2 : 1,
                    },
                  ]}
                >
                  <PetAvatar
                    mood={profile.petMood}
                    level={profile.petLevel}
                    petName={profile.petName}
                    size="small"
                  />
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={[styles.profileName, { color: colors.text }]}>{profile.name}</Text>
                    <Text style={[styles.profileAge, { color: colors.textSecondary }]}>
                      Age {profile.age}
                    </Text>
                    <View style={styles.profileStats}>
                      <MaterialCommunityIcons name="fire" size={12} color={colors.accent} />
                      <Text style={[styles.profileStat, { color: colors.accent }]}>
                        {profile.streakDays}d streak
                      </Text>
                      <MaterialCommunityIcons name="star" size={12} color={colors.tint} />
                      <Text style={[styles.profileStat, { color: colors.tint }]}>
                        {profile.totalPoints} pts
                      </Text>
                    </View>
                  </View>
                  {isActive && (
                    <View style={[styles.activeBadge, { backgroundColor: colors.tint }]}>
                      <Text style={styles.activeBadgeText}>Active</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}
      </Animated.View>

      {/* Achievements */}
      {activeProfile && (
        <Animated.View entering={FadeInDown.delay(160).springify()}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {activeProfile.name}'s Achievements
          </Text>
          {profileAchievements.length === 0 ? (
            <View style={[styles.achievementsEmpty, { backgroundColor: colors.card }]}>
              <MaterialCommunityIcons name="trophy-outline" size={40} color={colors.textTertiary} />
              <Text style={[styles.achievementsEmptyText, { color: colors.textSecondary }]}>
                Keep logging healthy habits to earn achievements!
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.achievementsList}
            >
              {profileAchievements.map((ach) => (
                <AchievementBadge key={ach.id} achievement={ach} />
              ))}
            </ScrollView>
          )}
        </Animated.View>
      )}

      {/* Family Challenges */}
      <Animated.View entering={FadeInDown.delay(220).springify()}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Family Challenge</Text>
        <View style={[styles.challengeCard, { backgroundColor: colors.tint + "12", borderColor: colors.tint + "30" }]}>
          <View style={styles.challengeHeader}>
            <MaterialCommunityIcons name="flag-checkered" size={24} color={colors.tint} />
            <Text style={[styles.challengeTitle, { color: colors.text }]}>
              Family Veggie Week
            </Text>
          </View>
          <Text style={[styles.challengeDesc, { color: colors.textSecondary }]}>
            Challenge: Every family member eats 5 fruits & veggies for 7 days straight!
          </Text>
          <View style={styles.challengeProgress}>
            {profiles.slice(0, 4).map((p, i) => (
              <View key={p.id} style={[styles.challengeAvatar, { backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] + "30" }]}>
                <Text style={[styles.challengeAvatarText, { color: AVATAR_COLORS[i % AVATAR_COLORS.length] }]}>
                  {p.name.charAt(0)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>

      {/* Parent Tips */}
      <Animated.View entering={FadeInDown.delay(280).springify()}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Parent Tips</Text>
        <View style={styles.tipsList}>
          {FAMILY_TIPS.map((tip) => (
            <View key={tip.title} style={[styles.tipCard, { backgroundColor: colors.card }]}>
              <View style={[styles.tipIcon, { backgroundColor: tip.color + "18" }]}>
                <MaterialCommunityIcons name={tip.icon} size={20} color={tip.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.tipTitle, { color: colors.text }]}>{tip.title}</Text>
                <Text style={[styles.tipDesc, { color: colors.textSecondary }]}>{tip.desc}</Text>
              </View>
            </View>
          ))}
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    marginBottom: 12,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addBtnText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  emptyCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    textAlign: "center",
  },
  emptyBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 4,
  },
  emptyBtnText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
  profilesList: {
    gap: 10,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
  },
  profileName: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  profileAge: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  profileStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  profileStat: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    marginRight: 4,
  },
  activeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
  },
  achievementsEmpty: {
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    gap: 10,
  },
  achievementsEmptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  achievementsList: {
    gap: 12,
    paddingRight: 4,
  },
  challengeCard: {
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
  },
  challengeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  challengeTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  challengeDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  challengeProgress: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  challengeAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  challengeAvatarText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  tipsList: {
    gap: 10,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tipTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    marginBottom: 2,
  },
  tipDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },
});
