import {Component} from './base-component'
import {ProjectItem} from './project-item'
import {DragTarget} from '../models/drag-drop'
import {Project, ProjectStatus} from '../models/project'
import {autobind} from '../decorator/autobind'
import {projectState} from '../state/project-state'
/* 
    Project List 
     1. Get access to the project-list and projects element tags
    2. Get access to the div
    3. Render template in app div
*/
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {

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
        const listElement = this.element.querySelector('ul')!
        listElement.classList.remove('droppable')
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