(function(){
    const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
    const sections = Array.from(document.querySelectorAll('section'));

    if (!navLinks.length || !sections.length) return; // nothing to do

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.target.id) return;
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(s => observer.observe(s));
    } else {
        // fallback: mark first link active
        navLinks.forEach((l, i) => l.classList.toggle('active', i === 0));
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
})();
