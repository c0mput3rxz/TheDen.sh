// Drag functionality for draggable cards
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Draggabilly !== 'undefined') {
        var draggableElements = document.querySelectorAll('.draggable');
        
        draggableElements.forEach(function(element) {
            new Draggabilly(element, {
                containment: true
            });
        });
    }
});

