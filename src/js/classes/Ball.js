import Scene from "./Scene.js";
import Table from "./Table.js";
import uuidv4 from "../functions/uuid.js";
import utilities from "../utils/utilities.js";

/**
 * @typedef BallSettings
 * @prop {number} radius 
 * @prop {string} color
 * @prop {number} x 
 * @prop {number} y 
 */

export default class Ball {
  /**
   * @type {Scene}
   */
  scene;

  /**
   * @type {string}
   */
  id;

  /**
   * @type {BallSettings}
   */
  defaultConfig = {
    radius: 50,
    color: '#ffffff',
    x: 0,
    y: 0,
  };

  /**
   * @type {BallSettings}
   */
  config = {};

  velocity = {
    x: 0,
    y: 0,
  }

  get radius() {
    return this.scene.getSize(this.config.radius);
  }

  get color() {
    return this.config.color;
  }

  _x = 0;
  _y = 0;

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  /**
   * 
   * @param {Scene} scene 
   * @param {Table} table 
   * @param {string|false} id 
   * @param {BallSettings} config
   */
  constructor(scene, table, id = false, config = {}) {
    this.scene = scene;
    this.table = table;

    if (!id) {
      this.id = uuidv4();
    } else {
      this.id = id;
    }

    this.fillConfig(config);
  }

  fillConfig(config) {
    Object.assign(this.config, this.defaultConfig, config);
    this._x = this.config.x;
    this._y = this.config.y;
  }

  update() {
    this.setCollideBallsVelocity();
    this.setCollideTableVelocity();
    this.affectFriction();
    this.setCoords();
    this.draw();
  }

  draw() {
    
    this.scene.ctx.fillStyle = this.color;
    this.scene.ctx.beginPath();
    this.scene.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.scene.ctx.fill();
  }

  setCoords() {
    this._x += this.velocity.x;
    this._y += this.velocity.y;
  }

  /**
   * 
   * @returns {Ball[]}
   */
  getCollideBalls() {
    const collideBalls = [];

    this.scene.balls.forEach(ball => {
      if (ball.id === this.id) {
        return;
      }

      const collide = utilities.checkCircleCollision(
        this.x,
        this.y,
        this.radius,
        ball.x,
        ball.y,
        ball.radius,
      );

      if (collide) {
        collideBalls.push(ball);
      }
    });

    return collideBalls;
  }

  setCollideBallsVelocity() {
    const balls = this.getCollideBalls();

    if (!balls.length) {
      return;
    }

    balls.forEach(ball => {
      if (ball.id === this.id) {
        return;
      }

      const dx = ball.x - this.x;
      const dy = ball.y - this.y;

      const distance = Math.sqrt(dx ** 2 + dy ** 2);
      const totalRadius = this.radius + ball.radius;

      if (totalRadius < distance) {
        return;
      }

      const nx = dx / distance;
      const ny = dy / distance;

      const relativeVelocityX = ball.velocity.x - this.velocity.x;
      const relativeVelocityY = ball.velocity.y - this.velocity.y;

      const dotProduct = (relativeVelocityX * nx + relativeVelocityY * ny);

      const dot1 = dotProduct * 2  * (this.radius / (this.radius + ball.radius));
      const dot2 = dotProduct * 2  * (ball.radius / (this.radius + ball.radius));
      
      if (dotProduct > 0) {
        return;
      }

      this.velocity.x += (dot2 * nx);
      this.velocity.y += (dot2 * ny);

      ball.velocity.x -= (dot1 * nx);
      ball.velocity.y -= (dot1 * ny);
    });
  }

  setCollideTableVelocity() {
    if (this.x - this.radius < this.table.x && this.velocity.x < 0) {
      this.velocity.x *= -0.8;
    }

    if (this.x + this.radius > this.table.x + this.table.width  && this.velocity.x > 0) {
      this.velocity.x *= -0.8;
    }

    if (this.y - this.radius < this.table.y && this.velocity.y < 0) {
      this.velocity.y *= -0.8;
    }

    if (this.y + this.radius > this.table.y + this.table.height  && this.velocity.y > 0) {
      this.velocity.y *= -0.8;
    }
  }

  affectFriction() {
    this.velocity.x += (0 - this.velocity.x) * 0.01;
    this.velocity.y += (0 - this.velocity.y) * 0.01;

    this.velocity.x = +(this.velocity.x).toFixed(4);
    this.velocity.y = +(this.velocity.y).toFixed(4);
  }
}
