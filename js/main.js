document.addEventListener('DOMContentLoaded', () => {
    const sceneManager = new SceneManager('scene-container');
    const controls = new Controls(sceneManager);
    const uiManager = new UIManager(sceneManager, controls);

    // Initialize the application
    sceneManager.init();
    controls.init();
    uiManager.init();

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
