import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, Theme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes: { key: Theme; label: string; icon: typeof Sun }[] = [
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
  { key: "blue", label: "Blue", icon: Monitor },
];

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const current = themes.find((t) => t.key === theme) || themes[2];
  const Icon = current.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Icon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.key}
            onClick={() => setTheme(t.key)}
            className={theme === t.key ? "bg-accent" : ""}
          >
            <t.icon className="h-4 w-4 mr-2" />
            {t.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
