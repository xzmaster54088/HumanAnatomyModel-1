class SceneManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth * 0.75 / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.organs = new Map();
        this.selectedOrgan = null;
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth * 0.75, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        this.container.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.z = 5;

        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);

        // Initialize orbit controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Load initial anatomical model
        this.loadAnatomicalModel();
    }

    loadAnatomicalModel() {
        // Create basic geometries for demonstration
        // In a real application, you would load detailed 3D models
        this.createBasicOrganModel('heart', 0xff0000, new THREE.Vector3(0, 0.5, 0));
        this.createBasicOrganModel('brain', 0xffcccc, new THREE.Vector3(0, 1.5, 0));
        this.createBasicOrganModel('liver', 0x800000, new THREE.Vector3(0.5, 0, 0));
    }

    createBasicOrganModel(name, color, position) {
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: color });
        const organ = new THREE.Mesh(geometry, material);
        organ.position.copy(position);
        organ.name = name;
        this.organs.set(name, organ);
        this.scene.add(organ);
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
            this.selectedOrgan.material.emissive.setHex(0x000000);
        }
        if (organ) {
            organ.material.emissive.setHex(0x555555);
            this.selectedOrgan = organ;
        }
    }
}
