// dto/oauth-user-profile.dto.ts
export interface OAuthUserProfileDTO {
  displayName: string;
  emails: {
    value: string;
    verified: boolean;
  }[];
  provider: 'google' | 'twitter';
}

