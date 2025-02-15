import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { importJWK, JWK, jwtVerify } from 'jose';

@Injectable()
export class JwksService {
  private readonly stackAuthApiUrl: string;
  private readonly stackProjectId: string;
  private readonly stackIssuer: string;
  private readonly stackJwtAlgorithm: string;
  private publicJwkSet?: JWK;

  constructor(private readonly configService: ConfigService) {
    this.stackAuthApiUrl = configService.getOrThrow('stackAuth.endpoint');
    this.stackProjectId = configService.getOrThrow('stackAuth.projectId');
    this.stackIssuer = configService.getOrThrow('stackAuth.jwtIssuer');
    this.stackJwtAlgorithm = configService.getOrThrow('stackAuth.jwtAlgorithm');
  }

  private async getPublicJwkSet() {
    if (!this.publicJwkSet) {
      const res = await axios.get<{ keys: JWK[] }>(
        `${this.stackAuthApiUrl}/api/v1/projects/${this.stackProjectId}/.well-known/jwks.json`
      );
      if (!res.data.keys.length) {
        throw new InternalServerErrorException('Can not get public JwkSet from Stack Auth');
      }
      this.publicJwkSet = res.data.keys[0];
    }
    return this.publicJwkSet;
  }

  async verifyJwksToken(token: string) {
    const publicKey = await importJWK(await this.getPublicJwkSet(), this.stackJwtAlgorithm);

    try {
      const { payload } = await jwtVerify(token, publicKey, {
        issuer: this.stackIssuer,
      });

      return payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
