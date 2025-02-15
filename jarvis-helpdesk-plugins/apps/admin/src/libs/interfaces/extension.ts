export interface IExtensionContext {
  connected: boolean;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => Promise<void>;
}
