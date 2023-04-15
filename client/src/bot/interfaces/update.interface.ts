export interface UpdateInterface {
  update_id: number;
  message: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username: string | null;
      language_code: string;
    };
    chat: {
      id: number;
      first_name: string;
      username: string;
      type: string;
    };
    date: typeof Date;
    text: string;
    entities: Record<string, any>;
  };
  user: {
    id: string;
    name: string;
    userName: string;
    subscriptionDate: typeof Date;
    requestCount: number;
  };
}
