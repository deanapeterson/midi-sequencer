


// export function debounce(ms: number) {
//     return (
//         target: unknown,
//         propertyKey: string,
//         descriptor: PropertyDescriptor
//     ): void => {
//         let timer: ReturnType<typeof setTimeout>;
//         const originalMethod = descriptor.value;


//         descriptor.value = function (...args: any[]) {
//             new Promise((resolve) => {
//                 if (timer) {
//                     clearTimeout(timer);
//                 }


//                 timer = setTimeout(() => {
//                     resolve(originalMethod.apply(this, ...args));
//                 }, ms);
//             });
//         };
//     };
// }

export function debounce(delay: number = 300): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const timeoutKey = `__debounceTimeout_${String(propertyKey)}`;

    const original = descriptor.value;

    descriptor.value = function (...args: any) {
      clearTimeout((this as any)[timeoutKey]);
      (this as any)[timeoutKey] = setTimeout(() => original.apply(this, args), delay);
    };

    return descriptor;
  };
}