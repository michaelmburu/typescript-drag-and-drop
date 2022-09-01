// Drag And Drop Interfaces
interface Draggable {
    // Start dragging listeners
    dragStartHandler(event: DragEvent): void
    
    // End dragging listeners
    dragEndHandler(event: DragEvent) : void
}

//The box where the list items will be dragged
interface DragTarget {
    //Check if it's a valid drag target to permit drop
    dragOverHandler(event: DragEvent) : void

    // Handle the drop
    dropHandler(event: DragEvent): void

    // Give visual feedback if no drop happens
    dragLeaveHandler(event: DragEvent) : void
}


// Project Type
enum ProjectStatus {
    Active,
    Finished
}

class Project {
    constructor(public id: string, public title: string, public description: string, public people: number, public status: ProjectStatus){

    }
}

// Project State Management
type Listener<T> = (items: T[]) => void

// Base State Method
class State<T> {
    protected listeners: Listener<T>[] = []
    // Create Subscribers
    addListener(listenerFunction: Listener<T>){
        this.listeners.push(listenerFunction)
    }
}

  // Create a singleton class that returns the same instance
class ProjectState extends State<Project> {
   
    private projects: Project[] = []
    private static instance: ProjectState
    
    private constructor() {
       super()
    }

    // Always return the same instance of ProjectState
    static getInstance() {
        if(this.instance) {
            return this.instance
        }
        this.instance = new ProjectState()
        return this.instance
    }

    

    //Add Project
    addProject(title: string, description: string, numOfPeople:  number) {
        const newProject = new Project(Math.random.toString(), title, description, numOfPeople, ProjectStatus.Active)

        this.projects.push(newProject)
        this.updateListeners()
    }

    // Update project status when moved & alert listeners
    moveProject(projectId: string, newStatus: ProjectStatus){
       const project =  this.projects.find(prj => prj.id === projectId)
        if(project){
            project.status = newStatus
            this.updateListeners()
        }
    }

    // Trigger listeners
    private updateListeners() {
        for(const listenerFunction of this.listeners) {
            // Pass a copy of the current project state to the listener Functions
            listenerFunction(this.projects.slice())
        }
    }
}

// Create a single object of our ProjectState class for managing state
const projectState = ProjectState.getInstance()

//Validatable Interface to define the validatable object
interface Validatable {
    value: string | number
    required?: boolean
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
}

//Validate method
function validate(validatableInput: Validatable) {
    let isValid = true;
    
    //If input is required, check input value > 0
    if(validatableInput.required){
        isValid = isValid && validatableInput.value.toString().trim().length !== 0
    }

    // If minLength is set, run check on string only else skip
    if(validatableInput.minLength != null && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength
    }

      // If maxLength is set, run check on string only else skip
    if(validatableInput.maxLength != null && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength
    }

      // If minValue is not 0 and is a number
    if(validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.min
    }

      // If maxValue is not 0 and is a number
      if(validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value <= validatableInput.max
    }

    return isValid
}

// Autobind Decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor){
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

// Componet Base Class Using Generics
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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

/* 
    Project Item 
    Initiliaze Generic With Types
*/
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    
    private project: Project

    //getter to get number of persons
    get persons() {
        if(this.project.people === 1) {
            return '1 person'
        }  else {
            return `${this.project.people} persons`
        }
    }

    constructor(hostId: string, project: Project){
        super('single-project', hostId, false, project.id)
        this.project = project

        this.configure()
        this.renderContent()
    }

    // Drag start handler
    @autobind
    dragStartHandler(event: DragEvent): void {
        //Attach data to drag event
        event.dataTransfer!.setData('text/plain', this.project.id)

        //Move data via event
        event.dataTransfer!.effectAllowed = 'move'

    }

    // Drag End Handler
    @autobind
    dragEndHandler(event: DragEvent): void {
         //Attach data to drag event
         event.dataTransfer!.setData('text/plain', this.project.id)

         //Move data via event
         event.dataTransfer!.effectAllowed = 'move'
    }
    
    // Listen to drag events
    configure(): void {
        this.element.addEventListener('dragstart', this.dragStartHandler)
        this.element.addEventListener('dragend', this.dragEndHandler)
    }
    

    // Reach out to tags and render content
    renderContent(): void {
        this.element.querySelector('h2')!.textContent = this.project.title
        this.element.querySelector('h3')!.textContent = this.persons + ' assigned'
        this.element.querySelector('p')!.textContent = this.project.description
    }

}

/* 
    Project List 
     1. Get access to the project-list and projects element tags
    2. Get access to the div
    3. Render template in app div
*/
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {

    assignedProjects: Project[]

    constructor(private type: 'active' | 'finished'){
        super('project-list', 'app', false, `${type}-projects`)
        // Init assigned projects to empty array
        this.assignedProjects = []

        //Configure listeners
        this.configure()

        // Attach element to DOM & fill tags
        this.renderContent()
    }

    // When the list item is dragged over the list area
    @autobind
    dragOverHandler(event: DragEvent): void {
        // Is drag allowed and is the data target correct
        if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault() // Tell js that this element to allow drop event
            const listElement = this.element.querySelector('ul')!
            listElement.classList.add('droppable')
        }    
    }

    // When a list that's dragged is released
    @autobind
    dropHandler(event: DragEvent): void {
        // Get data from eventData transfer
       const projectId = event.dataTransfer!.getData('text/plain')

       //Move data to list and update state
       projectState.moveProject(projectId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)
    }

    // When the item leaves the drop area
    @autobind
    dragLeaveHandler(_: DragEvent): void {
        const listElement = this.element.querySelector('ul')
        listElement?.classList.remove('droppable')
    }

    configure(): void {
        // Register drag events
        this.element.addEventListener('dragover', this.dragOverHandler)
        this.element.addEventListener('dragleave', this.dragLeaveHandler)
        this.element.addEventListener('drop', this.dropHandler)

        // Subscribe as a listener to the project state
        projectState.addListener((projects: Project[]) => {

           //Filter items to a new created array
           const relevantProjects  = projects.filter(prj => {
               if(this.type === 'active'){
                   return prj.status === ProjectStatus.Active
               }
               return prj.status === ProjectStatus.Finished
           })
           this.assignedProjects = relevantProjects
           this.renderProjects()
       })
   }

   // Fill tags
   renderContent() {
       const listId = `${this.type}-projects-list`;
       this.element.querySelector('ul')!.id = listId
       this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'
   }
    // Render Projects in the current project State
    private renderProjects() {
        // Grab list from DOM
        const listElement = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement

        // Clear list to remove duplication. This is NOT scalable
        //dvanced libraries like React loop through the DOM and compare what's already rendered and re-render the new items
        listElement.innerHTML = ''

        for(const projectItem of this.assignedProjects){
            new ProjectItem(this.element.querySelector('ul')!.id, projectItem)
        }

    }

}

/* 
    1. Get access to template and form
    2. Get access to the div
    3. Render template in app div
*/
class ProjectManager extends Component<HTMLDivElement, HTMLFormElement>{
     titleInputElement: HTMLInputElement //title input field
     descriptionInputElement: HTMLInputElement //description input field
     peopleInputElement: HTMLInputElement //people input field

    constructor () {
        super('project-input', 'app', true, 'user-input')

        //Get access to title, description, people input elements
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement
  

        //Configure submit handler
        this.configure()

    }

    // Configure submit event listener, bind binds the this keyword to reference the class not the event target
    configure() {
        
    this.element.addEventListener('submit', this.submitHandler) //N/B You have to add .bind(this) or use a decorator
}

    //Return a tuple with our user input or void
    private gatherUserInput(): [string, string, number] | void {

        //get values from inputs
        const enteredTitle = this.titleInputElement.value
        const enteredDescription = this.descriptionInputElement.value
        const enteredPeople = this.peopleInputElement.value

        //create a validatable object
        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true
        }
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5,
        }
        const peopleValidatable: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        }

        //validate inputs against the validation object
        if(!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(peopleValidatable))
        {
            alert('Invlaid input, please try')
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople]
        }
    }

    // Clear inputs
    private clearInputs() {
        this.titleInputElement.value = ''
        this.descriptionInputElement.value = ''
        this.peopleInputElement.value = ''
    }

    @autobind
    // Exectute on form submit
    private submitHandler(event: Event) {
        // Disable default submit action
        event.preventDefault() 

        // Build tuple
        var userInput = this.gatherUserInput()
        
        //Check whether it's a tuple, use array.isarray
        if(Array.isArray(userInput)){
            //deconstruct items from tuple
            const [title, description, people] = userInput
            projectState.addProject(title, description, people)
            this.clearInputs()
        }
    }

   renderContent(): void {
       
   }
}

//instantiate new project input & lists form and render
const projectManager = new ProjectManager()
const activeProjectLists = new ProjectList('active');
const finishedProjectLists = new ProjectList('finished')