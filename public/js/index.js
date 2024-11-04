document.addEventListener('DOMContentLoaded', function() {
    // Toggle endpoint sections
    document.querySelectorAll('.endpoint-section h2').forEach(function(header) {
        header.addEventListener('click', function() {
            this.parentElement.classList.toggle('active');
            var content = this.nextElementSibling;
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    });

    // Initialize ClipboardJS
    new ClipboardJS('.copy-btn');

    // Add copy feedback
    document.querySelectorAll('.copy-btn').forEach(function(button) {
        button.addEventListener('click', function() {
            var originalText = this.innerHTML;
            this.innerHTML = 'Copied!';
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        });
    });
});