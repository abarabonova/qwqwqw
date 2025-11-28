// Dynamic viewport height variable to handle mobile browser UI
(() => {
    const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    let resizeTimeout;
    const onResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(setViewportHeight, 150);
    };

    setViewportHeight();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
})();

// Email form handling with FormCarry
const emailForm = document.getElementById('emailForm');
const emailInput = document.getElementById('emailInput');

if (emailForm && emailInput) {
    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const submitButton = emailForm.querySelector('.join-btn');
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email || !emailRegex.test(email)) {
            return; // HTML5 validation will handle this
        }
        
        // Disable button during submission and show three dots
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = '...';
            submitButton.classList.remove('done');
        }
        
        try {
            // Send to FormCarry
            const formData = new FormData(emailForm);
            
            const response = await fetch('https://formcarry.com/s/drWXfylIwa2', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const result = await response.json();
            
            if (response.ok && result.code === 200) {
                // Change button text to "DONE" on success
                if (submitButton) {
                    submitButton.textContent = 'DONE';
                    submitButton.classList.add('done');
                    emailInput.value = '';
                    
                    // Return to "JOIN" after 2 seconds
                    setTimeout(() => {
                        submitButton.textContent = 'JOIN';
                        submitButton.classList.remove('done');
                        submitButton.disabled = false;
                    }, 2000);
                }
            } else {
                throw new Error(result.message || 'Failed to submit');
            }
        } catch (error) {
            console.error('Error submitting email:', error);
            // Re-enable button on error
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'JOIN';
                submitButton.classList.remove('done');
            }
        }
    });
}
/// Falling Widgets System
(function() {
    const widgetsContainer = document.querySelector('.widgets-container');
    const skyBackground = document.querySelector('.sky-background');
    
    if (!widgetsContainer || !skyBackground) return;
    
    const widgetImages = [
        'widgets/Widget01.png',
        'widgets/Widget02.png',
        'widgets/Widget03.png',
        'widgets/Widget04.png',
        'widgets/Widget05.png',
        'widgets/Widget06.png',
        'widgets/Widget07.png',
        'widgets/Widget08.png',
        'widgets/Widget09.png',
        'widgets/Widget10.png',
        'widgets/Widget11.png',
        'widgets/Widget12.png',
        'widgets/Widget13.png',
        'widgets/Widget14.png',
        'widgets/Widget15.png',
        'widgets/Widget16.png',
        'widgets/Widget17.png',
        'widgets/Widget18.png',
        'widgets/Widget19.png',
        'widgets/Widget20.png',
        'widgets/Widget21.png',
        'widgets/Widget22.png',
        'widgets/Widget23.png',
        'widgets/Widget24.png'
    ];
    
    const config = {
        // длительность падения
        minDuration: 3.2,
        maxDuration: 5.2,

        // интервалы спавна
        minSpawnInterval: 350,
        maxSpawnInterval: 900,

        // максимум одновременно
        maxWidgets: 14,

        // размеры
        desktopWidgetSize: 120,
        mobileWidgetSize: 140,
        mobileBreakpoint: 768
    };
    
    let activeWidgets = [];
    let spawnTimeoutId = null;
    let lastTime = null;
    let lastImageIndex = null;

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getWidgetSize() {
        const vw = window.innerWidth || document.documentElement.clientWidth;
        return vw <= config.mobileBreakpoint
            ? config.mobileWidgetSize
            : config.desktopWidgetSize;
    }

    function getRandomWidgetImage() {
        if (widgetImages.length === 1) {
            lastImageIndex = 0;
            return widgetImages[0];
        }

        let idx;
        do {
            idx = Math.floor(Math.random() * widgetImages.length);
        } while (idx === lastImageIndex);

        lastImageIndex = idx;
        return widgetImages[idx];
    }

    function createWidget() {
        if (activeWidgets.length >= config.maxWidgets) return;
        
        const widget = document.createElement('img');
        widget.src = getRandomWidgetImage();
        widget.className = 'falling-widget';
        widget.alt = 'Widget';

        const widgetSize = getWidgetSize();

        // ЖЁСТКО задаём размер, чтобы не было разброса
        widget.style.position = 'absolute';
        widget.style.width = widgetSize + 'px';
        widget.style.height = widgetSize + 'px';
        widget.style.transition = 'none';
        widget.style.animation = 'none';
        widget.style.willChange = 'transform';
        widget.style.pointerEvents = 'none';
        widget.draggable = false;

        const containerHeight = widgetsContainer.offsetHeight || window.innerHeight;
        const travelDistance = containerHeight + widgetSize + 80;

        const duration = random(config.minDuration, config.maxDuration);
        const speed = travelDistance / duration;

        const containerWidth = widgetsContainer.offsetWidth || window.innerWidth;

        // чуть вылезаем за края, чтобы на мобиле они резались по бокам
        const minX = -widgetSize * 0.3;
        const maxX = containerWidth - widgetSize * 0.7;
        const x = random(minX, Math.max(minX, maxX));

        const startY = -widgetSize - 40;

        // МЯГКОЕ вращение: меньше максимальный поворот
        const possibleTurns = [20, 40, 70, 110]; // раньше было до 180
        let turn = possibleTurns[Math.floor(Math.random() * possibleTurns.length)];
        const sign = Math.random() < 0.5 ? -1 : 1;
        turn *= sign;

        const rotationSpeed = turn / duration;

        // уменьшаем стартовый перекос, чтобы не казалось, что они вечно крутятся
        const initialRotation = random(-3, 3);

        const zIndex = Math.floor(random(1, 4));
        widget.style.zIndex = zIndex;

        widgetsContainer.appendChild(widget);
        
        activeWidgets.push({
            element: widget,
            x,
            y: startY,
            speed,
            rotation: initialRotation,
            rotationSpeed,
            travelDistance,
            size: widgetSize
        });
    }

    function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const delta = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        const containerHeight = widgetsContainer.offsetHeight || window.innerHeight;

        activeWidgets = activeWidgets.filter(w => {
            const { element } = w;

            w.y += w.speed * delta;
            w.rotation += w.rotationSpeed * delta;

            element.style.transform =
                `translate3d(${Math.round(w.x)}px, ${Math.round(w.y)}px, 0) rotate(${w.rotation}deg)`;

            if (w.y > containerHeight + w.size + 80) {
                element.remove();
                return false;
            }
            return true;
        });

        requestAnimationFrame(animate);
    }

    function scheduleNextSpawn() {
        const delay = random(config.minSpawnInterval, config.maxSpawnInterval);
        spawnTimeoutId = setTimeout(() => {
            if (activeWidgets.length < config.maxWidgets) createWidget();
            scheduleNextSpawn();
        }, delay);
    }
    
    function startWidgets() {
        createWidget();
        createWidget();
        scheduleNextSpawn();
        requestAnimationFrame(animate);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startWidgets);
    } else {
        startWidgets();
    }
})();
