const MAX_TEAM_NAME_LENGTH = 50;

export function getDefaultTeamName(displayName: string | null | undefined): string {
  const suffix = "'s Default Team";

  if (!displayName || displayName.trim() === '') {
    return 'Default Team';
  }

  const trimmedDisplayName = displayName.trim();
  const availableLength = MAX_TEAM_NAME_LENGTH - suffix.length;

  const finalDisplayName =
    trimmedDisplayName.length > availableLength ? trimmedDisplayName.substring(0, availableLength) : trimmedDisplayName;

  return finalDisplayName + suffix;
}
