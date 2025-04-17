// Добавляем обработчик для меню
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
            
    // Обработчик клика по пунктам меню
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();                   
            // Удаляем активный класс у всех ссылок
            navLinks.forEach(lnk => lnk.classList.remove('active'));
            // Добавляем активный класс к текущей ссылке
            this.classList.add('active');
                    
            // Плавная прокрутка к выбранному разделу
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
                    
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
            
    // Определяем активный раздел при прокрутке
    window.addEventListener('scroll', function() {
        let current = '';
                
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
                    
            if (pageYOffset >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
                
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});