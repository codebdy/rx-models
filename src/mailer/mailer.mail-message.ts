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
  inReplyTo?: string;
  references?: string[];
  priority?: 'high' | 'normal' | 'low';
  owner: { id?: number };
  [key: string]: any;
}
