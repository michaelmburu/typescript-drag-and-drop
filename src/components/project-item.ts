import {Component} from './base-component'
import {Draggable} from '../models/drag-drop'
import {Project} from '../models/project'
import {autobind} from '../decorator/autobind'
   /* 
    Project Item 
    Initiliaze Generic With Types
*/
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    
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