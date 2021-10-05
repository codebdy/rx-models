interface AddressObject {
  name?: string;
  address: string;
}

export interface MailMessage {
  /**
   * Config id
   */
  fromConfigId?: number;
  to?: AddressObject[];
  cc?: AddressObject[];
  bcc?: AddressObject[];
  subject?: string;
  text?: string;
  html?: string;
  attachments?: File[];
  replyTo?: string | AddressObject;
  priority?: 'high' | 'normal' | 'low';
  [key: string]: any;
}
