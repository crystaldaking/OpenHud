import React, { useState } from "react";
import { PlayerForm } from "../Players/PlayersForm"; // Assuming this is correct
import { CoachForm } from "../Coaches/CoachesForm";
import { usePlayers } from "../Players/usePlayers";
import { useCoaches } from "../Coaches/useCoaches";
import { MdContentCopy, MdEdit, MdPersonAdd, MdSports } from "react-icons/md";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type ConnectedPlayer = {
  name: string;
  steamid: string;
  team?: { side?: string };
};

interface PlayersTileProps {
  playersFromGame: ConnectedPlayer[];
  copyToClipboard: (text: string) => void;
}

const PlayerEntry = ({
  player,
  hasPlayer,
  hasCoach,
  onPlayerAction,
  onCoachAction,
  onCopy,
}: {
  player: ConnectedPlayer;
  hasPlayer: boolean;
  hasCoach: boolean;
  onPlayerAction: () => void;
  onCoachAction: () => void;
  onCopy: () => void;
}) => (
  <div
    className="flex items-center justify-between rounded-lg border bg-card px-3 py-2 hover:bg-muted/50"
    key={player.steamid}
  >
    <div className="min-w-0">
      <div className="truncate font-semibold">{player.name}</div>
      <button
        type="button"
        title="Copy SteamID"
        className="mt-1 inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-xs text-muted-foreground hover:bg-accent"
        onClick={onCopy}
      >
        <MdContentCopy className="size-3.5" />
        <span className="truncate max-w-[140px] md:max-w-[200px]">{player.steamid}</span>
      </button>
    </div>
    <div className="ml-3 flex shrink-0 items-center gap-1">
      {!hasCoach && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8" onClick={onPlayerAction}>
              {hasPlayer ? <MdEdit className="size-4" /> : <MdPersonAdd className="size-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{hasPlayer ? "Edit Player" : "Create Player"}</TooltipContent>
        </Tooltip>
      )}
      {!hasPlayer && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8" onClick={onCoachAction}>
              {hasCoach ? <MdEdit className="size-4" /> : <MdSports className="size-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{hasCoach ? "Edit Coach" : "Add as Coach"}</TooltipContent>
        </Tooltip>
      )}
    </div>
  </div>
);

const PlayerTeamColumn = ({
  label,
  list,
  ...props
}: {
  label: string;
  list: ConnectedPlayer[];
  [key: string]: any;
}) => {
  const { players, setSelectedPlayer, setIsEditing } = usePlayers();
  const { coaches, setSelectedCoach, setIsEditing: setCoachIsEditing } = useCoaches();

  return (
    <Card>
      <CardHeader >
        <CardTitle className="flex items-center gap-2">{label} <Badge variant="outline">{list.length}</Badge></CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {list.map((connectedPlayer) => (
          <PlayerEntry
            key={connectedPlayer.steamid}
            player={connectedPlayer}
            hasPlayer={players.some((p) => p.steamid === connectedPlayer.steamid)}
            hasCoach={coaches.some((c) => c.steamid === connectedPlayer.steamid)}
            onPlayerAction={() => props.onPlayerAction(connectedPlayer)}
            onCoachAction={() => props.onCoachAction(connectedPlayer)}
            onCopy={() => props.copyToClipboard(connectedPlayer.steamid)}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export const PlayersTile = ({ playersFromGame, copyToClipboard }: PlayersTileProps) => {
  const { players, setSelectedPlayer, setIsEditing } = usePlayers();
  const { coaches, setSelectedCoach, setIsEditing: setCoachIsEditing } = useCoaches();

  const [openPlayerForm, setOpenPlayerForm] = useState(false);
  const [playerPrefill, setPlayerPrefill] = useState<{ username?: string; steamId?: string }>();
  const [openCoachForm, setOpenCoachForm] = useState(false);
  const [coachPrefill, setCoachPrefill] = useState<{ name?: string; steamid?: string; teamId?: string }>();

  const handlePlayerAction = (connectedPlayer: ConnectedPlayer) => {
    const existing = players.find((p) => p.steamid === connectedPlayer.steamid);
    if (existing) {
      setSelectedPlayer(existing);
      setIsEditing(true);
      setPlayerPrefill(undefined);
    } else {
      setIsEditing(false);
      setPlayerPrefill({ username: connectedPlayer.name, steamId: connectedPlayer.steamid });
    }
    setOpenPlayerForm(true);
  };

  const handleCoachAction = (connectedPlayer: ConnectedPlayer) => {
    const existingCoach = coaches.find((c) => c.steamid === connectedPlayer.steamid);
    if (existingCoach) {
      setSelectedCoach(existingCoach);
      setCoachIsEditing(true);
      setCoachPrefill(undefined);
    } else {
      setCoachIsEditing(false);
      setCoachPrefill({ name: connectedPlayer.name, steamid: connectedPlayer.steamid });
    }
    setOpenCoachForm(true);
  };

  const ctPlayers = playersFromGame.filter((p) => (p.team?.side || "").toUpperCase() === "CT");
  const tPlayers = playersFromGame.filter((p) => (p.team?.side || "").toUpperCase() === "T");

  return (
    <>
      <PlayerForm open={openPlayerForm} setOpen={setOpenPlayerForm} prefill={playerPrefill} />
      <CoachForm open={openCoachForm} setOpen={setOpenCoachForm} prefill={coachPrefill} />
      <PlayerTeamColumn
        label="Counter-Terrorist"
        list={ctPlayers}
        onPlayerAction={handlePlayerAction}
        onCoachAction={handleCoachAction}
        copyToClipboard={copyToClipboard}
      />
      <PlayerTeamColumn
        label="Terrorist"
        list={tPlayers}
        onPlayerAction={handlePlayerAction}
        onCoachAction={handleCoachAction}
        copyToClipboard={copyToClipboard}
      />
    </>
  );
};
