import React from "react";
import { PlayersProvider } from "../pages/Players/PlayersContext";
import { MatchesProvider } from "../pages/Matches/MatchesContext";
import { TeamsProvider } from "../pages/Teams/TeamsContext";
import { CoachesProvider } from "../pages/Coaches/CoachesContext";
import { GameDataProvider } from "./GameDataContext";
import { ThemeProvider } from "@/components/theme-provider";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeProvider>
      <CoachesProvider>
        <GameDataProvider>
            <MatchesProvider>
              <PlayersProvider>
                  <TeamsProvider>{children}</TeamsProvider>
              </PlayersProvider>
            </MatchesProvider>
        </GameDataProvider>
      </CoachesProvider>
    </ThemeProvider>
  );
};
