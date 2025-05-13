class ConfirmationPopupActionsHandler {
  private static handlers: Record<string, () => void> = {};
  private static counter: number = 0; // Ensures unique keys

  static register(handler: () => void): string {
    const uniqueKey = `action_${Date.now()}_${this.counter++}`;
    this.handlers[uniqueKey] = handler;
    return uniqueKey;
  }

  static get(actionType: string): (() => void) | undefined {
    if (!this.handlers[actionType]) {
      console.error(
        `Handler for actionType "${actionType}" is not registered.`
      );
      return undefined;
    }
    return this.handlers[actionType];
  }
}

export default ConfirmationPopupActionsHandler;
