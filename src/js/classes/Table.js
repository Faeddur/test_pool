import Scene from "./Scene.js";
import uuidv4 from "../functions/uuid.js";

export default class Table {

  /**
   * @type {Scene}
   */
  scene;

  /**
   * @type {string}
   */
  id;

  color = '#13932f';

  _width = 900;
  _height = 500;

  get width() {
    return this.scene.getSize(this._width);
  }

  get height() {
    return this.scene.getSize(this._height);
  }

  get x() {
    return this.scene.width * 0.5 - this.width * 0.5;
  }

  get y() {
    return this.scene.height * 0.5 - this.height * 0.5;
  }

  /**
   * 
   * @param {Scene} scene 
   * @param {string|false} id
   */
  constructor(scene, id = false) {
    this.scene = scene;

    if (!id) {
      this.id = uuidv4();
    } else {
      this.id = id;
    }
  }

  update() {
    this.draw();
  }

  draw() {
    this.scene.ctx.fillStyle = this.color;
    this.scene.ctx.beginPath(); 
    this.scene.ctx.rect(this.x, this.y, this.width, this.height); 
    this.scene.ctx.fill();
  }
}
