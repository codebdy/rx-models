
export interface SmtpConfig  {
  address?: string;
  replyTo?: string;
  host?: string;
  port?: string;
  timeout?: number;
  useSSL?: boolean;
  requireTLS?: boolean;
  requiresAuth?: boolean;
  account?: string;
  password?: string;
}
