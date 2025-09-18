// src/auth/strategies/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { Request } from 'express';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'],
      passReqToCallback: true, // Important to access req in validate
    });
  }


  /**
   * You can add custom params for Google login here
   */
  authorizationParams(): Record<string, string> {
    return {
     prompt: 'select_account consent'
    };
  }

  /**
   * Validate function called after Google returns profile
   */
async validate(
  req: Request,
  profile: any,
  done: VerifyCallback,
) {
  let role;
  if (req.query.state) {
    try {
      role = JSON.parse(Buffer.from(req.query.state as string, 'base64').toString('utf8')).role;
    } catch {}
  }

  const user = { ...profile, role };
  done(null, user);
}

}
