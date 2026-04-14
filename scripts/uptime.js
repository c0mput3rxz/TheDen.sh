// Uptime display script
(function() {
    function updateUptime() {
        var clockElement = document.getElementById('clock');
        if (!clockElement) return;
        
        // Simple uptime display - you can customize this
        var startTime = new Date('2019-08-18T09:22:31');
        var now = new Date();
        var diff = now - startTime;
        
        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        var uptimeString = days + ' days, ' + hours + ':' + 
            (minutes < 10 ? '0' : '') + minutes + ', 1 user, load average: 0.00, 0.00, 0.00';
        
        clockElement.textContent = uptimeString;
    }
    
    // Update immediately and then every minute
    updateUptime();
    setInterval(updateUptime, 60000);
})();

