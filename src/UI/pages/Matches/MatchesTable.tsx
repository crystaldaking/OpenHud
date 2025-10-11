import { MdPlayArrow, MdCancel, MdDelete, MdEdit, MdSwapHoriz } from "react-icons/md";
import { apiUrl } from "../../api/api";
import { useMatches, useTeams } from "../../hooks";
import useGameData from "../../context/useGameData";
import { canReverseSides } from "./matchUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface MatchTableProps {
  onEdit: (match: Match) => void;
}

export const MatchesTable = ({ onEdit }: MatchTableProps) => {
  const {
    filteredMatches,
    deleteMatch,
    handleStartMatch,
    handleStopMatch,
    currentMatch,
    updateMatch,
  } = useMatches();
  const { teams } = useTeams();
  const { gameData } = useGameData();

  const handleReverseSides = async (match: Match) => {
    try {
      if (!gameData?.map?.name) return;
      const mapName = gameData.map.name.substring(
        gameData.map.name.lastIndexOf("/") + 1,
      );
      const veto = match.vetos.find((v) => v.mapName === mapName);
      if (!veto) return;
      const updatedVetos = match.vetos.map((v) =>
        v.mapName === mapName ? { ...v, reverseSide: !v.reverseSide } : v,
      );
      const updatedMatch: Match = { ...match, vetos: updatedVetos };
      await updateMatch(match.id, updatedMatch);
    } catch (err) {
      console.error("Failed to reverse sides on veto:", err);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Match</TableHead>
          <TableHead className="text-center">Type</TableHead>
          <TableHead className="text-center">Score</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredMatches.map((match: Match) => {
          const teamOne = teams.find((t) => t._id === match.left.id);
          const teamTwo = teams.find((t) => t._id === match.right.id);
          return (
            <TableRow key={match.id}>
              <TableCell className="font-semibold">
                {teamOne?.name} vs {teamTwo?.name}
                {match.current && (
                  <span className="ml-4 font-semibold text-destructive">LIVE</span>
                )}
              </TableCell>
              <TableCell className="text-center font-semibold uppercase text-muted-foreground">
                {match.matchType}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2 font-semibold">
                  {teamOne && (
                    <img
                      src={`${apiUrl}/teams/logo/${teamOne._id}?t=${new Date().getTime()}`}
                      alt={`${teamOne.name} Logo`}
                      className="size-12"
                    />
                  )}
                  <span>
                    {match.left.wins} - {match.right.wins}
                  </span>
                  {teamTwo && (
                    <img
                      src={`${apiUrl}/teams/logo/${teamTwo._id}?t=${new Date().getTime()}`}
                      alt={`${teamTwo.name} Logo`}
                      className="size-12"
                    />
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="inline-flex gap-1">
                  {match.current ? (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => handleStopMatch(match.id)}>
                            <MdCancel className="size-6 text-destructive" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Stop Match</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleReverseSides(match)}
                            disabled={!canReverseSides(match, gameData)}
                          >
                            <MdSwapHoriz className="size-6" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Reverse sides for current map veto</TooltipContent>
                      </Tooltip>
                    </>
                  ) : !currentMatch || currentMatch.id === match.id ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => handleStartMatch(match.id)}>
                          <MdPlayArrow className="size-6" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Start Match</TooltipContent>
                    </Tooltip>
                  ) : null}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => onEdit(match)}>
                        <MdEdit className="size-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit Match</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => deleteMatch(match.id)}>
                        <MdDelete className="size-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete Match</TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

