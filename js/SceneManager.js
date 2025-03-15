class SceneManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth * 0.75 / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.organs = new Map();
        this.selectedOrgan = null;
        this.systemGroups = new Map();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth * 0.75, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        this.container.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.set(0, 0, 10);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight2.position.set(-1, -1, -1);
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
        this.scene.add(directionalLight2);

        // Initialize orbit controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Create system groups
        Object.keys(AnatomyData.systems).forEach(systemName => {
            const group = new THREE.Group();
            group.name = systemName;
            this.systemGroups.set(systemName, group);
            this.scene.add(group);
        });

        // Load anatomical model
        this.loadAnatomicalModel();
    }

    loadAnatomicalModel() {
        // Heart (more complex geometry)
        this.createHeartModel();

        // Brain (complex geometry)
        this.createBrainModel();

        // Liver
        this.createLiverModel();

        // Additional organs
        this.createStomachModel();
        this.createLungsModel();
    }

    createHeartModel() {
        const heartGeometry = new THREE.Group();

        // Main heart chamber
        const mainHeart = new THREE.Mesh(
            new THREE.SphereGeometry(0.4, 32, 32),
            new THREE.MeshPhongMaterial({ color: 0xff0000 })
        );

        // Additional chambers
        const chamber1 = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 32, 32),
            new THREE.MeshPhongMaterial({ color: 0xff0000 })
        );
        chamber1.position.set(0.3, 0.2, 0);

        const chamber2 = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 32, 32),
            new THREE.MeshPhongMaterial({ color: 0xff0000 })
        );
        chamber2.position.set(-0.3, 0.2, 0);

        heartGeometry.add(mainHeart);
        heartGeometry.add(chamber1);
        heartGeometry.add(chamber2);
        heartGeometry.position.set(0, 0.5, 0);
        heartGeometry.name = 'heart';

        this.organs.set('heart', heartGeometry);
        this.systemGroups.get('circulatory').add(heartGeometry);
    }

    createBrainModel() {
        const brainGeometry = new THREE.Group();

        // Main brain mass
        const mainBrain = new THREE.Mesh(
            new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16),
            new THREE.MeshPhongMaterial({ color: 0xffcccc })
        );

        // Cerebellum
        const cerebellum = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 32, 16),
            new THREE.MeshPhongMaterial({ color: 0xffcccc })
        );
        cerebellum.position.set(0, -0.3, 0);

        brainGeometry.add(mainBrain);
        brainGeometry.add(cerebellum);
        brainGeometry.position.set(0, 1.5, 0);
        brainGeometry.name = 'brain';

        this.organs.set('brain', brainGeometry);
        this.systemGroups.get('nervous').add(brainGeometry);
    }

    createLiverModel() {
        const liverGeometry = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.3, 0.4, 4, 8),
            new THREE.MeshPhongMaterial({ color: 0x800000 })
        );
        liverGeometry.position.set(0.8, 0, 0);
        liverGeometry.name = 'liver';

        this.organs.set('liver', liverGeometry);
        this.systemGroups.get('digestive').add(liverGeometry);
    }

    createStomachModel() {
        const stomachGeometry = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.25, 0.5, 4, 8),
            new THREE.MeshPhongMaterial({ color: 0xf08080 })
        );
        stomachGeometry.position.set(-0.8, 0, 0);
        stomachGeometry.rotation.z = Math.PI / 4;
        stomachGeometry.name = 'stomach';

        this.organs.set('stomach', stomachGeometry);
        this.systemGroups.get('digestive').add(stomachGeometry);
    }

    createLungsModel() {
        const lungsGroup = new THREE.Group();

        // Left lung
        const leftLung = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.2, 0.6, 4, 8),
            new THREE.MeshPhongMaterial({ color: 0xffa07a })
        );
        leftLung.position.set(0.4, 0.7, 0);

        // Right lung
        const rightLung = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.2, 0.6, 4, 8),
            new THREE.MeshPhongMaterial({ color: 0xffa07a })
        );
        rightLung.position.set(-0.4, 0.7, 0);

        lungsGroup.add(leftLung);
        lungsGroup.add(rightLung);
        lungsGroup.name = 'lungs';

        this.organs.set('lungs', lungsGroup);
        this.systemGroups.get('respiratory').add(lungsGroup);
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth * 0.75 / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth * 0.75, window.innerHeight);
    }

    selectOrgan(organ) {
        if (this.selectedOrgan) {
            this.selectedOrgan.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material.emissive.setHex(0x000000);
                }
            });
        }
        if (organ) {
            organ.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material.emissive.setHex(0x555555);
                }
            });
            this.selectedOrgan = organ;
        }
    }
}