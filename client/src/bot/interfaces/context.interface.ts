import { Scenes } from 'telegraf';

export class ContextInterface extends Scenes.SceneContextScene<any> {
  update_id: string;
  message: {
    message_id: string;
    from: {
      id: string;
      is_bot: string;
      first_name: string;
      username: string;
      language_code: string;
    };
    chat: {
      id: 1275002037;
      first_name: '𝔨𝔬𝔭𝔢𝔱𝔞𝔫𝔫';
      username: 'yetAnotherFeature';
      type: 'private';
    };
    date: number;
    voice?: {
      duration: 1;
      mime_type: 'audio/ogg';
      file_id: 'AwACAgIAAxkBAANsZC83rzqT9MU0UrxVwiEAAVbEfEusAALTMQAC-o55STUafsdHml53LwQ';
      file_unique_id: 'AgAD0zEAAvqOeUk';
      file_size: 8495;
    };
  };
}
