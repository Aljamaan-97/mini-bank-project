// /app/theme/ThemeProvider.tsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { darkColors, lightColors } from "./colors";

type ThemeType = typeof lightColors;

interface ThemeContextProps {
  colors: ThemeType;
  scheme: ColorSchemeName;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  colors: lightColors,
  scheme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // نقرأ إعداد الثيم الافتراضي من نظام التشغيل
  const [scheme, setScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme() || "light"
  );

  // نختار ألوان الثيم بناءً على القيمة الحالية
  const colors = scheme === "dark" ? darkColors : lightColors;

  useEffect(() => {
    // نضيف مستمعاً لتغيّر إعداد الثيم في نظام التشغيل
    const subscription = Appearance.addChangeListener(
      ({ colorScheme }: { colorScheme: ColorSchemeName | null }) => {
        setScheme(colorScheme || "light");
      }
    );
    // عند التنظيف، نلغي الاشتراك عبر subscription.remove()
    return () => {
      subscription.remove();
    };
  }, []);

  // دالة التبديل اليدوي بين Light و Dark
  const toggleTheme = () => {
    setScheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ colors, scheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
