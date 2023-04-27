export function CallbackQueryDecorator() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalValue = descriptor.value;

    descriptor.value = function (...args: any[]) {
      return originalValue.apply(this, args);
    };
  };
}
