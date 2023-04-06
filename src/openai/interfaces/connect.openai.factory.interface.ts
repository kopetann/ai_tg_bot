import { ConnectOpenAiInterface } from './connect.openai.interface';

export interface ConnectOpenAiFactoryInterface {
  createOpenAiInterface(): Promise<ConnectOpenAiInterface>;
}
