document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos todos los elementos que tienen la clase 'reveal'
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100; // Cuántos píxeles antes de aparecer

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;

            // Si el elemento está dentro de la vista, le agregamos la clase 'active'
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    // Escuchamos el evento de scroll en la ventana
    window.addEventListener('scroll', revealOnScroll);
    
    // Lo ejecutamos una vez al cargar la página para mostrar los primeros elementos
    revealOnScroll();

    // Lógica del Carrusel de Fondo en el Hero
    const slides = document.querySelectorAll('.bg-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        
        // Función que cambia la imagen cada 5 segundos (5000 milisegundos)
        setInterval(() => {
            // Quitamos la clase active a la imagen actual
            slides[currentSlide].classList.remove('active');
            
            // Calculamos cuál es la siguiente imagen
            currentSlide = (currentSlide + 1) % slides.length;
            
            // Le ponemos la clase active a la nueva imagen
            slides[currentSlide].classList.add('active');
        }, 5000); 
    }
    
});