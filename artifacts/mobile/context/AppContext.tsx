import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type PetMood = "happy" | "neutral" | "sad";

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatarColor: string;
  petName: string;
  petLevel: number;
  petMood: PetMood;
  streakDays: number;
  totalPoints: number;
  createdAt: string;
}

export interface DailyLog {
  id: string;
  profileId: string;
  date: string;
  fruitsVeggies: number;
  activityMinutes: number;
  sleepHours: number;
  screenTimeHours: number;
  waterGlasses: number;
  updatedAt: string;
}

export interface Goals {
  fruitsVeggies: number;
  activityMinutes: number;
  sleepHours: number;
  screenTimeHours: number;
  waterGlasses: number;
}

export interface Achievement {
  id: string;
  profileId: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  points: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: "nutrition" | "activity" | "sleep" | "health";
}

interface AppContextType {
  profiles: ChildProfile[];
  activeProfile: ChildProfile | null;
  setActiveProfile: (profile: ChildProfile) => void;
  todayLog: DailyLog | null;
  goals: Goals;
  achievements: Achievement[];
  isLoading: boolean;
  createProfile: (data: Omit<ChildProfile, "id" | "petLevel" | "petMood" | "streakDays" | "totalPoints" | "createdAt">) => Promise<void>;
  updateDailyLog: (field: keyof Omit<DailyLog, "id" | "profileId" | "date" | "updatedAt">, value: number) => Promise<void>;
  addAchievement: (achievement: Omit<Achievement, "id" | "earnedAt">) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_GOALS: Goals = {
  fruitsVeggies: 5,
  activityMinutes: 60,
  sleepHours: 10,
  screenTimeHours: 2,
  waterGlasses: 8,
};

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function calculatePetMood(log: DailyLog, goals: Goals): PetMood {
  let score = 0;
  if (log.fruitsVeggies >= goals.fruitsVeggies) score++;
  if (log.activityMinutes >= goals.activityMinutes) score++;
  if (log.sleepHours >= goals.sleepHours) score++;
  if (log.screenTimeHours <= goals.screenTimeHours) score++;
  if (log.waterGlasses >= goals.waterGlasses) score++;
  if (score >= 4) return "happy";
  if (score >= 2) return "neutral";
  return "sad";
}

function calculatePoints(log: DailyLog, goals: Goals): number {
  let pts = 0;
  if (log.fruitsVeggies >= goals.fruitsVeggies) pts += 20;
  if (log.activityMinutes >= goals.activityMinutes) pts += 20;
  if (log.sleepHours >= goals.sleepHours) pts += 15;
  if (log.screenTimeHours <= goals.screenTimeHours) pts += 15;
  if (log.waterGlasses >= goals.waterGlasses) pts += 15;
  return pts;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [activeProfile, setActiveProfileState] = useState<ChildProfile | null>(null);
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const goals = DEFAULT_GOALS;

  const loadData = useCallback(async () => {
    try {
      const [profilesRaw, activeIdRaw, achievementsRaw] = await Promise.all([
        AsyncStorage.getItem("profiles"),
        AsyncStorage.getItem("activeProfileId"),
        AsyncStorage.getItem("achievements"),
      ]);

      const loadedProfiles: ChildProfile[] = profilesRaw ? JSON.parse(profilesRaw) : [];
      const loadedAchievements: Achievement[] = achievementsRaw ? JSON.parse(achievementsRaw) : [];

      setProfiles(loadedProfiles);
      setAchievements(loadedAchievements);

      let active: ChildProfile | null = null;
      if (activeIdRaw && loadedProfiles.length > 0) {
        active = loadedProfiles.find((p) => p.id === activeIdRaw) ?? loadedProfiles[0];
      } else if (loadedProfiles.length > 0) {
        active = loadedProfiles[0];
      }
      setActiveProfileState(active);

      if (active) {
        const today = getTodayString();
        const logKey = `log_${active.id}_${today}`;
        const logRaw = await AsyncStorage.getItem(logKey);
        if (logRaw) {
          setTodayLog(JSON.parse(logRaw));
        } else {
          const newLog: DailyLog = {
            id: generateId(),
            profileId: active.id,
            date: today,
            fruitsVeggies: 0,
            activityMinutes: 0,
            sleepHours: 0,
            screenTimeHours: 0,
            waterGlasses: 0,
            updatedAt: new Date().toISOString(),
          };
          setTodayLog(newLog);
          await AsyncStorage.setItem(logKey, JSON.stringify(newLog));
        }
      }
    } catch (e) {
      console.error("Error loading data:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const setActiveProfile = useCallback(async (profile: ChildProfile) => {
    setActiveProfileState(profile);
    await AsyncStorage.setItem("activeProfileId", profile.id);

    const today = getTodayString();
    const logKey = `log_${profile.id}_${today}`;
    const logRaw = await AsyncStorage.getItem(logKey);
    if (logRaw) {
      setTodayLog(JSON.parse(logRaw));
    } else {
      const newLog: DailyLog = {
        id: generateId(),
        profileId: profile.id,
        date: today,
        fruitsVeggies: 0,
        activityMinutes: 0,
        sleepHours: 0,
        screenTimeHours: 0,
        waterGlasses: 0,
        updatedAt: new Date().toISOString(),
      };
      setTodayLog(newLog);
      await AsyncStorage.setItem(logKey, JSON.stringify(newLog));
    }
  }, []);

  const createProfile = useCallback(
    async (data: Omit<ChildProfile, "id" | "petLevel" | "petMood" | "streakDays" | "totalPoints" | "createdAt">) => {
      const newProfile: ChildProfile = {
        ...data,
        id: generateId(),
        petLevel: 1,
        petMood: "neutral",
        streakDays: 0,
        totalPoints: 0,
        createdAt: new Date().toISOString(),
      };
      const updated = [...profiles, newProfile];
      setProfiles(updated);
      await AsyncStorage.setItem("profiles", JSON.stringify(updated));
      await setActiveProfile(newProfile);
    },
    [profiles, setActiveProfile]
  );

  const updateDailyLog = useCallback(
    async (field: keyof Omit<DailyLog, "id" | "profileId" | "date" | "updatedAt">, value: number) => {
      if (!activeProfile || !todayLog) return;

      const updated: DailyLog = {
        ...todayLog,
        [field]: value,
        updatedAt: new Date().toISOString(),
      };
      setTodayLog(updated);

      const today = getTodayString();
      const logKey = `log_${activeProfile.id}_${today}`;
      await AsyncStorage.setItem(logKey, JSON.stringify(updated));

      // Update pet mood and points
      const mood = calculatePetMood(updated, goals);
      const points = calculatePoints(updated, goals);
      const updatedProfiles = profiles.map((p) =>
        p.id === activeProfile.id
          ? { ...p, petMood: mood, totalPoints: p.totalPoints + Math.max(0, points - calculatePoints(todayLog, goals)) }
          : p
      );
      setProfiles(updatedProfiles);
      setActiveProfileState((prev) =>
        prev?.id === activeProfile.id ? { ...prev, petMood: mood } : prev
      );
      await AsyncStorage.setItem("profiles", JSON.stringify(updatedProfiles));
    },
    [activeProfile, todayLog, profiles, goals]
  );

  const addAchievement = useCallback(
    async (data: Omit<Achievement, "id" | "earnedAt">) => {
      const achievement: Achievement = {
        ...data,
        id: generateId(),
        earnedAt: new Date().toISOString(),
      };
      const updated = [...achievements, achievement];
      setAchievements(updated);
      await AsyncStorage.setItem("achievements", JSON.stringify(updated));
    },
    [achievements]
  );

  return (
    <AppContext.Provider
      value={{
        profiles,
        activeProfile,
        setActiveProfile,
        todayLog,
        goals,
        achievements,
        isLoading,
        createProfile,
        updateDailyLog,
        addAchievement,
        refreshData: loadData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
