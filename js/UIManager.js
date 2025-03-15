class UIManager {
    constructor(sceneManager, controls) {
        this.sceneManager = sceneManager;
        this.controls = controls;
        this.systemButtons = document.querySelectorAll('[data-system]');
        this.infoPanel = document.getElementById('organ-info');
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for organ selection
        document.addEventListener('organSelected', (event) => {
            this.updateOrganInfo(event.detail.organName);
        });

        // Setup system toggle buttons
        this.systemButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.toggleSystem(button.dataset.system);
            });
        });
    }

    updateOrganInfo(organName) {
        const organData = AnatomyData.organs[organName];
        if (organData) {
            this.infoPanel.innerHTML = `
                <h5>${organData.name}</h5>
                <p>${organData.description}</p>
                <p><strong>System:</strong> ${organData.system}</p>
            `;
        }
    }

    toggleSystem(systemName) {
        this.systemButtons.forEach(button => {
            if (button.dataset.system === systemName) {
                button.classList.toggle('active');
            }
        });

        // Update visibility of organs in the selected system
        this.sceneManager.organs.forEach((organ, name) => {
            const organData = AnatomyData.organs[name];
            if (organData && organData.system === systemName) {
                organ.visible = !organ.visible;
            }
        });
    }
}
