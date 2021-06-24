export interface SocketSubscriber {
    onmessage(ev: MessageEvent): void;
    messageId: string;
    send(): void;
}