import { AxiosRequestHeaders } from 'axios';

export interface StackAuthRequestHeaders extends AxiosRequestHeaders {
  'X-Stack-Access-Type': 'client' | 'server';
  'X-Stack-Project-Id': string;
  'X-Stack-Publishable-Client-Key': string;
  'X-Stack-Access-Token'?: string;
  'X-Stack-Refresh-Token'?: string;
}
