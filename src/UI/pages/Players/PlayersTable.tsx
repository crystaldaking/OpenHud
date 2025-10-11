import { MdDelete, MdEdit } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { usePlayers } from "../../hooks";
import { apiUrl } from "../../api/api";
import { PlayerSilhouette } from "./PlayersPage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface PlayersTableProps {
  setOpenState: (open: boolean) => void;
}

export const PlayersTable = ({ setOpenState }: PlayersTableProps) => {
  const {
    filteredPlayers,
    deletePlayer,
    setIsEditing,
    setSelectedPlayer,
  } = usePlayers();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Avatar</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>SteamID</TableHead>
          <TableHead>Team</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredPlayers.map((player: Player) => (
          <TableRow key={player._id}>
            <TableCell>
              <img
                src={
                  player.avatar
                    ? `${apiUrl}/players/avatar/${player._id}?t=${new Date().getTime()}`
                    : PlayerSilhouette
                }
                alt="Player avatar"
                className="size-20"
              />
            </TableCell>
            <TableCell className="font-semibold">{player.username}</TableCell>
            <TableCell>
              {player.firstName} {player.lastName}
            </TableCell>
            <TableCell className="font-semibold">{player.country}</TableCell>
            <TableCell className="font-semibold">{player.steamid}</TableCell>
            <TableCell>
              {player?.team && (
                <img
                  src={`${apiUrl}/teams/logo/${player.team}`}
                  alt="Team Logo"
                  className="size-12"
                />
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="inline-flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setIsEditing(true);
                        setOpenState(true);
                        setSelectedPlayer(player);
                      }}
                    >
                      <MdEdit className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit Player</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deletePlayer(player._id)}
                    >
                      <MdDelete className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Player</TooltipContent>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
