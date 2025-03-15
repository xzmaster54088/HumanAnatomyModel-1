document.addEventListener('DOMContentLoaded', () => {
    // Debug check for THREE
    if (typeof THREE === 'undefined') {
        console.error('THREE is not defined! Check if Three.js is loaded correctly.');
        return;
    }
    console.log('THREE is loaded:', THREE.REVISION);

    // Debug check for OrbitControls
    if (typeof THREE.OrbitControls === 'undefined') {
        console.error('OrbitControls is not defined! Check if OrbitControls is loaded correctly.');
        return;
    }
    console.log('OrbitControls is loaded');

    const sceneManager = new SceneManager('scene-container');
    const controls = new Controls(sceneManager);
    const uiManager = new UIManager(sceneManager, controls);

    // Initialize the application
    try {
        sceneManager.init();
        controls.init();
        uiManager.init();
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error during initialization:', error);
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        sceneManager.render();
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        sceneManager.onWindowResize();
    });
});