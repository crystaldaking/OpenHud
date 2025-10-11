import React, { useEffect, useState } from "react";
import { maps } from "./MatchPage";
import { TableCell, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface VetoRowProps {
  index: number;
  veto: Veto;
  leftTeamId: string | null;
  rightTeamId: string | null;
  teams: Team[];
  onVetoChange: (index: number, key: keyof Veto, value: any) => void;
}

export const VetoRow: React.FC<VetoRowProps> = ({
  index,
  veto,
  leftTeamId,
  rightTeamId,
  teams,
  onVetoChange,
}) => {
  const [teamID, setTeamID] = useState<string | null>(
    veto.type === "decider" ? "decider" : veto.teamId || "",
  );
  const [leftTeam, setLeftTeam] = useState<Team | undefined>(undefined);
  const [rightTeam, setRightTeam] = useState<Team | undefined>(undefined);
  const [type, setType] = useState<"ban" | "pick" | "decider">(
    veto?.type || "pick",
  );
  const [mapName, setMapName] = useState<string | null>(veto?.mapName || null);
  const [side, setSide] = useState<"CT" | "T" | "NO">(veto.side);
  const [reverseSide, setReverseSide] = useState<boolean | null>(
    veto?.reverseSide || false,
  );

  useEffect(() => {
    setLeftTeam(teams.find((team) => team._id === leftTeamId));
    setRightTeam(teams.find((team) => team._id === rightTeamId));
    setTeamID(veto.teamId);
    setMapName(veto.mapName);
    setReverseSide(veto.reverseSide ?? false);
    setSide(veto.side);
  }, [veto, teams, leftTeamId, rightTeamId]);

  const handleTeamSelect = (id: string) => {
    setTeamID(id);
    onVetoChange(index, "teamId", id);
  };

  return (
    <TableRow key={index}>
      <TableCell>
        <h4 className="text-center font-semibold">Veto {index + 1}</h4>
      </TableCell>
      <TableCell>
        <RadioGroup
          value={type}
          onValueChange={(newType: "pick" | "ban" | "decider") => {
            setType(newType);
            onVetoChange(index, "type", newType);
          }}
          className="flex flex-col space-y-1"
        >
          {["pick", "ban", "decider"].map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${option}-${index}`} />
              <label htmlFor={`${option}-${index}`} className="capitalize">{option}</label>
            </div>
          ))}
        </RadioGroup>
      </TableCell>
      <TableCell>
        <Select
          disabled={type === "decider"}
          value={type === "decider" ? "decider" : teamID || ""}
          onValueChange={handleTeamSelect}
        >
          <SelectTrigger>
            <SelectValue placeholder="Team" />
          </SelectTrigger>
          <SelectContent>
            {type === "decider" && <SelectItem value="decider">Decider</SelectItem>}
            {leftTeamId && leftTeam && (
              <SelectItem value={leftTeamId}>{leftTeam.name}</SelectItem>
            )}
            {rightTeamId && rightTeam && (
              <SelectItem value={rightTeamId}>{rightTeam.name}</SelectItem>
            )}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select
          value={mapName || ""}
          onValueChange={(newMapName) => {
            setMapName(newMapName);
            onVetoChange(index, "mapName", newMapName);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Map" />
          </SelectTrigger>
          <SelectContent>
            {maps.map((map) => (
              <SelectItem key={map} value={map}>
                {map.charAt(3).toUpperCase() + map.slice(4)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select
          value={side}
          onValueChange={(newSide: "CT" | "T" | "NO") => {
            setSide(newSide);
            onVetoChange(index, "side", newSide);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Side" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NO">No Side</SelectItem>
            <SelectItem value="CT">CT</SelectItem>
            <SelectItem value="T">T</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="text-center">
        <Checkbox
          id={`reverseSide-${index}`}
          checked={reverseSide === true}
          onCheckedChange={(checked) => {
            const newReverseSide = checked === true;
            setReverseSide(newReverseSide);
            onVetoChange(index, "reverseSide", newReverseSide);
          }}
        />
      </TableCell>
    </TableRow>
  );
};
