 // Componet Base Class Using Generics
 export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement //project-input
    hostElement: T // app div
    element: U //form

    constructor(templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: string){
        //Hold reference to project-list template element gives us access to the template that's not null and is HTMLTemplateElement
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
            
        // Hold refrence to the app div that we render content to that's not null and is HTMLTemplateElement
        this.hostElement = document.getElementById(hostElementId)! as T;

         //Import content in template and render to DOM and whether with deep hierachy
         const importedNode  = document.importNode(this.templateElement.content, true)

         //Get access to html form element
         this.element = importedNode.firstElementChild as U
         if(newElementId){
            this.element.id = newElementId //add css
         } 
         
         this.attach(insertAtStart)
    }


    // Render list to the DOM
    private attach(insertAtStart: boolean) {
        this.hostElement.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend', this.element)
    }

    abstract configure(): void
    abstract renderContent(): void
    
}