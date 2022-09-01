
    // Drag And Drop Interfaces
    export interface Draggable {
        // Start dragging listeners
        dragStartHandler(event: DragEvent): void
        
        // End dragging listeners
        dragEndHandler(event: DragEvent) : void
    }

    //The box where the list items will be dragged
    export interface DragTarget {
        //Check if it's a valid drag target to permit drop
        dragOverHandler(event: DragEvent) : void

        // Handle the drop
        dropHandler(event: DragEvent): void

        // Give visual feedback if no drop happens
        dragLeaveHandler(event: DragEvent) : void
    }