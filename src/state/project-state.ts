import {Project, ProjectStatus} from '../models/project'


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
export class ProjectState extends State<Project> {
   
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
export const projectState = ProjectState.getInstance()