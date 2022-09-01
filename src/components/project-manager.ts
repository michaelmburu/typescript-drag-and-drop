import {Component} from './base-component'
import {validate, Validatable} from '../util/validation'
import {projectState} from '../state/project-state'
import {autobind} from '../decorator/autobind'

export class ProjectManager extends Component<HTMLDivElement, HTMLFormElement>{
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