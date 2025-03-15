class SceneManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container not found:', containerId);
            return;
        }
        console.log('Container dimensions:', {
            width: this.container.clientWidth,
            height: this.container.clientHeight
        });

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
        console.log('Renderer size:', {
            width: this.renderer.domElement.width,
            height: this.renderer.domElement.height
        });
        this.container.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.set(0, 0, 3);  // 调整摄像机距离
        this.camera.lookAt(0, 0, 0);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight2.position.set(-1, -1, -1);
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
        this.scene.add(directionalLight2);

        // Add test cube
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x00ff00,
            shininess: 30
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 0, 0);  // 确保立方体在原点
        this.scene.add(cube);
        console.log('Test cube added to scene');

        // Initialize orbit controls
        try {
            if (typeof THREE.OrbitControls === 'undefined') {
                console.error('OrbitControls is not available');
                return;
            }
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.enableZoom = true;  // 确保可以缩放
            console.log('OrbitControls initialized successfully');
        } catch (error) {
            console.error('Failed to initialize OrbitControls:', error);
        }

        // Create system groups but don't load anatomical model yet
        Object.keys(AnatomyData.systems).forEach(systemName => {
            const group = new THREE.Group();
            group.name = systemName;
            this.systemGroups.set(systemName, group);
            this.scene.add(group);
        });
        // Start with just the test cube, comment out anatomical model loading for now
        // this.loadAnatomicalModel();
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
            new THREE.MeshPhongMaterial({ 
                color: 0xff0000,
                shininess: 30
            })
        );

        // Additional chambers
        const chamber1 = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 32, 32),
            new THREE.MeshPhongMaterial({ 
                color: 0xff0000,
                shininess: 30
            })
        );
        chamber1.position.set(0.3, 0.2, 0);

        const chamber2 = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 32, 32),
            new THREE.MeshPhongMaterial({ 
                color: 0xff0000,
                shininess: 30
            })
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
            new THREE.SphereGeometry(0.3, 32, 32),
            new THREE.MeshPhongMaterial({ 
                color: 0xffcccc,
                shininess: 20
            })
        );

        // Cerebellum
        const cerebellum = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 32, 16),
            new THREE.MeshPhongMaterial({ 
                color: 0xffcccc,
                shininess: 20
            })
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
            new THREE.SphereGeometry(0.3, 32, 16),
            new THREE.MeshPhongMaterial({ 
                color: 0x800000,
                shininess: 15
            })
        );
        liverGeometry.position.set(0.8, 0, 0);
        liverGeometry.scale.set(1.5, 1, 0.8);
        liverGeometry.name = 'liver';

        this.organs.set('liver', liverGeometry);
        this.systemGroups.get('digestive').add(liverGeometry);
    }

    createStomachModel() {
        const stomachGeometry = new THREE.Mesh(
            new THREE.SphereGeometry(0.25, 32, 16),
            new THREE.MeshPhongMaterial({ 
                color: 0xf08080,
                shininess: 25
            })
        );
        stomachGeometry.position.set(-0.8, 0, 0);
        stomachGeometry.scale.set(1, 1.5, 0.8);
        stomachGeometry.rotation.z = Math.PI / 4;
        stomachGeometry.name = 'stomach';

        this.organs.set('stomach', stomachGeometry);
        this.systemGroups.get('digestive').add(stomachGeometry);
    }

    createLungsModel() {
        const lungsGroup = new THREE.Group();

        // Left lung
        const leftLung = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 32, 16),
            new THREE.MeshPhongMaterial({ 
                color: 0xffa07a,
                shininess: 20
            })
        );
        leftLung.position.set(0.4, 0.7, 0);
        leftLung.scale.set(1, 1.8, 0.8);

        // Right lung
        const rightLung = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 32, 16),
            new THREE.MeshPhongMaterial({ 
                color: 0xffa07a,
                shininess: 20
            })
        );
        rightLung.position.set(-0.4, 0.7, 0);
        rightLung.scale.set(1, 1.8, 0.8);

        lungsGroup.add(leftLung);
        lungsGroup.add(rightLung);
        lungsGroup.name = 'lungs';

        this.organs.set('lungs', lungsGroup);
        this.systemGroups.get('respiratory').add(lungsGroup);
    }

    render() {
        if (this.controls) {
            this.controls.update();
        }
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