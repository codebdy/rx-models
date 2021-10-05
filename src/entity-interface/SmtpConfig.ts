
export interface SmtpConfig  {
  address?: string;
  replyTo?: string;
  host?: string;
  port?: string;
  timeout?: number;
  isSSL?: boolean;
  isStartTLS?: boolean;
  isAuth?: boolean;
  account?: string;
  password?: string;
}
