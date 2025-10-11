import { useState } from "react";
import { useGameData } from "../../context/useGameData";
import { Topbar } from "../MainPanel/Topbar";
import { PlayersTile } from "./PlayersTile";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { MdCheckCircle, MdError, MdSignalWifiOff } from "react-icons/md";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export const Dashboard = () => {
  const { gameData } = useGameData();
  const [copyStatus, setCopyStatus] = useState<boolean | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(null), 2000);
      },
      (err) => {
        console.error("Failed to copy to clipboard:", err);
        setCopyStatus(false);
        setTimeout(() => setCopyStatus(null), 2000);
      }
    );
  };

  // no-op: players list built on render from gameData when needed

  return (
    <div className="relative flex size-full flex-col gap-4">
      <Topbar header="Dashboard" />
      <div className="p-6">
        {gameData ? (
          <div className="flex gap-2">
            <PlayersTile playersFromGame={gameData.players} copyToClipboard={copyToClipboard} />
          </div>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MdSignalWifiOff className="size-16" />
              </EmptyMedia>
            </EmptyHeader>
            <EmptyTitle>Not Connected</EmptyTitle>
            <EmptyDescription>Not connected to a game server or demo file.</EmptyDescription>
          </Empty>
        )}
        {copyStatus !== null && (
          <Alert
            variant={copyStatus ? "default" : "destructive"}
            className="fixed top-8 left-1/2 w-auto -translate-x-1/2 z-50"
          >
            {copyStatus ? (
              <MdCheckCircle className="size-4" />
            ) : (
              <MdError className="size-4" />
            )}
            <AlertTitle>{copyStatus ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>
              {copyStatus ? "Copied successfully!" : "Failed to copy!"}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};
