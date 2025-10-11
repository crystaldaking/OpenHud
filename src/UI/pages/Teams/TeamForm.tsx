import { useEffect, useState } from "react";
import { countries } from "../../api/countries";
import { useTeams } from "./useTeams";
import { apiUrl } from "../../api/api";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface TeamsFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const TeamsForm = ({ open, setOpen }: TeamsFormProps) => {
  const {
    createTeam,
    updateTeam,
    isEditing,
    setIsEditing,
    selectedTeam,
    setSelectedTeam,
  } = useTeams();

  const [teamName, setTeamName] = useState("");
  const [shortName, setShortName] = useState("");
  const [country, setCountry] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamNameError, setTeamNameError] = useState("");
  const [logoError, setLogoError] = useState("");


  useEffect(() => {
    if (isEditing && selectedTeam) {
      setTeamName(selectedTeam.name || "");
      setShortName(selectedTeam.shortName || "");
      setCountry(selectedTeam.country || "");
    } else {
      handleReset();
    }
  }, [isEditing, selectedTeam]);

  const validateForm = () => {
    let isValid = true;
    setTeamNameError("");

    if (!teamName) {
      setTeamNameError("Team name is required");
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const formData = new FormData();
    if (isEditing && selectedTeam) {
      formData.append("_id", selectedTeam._id);
    }
    formData.append("name", teamName);
    formData.append("shortName", shortName);
    formData.append("country", country);
    if (logo) {
      formData.append("logo", logo);
    }

    try {
      if (isEditing && selectedTeam) {
        await updateTeam(selectedTeam._id, formData);
      } else if (createTeam) {
        await createTeam(formData);
      }
    } catch (error) {
      console.error("Error submitting team:", error);
    } finally {
      setIsSubmitting(false);
      setOpen(false);
      handleReset();
    }
  };

  const handleCancel = () => {
    handleReset();
    setOpen(false);
  };
  const handleReset = () => {
    setIsEditing(false);
    setSelectedTeam(null);
    setTeamName("");
    setShortName("");
    setCountry("");
    setLogo(null);
    setTeamNameError("");
    setLogoError("");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? `Updating: ${teamName}` : "Create Team"}</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="teamName">Team Name</FieldLabel>
            <Input
              id="teamName"
              value={teamName}
              required
              onChange={(e) => setTeamName(e.target.value)}
              aria-invalid={!!teamNameError}
            />
            {teamNameError && <FieldError>{teamNameError}</FieldError>}
          </Field>
          <Field>
            <FieldLabel htmlFor="shortName">Short Name</FieldLabel>
            <Input
              id="shortName"
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Country</FieldLabel>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(countries).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value as string}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Logo</FieldLabel>
            <div className="flex flex-col items-start gap-4">
              {isEditing && selectedTeam?.logo && (
                <img
                  src={`${apiUrl}/teams/logo/${selectedTeam._id}?t=${new Date().getTime()}`}
                  alt="Current Logo"
                  className="size-36 rounded-sm border object-cover"
                />
              )}
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
                className="hidden"
              />
              <Button
                variant="outline"
                type="button"
                onClick={() => document.getElementById("logo")?.click()}
              >
                Upload Logo
              </Button>
              {logo && (
                <span className="text-sm text-muted-foreground">{logo.name}</span>
              )}
              {logoError && <FieldError>{logoError}</FieldError>}
            </div>
          </Field>
        </FieldGroup>
        <DialogFooter>
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
