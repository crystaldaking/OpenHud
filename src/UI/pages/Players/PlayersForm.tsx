import { useEffect, useState } from "react";
import { countries } from "../../api/countries";
import { usePlayers, useTeams } from "../../hooks";
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
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayerSilhouette } from "./PlayersPage";

interface PlayerFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  prefill?: {
    username?: string;
    steamId?: string;
  };
}

export const PlayerForm = ({ open, setOpen, prefill }: PlayerFormProps) => {
  const {
    createPlayer,
    updatePlayer,
    selectedPlayer,
    isEditing,
    setIsEditing,
    setSelectedPlayer,
  } = usePlayers();
  const { teams } = useTeams();

  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // For file upload
  const [avatar, setAvatar] = useState(""); // For file upload
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [steamId, setSteamId] = useState("");
  const [team, setTeam] = useState("");
  const [country, setCountry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [steamIdError, setSteamIdError] = useState("");
  const [steamIdFormatError, setSteamIdFormatError] = useState("");

  useEffect(() => {
    if (isEditing && selectedPlayer) {
      // Editing an existing player
      setUsername(selectedPlayer.username);
      setFirstName(selectedPlayer.firstName || "");
      setLastName(selectedPlayer.lastName || "");
      setSteamId(selectedPlayer.steamid);
      setTeam(selectedPlayer.team || "");
      setCountry(selectedPlayer.country || "");
      setAvatar(selectedPlayer.avatar || "");
    } else if (open && prefill) {
      // Creating a new player with prefilled values
      setUsername(prefill.username || "");
      setSteamId(prefill.steamId || "");
      setFirstName("");
      setLastName("");
      setTeam("");
      setCountry("");
      setAvatar("");
      setAvatarFile(null);
      setUsernameError("");
      setSteamIdError("");
      setSteamIdFormatError("");
    } else if (!isEditing && !prefill) {
      // Fresh create without prefill: inline reset to avoid handleReset dependency
      setSelectedPlayer(null);
      setUsername("");
      setAvatarFile(null);
      setFirstName("");
      setLastName("");
      setSteamId("");
      setTeam("");
      setCountry("");
      setUsernameError("");
      setSteamIdError("");
      setSteamIdFormatError("");
    }
  }, [isEditing, selectedPlayer, open, prefill, setSelectedPlayer]);

  const validateForm = () => {
    let isValid = true;
    setUsernameError("");
    setSteamIdError("");
    setSteamIdFormatError("");

    if (!username) {
      setUsernameError("Username is required");
      isValid = false;
    }

    if (!steamId) {
      setSteamIdError("SteamID64 is required");
      isValid = false;
    } else if (!/^\d{17}$/.test(steamId)) {
      setSteamIdFormatError("SteamID64 must be 17 digits long");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return; // Early return if validation fails

    setIsSubmitting(true);

    // Create a FormData object to handle file upload
    const formData = new FormData();
    if (isEditing && selectedPlayer) {
      formData.append("_id", selectedPlayer._id);
    }
    formData.append("username", username);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("steamid", steamId);
    formData.append("team", team);
    formData.append("country", country);
    if (avatarFile) {
      formData.append("avatar", avatarFile); // Append the file
    } else if (selectedPlayer?.avatar) {
      formData.append("avatar", avatar);
    }

    try {
      if (isEditing && selectedPlayer) {
        await updatePlayer(selectedPlayer._id, formData); // Pass FormData to updatePlayer
      } else if (createPlayer) {
        await createPlayer(formData); // Pass FormData to createPlayer
      }
    } catch (error) {
      console.error("Error submitting player:", error);
    } finally {
      setOpen(false);
      handleReset();
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    handleReset(); // Reset form fields
    setOpen(false);
  };

  const handleReset = () => {
    setIsEditing(false);
    setSelectedPlayer(null);
    setUsername("");
    setAvatarFile(null); // Reset file input
    setFirstName("");
    setLastName("");
    setSteamId("");
    setTeam("");
    setCountry("");
    setUsernameError("");
    setSteamIdError("");
    setSteamIdFormatError("");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Updating: ${username}` : "Create Player"}</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                aria-invalid={!!usernameError}
              />
              {usernameError && <FieldError>{usernameError}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="steamId">SteamID64</FieldLabel>
              <Input
                id="steamId"
                value={steamId}
                onChange={(e) => setSteamId(e.target.value)}
                required
                aria-invalid={!!steamIdError || !!steamIdFormatError}
              />
              {(steamIdError || steamIdFormatError) && (
                <FieldError>{steamIdError || steamIdFormatError}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="firstName">First Name</FieldLabel>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>Team</FieldLabel>
              <Select value={team} onValueChange={setTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="Team" />
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
              <FieldLabel>Avatar</FieldLabel>
              <div className="flex flex-col items-start gap-4">
                {isEditing && selectedPlayer?.avatar && (
                  <img
                    src={`${apiUrl}/players/avatar/${selectedPlayer._id}?t=${new Date().getTime()}`}
                    alt="Current Avatar"
                    className="size-36 rounded-sm border object-cover"
                  />
                )}
                {!selectedPlayer?.avatar && isEditing && (
                  <img src={PlayerSilhouette} alt="Player Silhouette" className="size-36" />
                )}
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => document.getElementById("avatar")?.click()}
                >
                  Upload Avatar
                </Button>
                {avatarFile && (
                  <span className="text-sm text-muted-foreground">{avatarFile.name}</span>
                )}
              </div>
            </Field>
          </div>
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
