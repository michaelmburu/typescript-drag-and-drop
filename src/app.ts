import {ProjectManager} from './components/project-manager'
import {ProjectList} from './components/project-list'

//instantiate new project input & lists form and render
new ProjectManager()
new ProjectList('active');
new ProjectList('finished')
