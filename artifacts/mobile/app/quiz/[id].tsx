import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
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
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  ZoomIn,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { QUIZ_QUESTIONS } from "@/constants/quiz";
import { useApp } from "@/context/AppContext";

export default function QuizScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { activeProfile, addAchievement } = useApp();
  const isWeb = Platform.OS === "web";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; index: number }[]>([]);

  const questions = QUIZ_QUESTIONS.slice(0, 5); // Show 5 questions per session
  const current = questions[currentIndex];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const isCorrect = index === current.correctIndex;
    if (isCorrect) {
      setScore(score + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setAnswers([...answers, { correct: isCorrect, index }]);
  };

  const handleNext = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      setFinished(true);
      // Award achievement if perfect score
      if (score === questions.length && activeProfile) {
        await addAchievement({
          profileId: activeProfile.id,
          type: "health",
          title: "Quiz Master",
          description: "Perfect score on the health quiz!",
          icon: "brain",
          points: 50,
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  };

  const scorePercent = Math.round((score / questions.length) * 100);

  if (finished) {
    return (
      <View
        style={[styles.root, { backgroundColor: colors.background }]}
      >
        <ScrollView
          contentContainerStyle={[
            styles.finishScroll,
            {
              paddingTop: isWeb ? insets.top + 67 : insets.top + 40,
              paddingBottom: isWeb ? 60 : insets.bottom + 40,
            },
          ]}
        >
          <Animated.View entering={ZoomIn.springify()} style={styles.finishIcon}>
            <MaterialCommunityIcons
              name={scorePercent >= 80 ? "trophy" : scorePercent >= 60 ? "medal" : "emoticon-neutral-outline"}
              size={72}
              color={scorePercent >= 80 ? colors.accent : scorePercent >= 60 ? colors.tint : colors.textSecondary}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).springify()} style={{ alignItems: "center", gap: 8 }}>
            <Text style={[styles.finishTitle, { color: colors.text }]}>
              {scorePercent >= 80 ? "Amazing!" : scorePercent >= 60 ? "Well done!" : "Keep learning!"}
            </Text>
            <Text style={[styles.finishScore, { color: colors.tint }]}>
              {score}/{questions.length} correct
            </Text>
            <Text style={[styles.finishPercent, { color: colors.textSecondary }]}>
              {scorePercent}% accuracy
            </Text>
          </Animated.View>

          {/* Answer Review */}
          <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.reviewList}>
            {questions.map((q, i) => {
              const a = answers[i];
              return (
                <View
                  key={q.id}
                  style={[
                    styles.reviewItem,
                    {
                      backgroundColor: a?.correct
                        ? colors.tint + "18"
                        : colors.coral + "18",
                    },
                  ]}
                >
                  <Ionicons
                    name={a?.correct ? "checkmark-circle" : "close-circle"}
                    size={20}
                    color={a?.correct ? colors.tint : colors.coral}
                  />
                  <Text style={[styles.reviewText, { color: colors.text }]} numberOfLines={2}>
                    {q.question}
                  </Text>
                </View>
              );
            })}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.finishBtns}>
            <Pressable
              onPress={handleRestart}
              style={[styles.finishBtn, { backgroundColor: colors.tint }]}
            >
              <MaterialCommunityIcons name="refresh" size={18} color="#fff" />
              <Text style={styles.finishBtnText}>Try Again</Text>
            </Pressable>
            <Pressable
              onPress={() => router.back()}
              style={[styles.finishBtnOutline, { borderColor: colors.border }]}
            >
              <Text style={[styles.finishBtnOutlineText, { color: colors.text }]}>Back to Learn</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: isWeb ? insets.top + 67 : insets.top + 20,
            paddingBottom: isWeb ? 60 : insets.bottom + 40,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.quizHeader}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBg, { backgroundColor: colors.borderLight }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${((currentIndex) / questions.length) * 100}%`,
                    backgroundColor: colors.tint,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {currentIndex + 1}/{questions.length}
            </Text>
          </View>
          <View style={[styles.scoreBadge, { backgroundColor: colors.tint + "20" }]}>
            <MaterialCommunityIcons name="star" size={14} color={colors.tint} />
            <Text style={[styles.scoreBadgeText, { color: colors.tint }]}>{score}</Text>
          </View>
        </View>

        {/* Category Badge */}
        <Animated.View
          key={`cat-${currentIndex}`}
          entering={FadeIn.duration(300)}
          style={[
            styles.catBadge,
            { backgroundColor: colors.tint + "18", alignSelf: "flex-start" },
          ]}
        >
          <Text style={[styles.catText, { color: colors.tint }]}>
            {current.category.charAt(0).toUpperCase() + current.category.slice(1)}
          </Text>
        </Animated.View>

        {/* Question */}
        <Animated.View
          key={`q-${currentIndex}`}
          entering={FadeInDown.springify()}
        >
          <Text style={[styles.questionText, { color: colors.text }]}>
            {current.question}
          </Text>
        </Animated.View>

        {/* Options */}
        <Animated.View
          key={`opts-${currentIndex}`}
          entering={FadeInDown.delay(80).springify()}
          style={styles.optionsList}
        >
          {current.options.map((option, i) => {
            const isSelected = selectedAnswer === i;
            const isCorrect = i === current.correctIndex;
            const showResult = selectedAnswer !== null;

            let bgColor = colors.card;
            let borderColor = colors.border;
            let textColor = colors.text;

            if (showResult) {
              if (isCorrect) {
                bgColor = colors.tint + "18";
                borderColor = colors.tint;
                textColor = colors.tint;
              } else if (isSelected && !isCorrect) {
                bgColor = colors.coral + "18";
                borderColor = colors.coral;
                textColor = colors.coral;
              }
            } else if (isSelected) {
              bgColor = colors.tint + "18";
              borderColor = colors.tint;
            }

            return (
              <Pressable
                key={i}
                onPress={() => handleAnswer(i)}
                style={[
                  styles.optionBtn,
                  { backgroundColor: bgColor, borderColor },
                ]}
                disabled={selectedAnswer !== null}
              >
                <View style={[styles.optionLetter, { backgroundColor: borderColor + "30" }]}>
                  <Text style={[styles.optionLetterText, { color: borderColor }]}>
                    {String.fromCharCode(65 + i)}
                  </Text>
                </View>
                <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
                {showResult && isCorrect && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.tint} />
                )}
                {showResult && isSelected && !isCorrect && (
                  <Ionicons name="close-circle" size={20} color={colors.coral} />
                )}
              </Pressable>
            );
          })}
        </Animated.View>

        {/* Explanation */}
        {selectedAnswer !== null && (
          <Animated.View
            entering={FadeInDown.springify()}
            style={[
              styles.explanation,
              {
                backgroundColor:
                  selectedAnswer === current.correctIndex
                    ? colors.tint + "15"
                    : colors.coral + "15",
              },
            ]}
          >
            <MaterialCommunityIcons
              name={selectedAnswer === current.correctIndex ? "lightbulb-on" : "lightbulb"}
              size={20}
              color={
                selectedAnswer === current.correctIndex ? colors.tint : colors.coral
              }
            />
            <Text style={[styles.explanationText, { color: colors.text }]}>
              {current.explanation}
            </Text>
          </Animated.View>
        )}

        {/* Next Button */}
        {selectedAnswer !== null && (
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <Pressable
              onPress={handleNext}
              style={[styles.nextBtn, { backgroundColor: colors.tint }]}
            >
              <Text style={styles.nextBtnText}>
                {currentIndex + 1 < questions.length ? "Next Question" : "See Results"}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 24,
    gap: 20,
    flexGrow: 1,
  },
  finishScroll: {
    paddingHorizontal: 24,
    gap: 24,
    alignItems: "center",
    flexGrow: 1,
  },
  quizHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressContainer: {
    flex: 1,
    gap: 6,
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
  progressText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    textAlign: "right",
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreBadgeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  catBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  catText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
  questionText: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    lineHeight: 30,
  },
  optionsList: {
    gap: 10,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  optionLetterText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  optionText: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    flex: 1,
    lineHeight: 20,
  },
  explanation: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 14,
  },
  explanationText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  nextBtnText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 17,
  },
  finishIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  finishTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    textAlign: "center",
  },
  finishScore: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    textAlign: "center",
  },
  finishPercent: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    textAlign: "center",
  },
  reviewList: {
    width: "100%",
    gap: 8,
  },
  reviewItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 12,
  },
  reviewText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  finishBtns: {
    width: "100%",
    gap: 10,
    marginTop: 8,
  },
  finishBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  finishBtnText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 17,
  },
  finishBtnOutline: {
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
  },
  finishBtnOutlineText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
  },
});
