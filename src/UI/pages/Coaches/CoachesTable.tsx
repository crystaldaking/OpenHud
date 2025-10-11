import { MdDelete, MdEdit } from "react-icons/md";
import { useCoaches } from "../../hooks";
import { Coach } from "./coachApi";
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

interface CoachTableProps {
  onEdit: (coach: Coach) => void;
}

export const CoachesTable = ({ onEdit }: CoachTableProps) => {
  const { filteredCoaches, deleteCoach } = useCoaches();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>SteamID</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredCoaches.map((coach: Coach) => (
          <TableRow key={coach.steamid}>
            <TableCell className="font-semibold">
              {coach.name || "Unnamed Coach"}
            </TableCell>
            <TableCell>
              {coach?.team && (
                <img
                  src={`${apiUrl}/teams/logo/${coach.team}`}
                  alt="Team Logo"
                  className="size-12"
                />
              )}
            </TableCell>
            <TableCell>{coach.steamid}</TableCell>
            <TableCell className="text-right">
              <div className="inline-flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => onEdit(coach)}>
                      <MdEdit className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit Coach</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => deleteCoach(coach.steamid)}>
                      <MdDelete className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Coach</TooltipContent>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
