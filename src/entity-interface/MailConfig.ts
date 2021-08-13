export const EntityMailConfig = 'MailConfig';

export interface MailConfig {
  id?: number;
  address: string;
  account: string;
  password: string;
  host: string;
  port: string;
}
