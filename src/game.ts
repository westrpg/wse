import { GameUtils } from './game-utils';
import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

export class Game {

    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.FreeCamera;
    private _light: BABYLON.Light;
    private _sharkMesh: BABYLON.AbstractMesh;
    private _groundMesh: BABYLON.AbstractMesh;

    constructor(canvasElement: string) {
        // Create canvas and engine
        this._canvas = <HTMLCanvasElement>document.getElementById(canvasElement);
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    /**
     * Creates the BABYLONJS Scene
     */
    createScene(): void {
        // create a basic BJS Scene object
        this._scene = new BABYLON.Scene(this._engine);
        // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
        this._camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this._scene);
        this._camera.attachControl(this._canvas, true);
        // create a basic light, aiming 0,1,0 - meaning, to the sky
        this._light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0.1), this._scene);
        // create the skybox
        let skybox = GameUtils.createSkybox("skybox", "./assets/texture/skybox/TropicalSunnyDay", this._scene);
        // creates the sandy ground
        let ground = GameUtils.createGround(this._scene);
        // creates the watermaterial and adds the relevant nodes to the renderlist
        let waterMaterial = GameUtils.createWater(this._scene);
        waterMaterial.addToRenderList(skybox);
        waterMaterial.addToRenderList(ground);
        // create a shark mesh from a .obj file
       //63 meshes
           for (let i = 0; i < 63; i++) {
          console.log("Loading models:"+"wse_environment.vox-"+i+".obj");
         GameUtils.createMap("wse_environment.vox-"+i+".obj",0,0,0,this._scene)
          .subscribe(groundMesh => {
              this._groundMesh = groundMesh;
              this._groundMesh.getChildren().forEach(
                  mesh => {
                      waterMaterial.addToRenderList(mesh);
                  }
              );
          });
        }
           
           
           
        // finally the new ui
        let guiTexture = GameUtils.createGUI();
        
        // Button to start shark animation
       

        // Debug Text for Shark coordinates
      //  this._txtCoordinates = GameUtils.createCoordinatesText(guiTexture);

        // Physics engine also works
        let gravity = new BABYLON.Vector3(0, -0.9, 0);
        this._scene.enablePhysics(gravity, new BABYLON.CannonJSPlugin());
        
    }


    /**
     * Starts the animation loop.
     */
    animate(): void {
        this._scene.registerBeforeRender(() => {
            let deltaTime: number = (1 / this._engine.getFps());
        });

        // run the render loop
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }

   

    /**
     * Prints the coordinates of the first vertex of a mesh
     */
    public debugFirstMeshCoordinate(mesh: BABYLON.Mesh) {
        if(!mesh || !mesh.getChildren()) {
            return;
        }
        let firstMesh = (mesh.getChildren()[0] as BABYLON.Mesh) 
        let vertexData = BABYLON.VertexData.ExtractFromMesh(firstMesh);
        let positions = vertexData.positions;
        let firstVertex = new BABYLON.Vector3(positions[0], positions[1], positions[3]);
        
    }

   

}