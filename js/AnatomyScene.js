class AnatomyScene {
    constructor(canvas) {
        this.canvas = canvas;
        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = null;
        this.camera = null;
        this.selectedMesh = null;
        this.organs = new Map();
    }

    createScene() {
        // 创建场景
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.2);

        // 创建相机
        this.camera = new BABYLON.ArcRotateCamera(
            "camera",
            0, Math.PI / 3,
            15,
            BABYLON.Vector3.Zero(),
            this.scene
        );
        this.camera.attachControl(this.canvas, true);
        this.camera.lowerRadiusLimit = 5;
        this.camera.upperRadiusLimit = 30;

        // 添加光源
        const hemisphericLight = new BABYLON.HemisphericLight(
            "light",
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );
        hemisphericLight.intensity = 0.7;

        const pointLight = new BABYLON.PointLight(
            "pointLight",
            new BABYLON.Vector3(0, 5, -5),
            this.scene
        );
        pointLight.intensity = 0.5;

        // 创建基本器官
        this.createOrgans();

        // 添加点击事件
        this.scene.onPointerDown = (evt, pickResult) => {
            if (pickResult.hit) {
                this.selectOrgan(pickResult.pickedMesh);
            }
        };

        return this.scene;
    }

    createOrgans() {
        // 创建心脏
        const heart = BABYLON.MeshBuilder.CreateSphere("heart", {
            segments: 16,
            diameter: 2
        }, this.scene);
        heart.position = new BABYLON.Vector3(0, 2, 0);
        heart.material = new BABYLON.StandardMaterial("heartMaterial", this.scene);
        heart.material.diffuseColor = new BABYLON.Color3(0.8, 0.1, 0.1);
        this.organs.set("heart", heart);

        // 创建肺部（左右）
        const leftLung = BABYLON.MeshBuilder.CreateCapsule("leftLung", {
            radius: 1,
            height: 4
        }, this.scene);
        leftLung.position = new BABYLON.Vector3(2, 2, 0);
        leftLung.material = new BABYLON.StandardMaterial("lungMaterial", this.scene);
        leftLung.material.diffuseColor = new BABYLON.Color3(0.9, 0.7, 0.7);
        this.organs.set("leftLung", leftLung);

        const rightLung = BABYLON.MeshBuilder.CreateCapsule("rightLung", {
            radius: 1,
            height: 4
        }, this.scene);
        rightLung.position = new BABYLON.Vector3(-2, 2, 0);
        rightLung.material = new BABYLON.StandardMaterial("lungMaterial", this.scene);
        rightLung.material.diffuseColor = new BABYLON.Color3(0.9, 0.7, 0.7);
        this.organs.set("rightLung", rightLung);

        // 创建肝脏
        const liver = BABYLON.MeshBuilder.CreateBox("liver", {
            width: 3,
            height: 2,
            depth: 2
        }, this.scene);
        liver.position = new BABYLON.Vector3(1.5, -1, 0);
        liver.material = new BABYLON.StandardMaterial("liverMaterial", this.scene);
        liver.material.diffuseColor = new BABYLON.Color3(0.6, 0.2, 0.2);
        this.organs.set("liver", liver);

        // 创建胃
        const stomach = BABYLON.MeshBuilder.CreateCylinder("stomach", {
            height: 2.5,
            diameterTop: 1.5,
            diameterBottom: 1
        }, this.scene);
        stomach.position = new BABYLON.Vector3(-1.5, -1, 0);
        stomach.material = new BABYLON.StandardMaterial("stomachMaterial", this.scene);
        stomach.material.diffuseColor = new BABYLON.Color3(0.8, 0.6, 0.6);
        this.organs.set("stomach", stomach);
    }

    selectOrgan(mesh) {
        // 重置之前选中的器官
        if (this.selectedMesh) {
            const material = this.selectedMesh.material;
            material.emissiveColor = new BABYLON.Color3(0, 0, 0);
        }

        // 高亮新选中的器官
        if (mesh && this.organs.has(mesh.name)) {
            this.selectedMesh = mesh;
            const material = mesh.material;
            material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);

            // 触发选中事件
            const event = new CustomEvent('organSelected', {
                detail: { organName: mesh.name }
            });
            document.dispatchEvent(event);
        }
    }

    toggleOrganVisibility(organName, visible) {
        const organ = this.organs.get(organName);
        if (organ) {
            organ.setEnabled(visible);
        }
    }

    run() {
        // 运行渲染循环
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        // 处理窗口大小变化
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
}
