import { useEffect, useState } from "react";
import { MatchTypes } from "./MatchPage";
import { VetoRow } from "./VetoRow";
import { useMatches } from "./useMatches";
import { useTeams } from "../../hooks";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface MatchFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const MatchForm = ({ open, setOpen }: MatchFormProps) => {
  const {
  isEditing,
  selectedMatch,
  setCurrentMatch,
    createMatch,
    updateMatch,
    setIsEditing,
    setSelectedMatch
  } = useMatches();
  const { teams } = useTeams();

  const [matchType, setMatchType] = useState<"bo1" | "bo2" | "bo3" | "bo5">(
    "bo1",
  );
  const [leftTeamId, setLeftTeamId] = useState<string | null>(null);
  const [leftTeamWins, setLeftTeamWins] = useState<number>(0);
  const [rightTeamId, setRightTeamId] = useState<string | null>(null);
  const [rightTeamWins, setRightTeamWins] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Added for error message
  const [vetos, setVetos] = useState<Veto[]>(
    Array(9)
      .fill(null)
      .map(() => ({
        teamId: "",
        mapName: "",
        side: "NO",
        type: "ban",
        mapEnd: false,
      })),
  );

  const leftTeam = teams.find((team) => team._id === leftTeamId);
  const rightTeam = teams.find((team) => team._id === rightTeamId);

  useEffect(() => {
    if (isEditing && selectedMatch) {
      setLeftTeamId(selectedMatch.left.id);
      setRightTeamId(selectedMatch.right.id);
      setLeftTeamWins(selectedMatch.left.wins);
      setRightTeamWins(selectedMatch.right.wins);
      setMatchType(selectedMatch.matchType);
      setCurrentMatch(selectedMatch);
      setVetos(selectedMatch.vetos);
    } else {
      handleReset();
    }
  }, [isEditing, selectedMatch]);

  const validateForm = () => {
    let isValid = true;
    setErrorMessage("");

    if (!leftTeamId || !rightTeamId) {
      setErrorMessage("Please select both teams.");
      isValid = false;
    }

    if (!["bo1", "bo2", "bo3", "bo5"].includes(matchType)) {
      setErrorMessage("Invalid match type selected.");
      isValid = false;
    }

    return isValid;
  };

  const handleVetoChange = (index: number, key: keyof Veto, value: any) => {
    const updatedVetos = [...vetos];
    updatedVetos[index] = { ...updatedVetos[index], [key]: value };
    setVetos(updatedVetos);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const newMatch: Match = {
      id: selectedMatch?.id || "",
      left: { id: leftTeamId, wins: leftTeamWins },
      right: { id: rightTeamId, wins: rightTeamWins },
      matchType: matchType as "bo1" | "bo2" | "bo3" | "bo5",
      current: selectedMatch ? selectedMatch.current : false,
      vetos: vetos,
    };

    try {
      if (isEditing && selectedMatch) {
        await updateMatch(selectedMatch.id, newMatch);
      } else if (createMatch) {
        await createMatch(newMatch);
      }
    } catch (error) {
      console.error("Error creating/updating match:", error);
    } finally {
      setOpen(false);
      handleReset();
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    handleReset();
    setOpen(false);
  };

  const handleReset = () => {
    setIsEditing(false);
    setSelectedMatch(null);
    setLeftTeamId(null);
    setRightTeamId(null);
    setCurrentMatch(null);
    setMatchType("bo1");
    setLeftTeamWins(0);
    setRightTeamWins(0);
    setErrorMessage("");
    const newVetos: Veto[] = vetos.map(() => ({
      type: "ban",
      teamId: "",
      mapName: "",
      side: "NO",
      reverseSide: false,
      mapEnd: false,
    }));
    setVetos(newVetos);
  };

  const vetoSource = selectedMatch?.vetos || vetos;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Updating: ${leftTeam?.name} vs ${rightTeam?.name}` : "Create Match"}
          </DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <div className="grid grid-cols-3 items-center justify-center gap-4">
            <Field>
              <FieldLabel>Team One</FieldLabel>
              <Select value={leftTeamId || ""} onValueChange={setLeftTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Team One" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team._id} value={team._id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="text-center font-semibold">VS</div>
            <Field>
              <FieldLabel>Team Two</FieldLabel>
              <Select value={rightTeamId || ""} onValueChange={setRightTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Team Two" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team._id} value={team._id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-3 items-end justify-center gap-4">
            <Field>
              <FieldLabel>Left Wins</FieldLabel>
              <Input
                type="number"
                min={0}
                value={leftTeamWins}
                onChange={(e) => setLeftTeamWins(Number(e.target.value || 0))}
              />
            </Field>
            <Field>
              <FieldLabel>Best Of</FieldLabel>
              <Select
                value={matchType}
                onValueChange={(value) =>
                  setMatchType(value as "bo1" | "bo2" | "bo3" | "bo5")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Match Type" />
                </SelectTrigger>
                <SelectContent>
                  {MatchTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Right Wins</FieldLabel>
              <Input
                type="number"
                min={0}
                value={rightTeamWins}
                onChange={(e) => setRightTeamWins(Number(e.target.value || 0))}
              />
            </Field>
          </div>
            <ScrollArea className="h-96 rounded-md border p-4">
            <Field className="mt-4">
              <FieldLabel>Vetos</FieldLabel>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Veto</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Map</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead className="text-center">Reverse</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {vetoSource.map((veto, index) => (
                  <VetoRow
                    key={index}
                    index={index}
                    veto={veto}
                    leftTeamId={leftTeamId}
                    rightTeamId={rightTeamId}
                    teams={teams}
                    onVetoChange={handleVetoChange}
                  />
                ))}
                </TableBody>
              </Table>
            </Field>
          <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </FieldGroup>
        <DialogFooter>
        {errorMessage && (
          <FieldError className="mr-auto">{errorMessage}</FieldError>
        )}
          {isSubmitting ? (
            <Button disabled>Submitting...</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit</Button>
          )}
          <Button variant="outline" onClick={handleReset}>Reset</Button>
          {isEditing && (
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
