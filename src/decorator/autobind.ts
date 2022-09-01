// Autobind Decorator
export function autobind(_: any, _2: string, descriptor: PropertyDescriptor){
    // Access original method
    const originalMethod = descriptor.value
    //Create adjusted descriptor with a get method that creates bind function on the original method
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get () {
            const boundFn = originalMethod.bind(this)
            return boundFn
        }
    }

    return adjDescriptor
}