import { ApiProperty } from '@nestjs/swagger';

export class OAuthLoginResponseDto {
  @ApiProperty({ example: 'login' })
  type: 'login';

  @ApiProperty({ example: 'user@example.com' })
  email: string;
}

export class OAuthSignupResponseDto {
  @ApiProperty({ example: 'signup' })
  type: 'signup';

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'JWT token used for completing signup' })
  preSignupToken: string;
}
