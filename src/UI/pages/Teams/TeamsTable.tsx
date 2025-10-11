import { MdDelete, MdEdit } from "react-icons/md";
import { useTeams } from "./useTeams";
import { apiUrl } from "../../api/api";
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

interface TeamsTableProps {
  setOpenState: (open: boolean) => void;
}

export const TeamsTable = ({ setOpenState }: TeamsTableProps) => {
  const {
    filteredTeams,
    deleteTeam,
    setIsEditing,
    setSelectedTeam,
  } = useTeams();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Logo</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Short Name</TableHead>
          <TableHead>Country</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredTeams.map((team: Team) => (
          <TableRow key={team._id}>
            <TableCell>
              <img
                src={`${apiUrl}/teams/logo/${team._id}?t=${new Date().getTime()}`}
                alt="Team Logo"
                className="size-12"
              />
            </TableCell>
            <TableCell className="font-semibold">{team.name}</TableCell>
            <TableCell>{team.shortName}</TableCell>
            <TableCell className="font-semibold">{team.country}</TableCell>
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
                        setSelectedTeam(team);
                      }}
                    >
                      <MdEdit className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit Team</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => deleteTeam(team._id)}>
                      <MdDelete className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Team</TooltipContent>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
