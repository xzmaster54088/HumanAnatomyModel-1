class Controls {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const container = this.sceneManager.container;

        container.addEventListener('click', (event) => {
            this.handleOrganSelection(event);
        });

        container.addEventListener('mousemove', (event) => {
            this.updateMousePosition(event);
        });
    }

    updateMousePosition(event) {
        const rect = this.sceneManager.container.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    handleOrganSelection(event) {
        this.raycaster.setFromCamera(this.mouse, this.sceneManager.camera);
        const intersects = this.raycaster.intersectObjects(this.sceneManager.scene.children);

        if (intersects.length > 0) {
            const selectedOrgan = intersects[0].object;
            this.sceneManager.selectOrgan(selectedOrgan);
            document.dispatchEvent(new CustomEvent('organSelected', {
                detail: { organName: selectedOrgan.name }
            }));
        }
    }
}
