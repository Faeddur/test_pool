import Table from "./Table.js";
import Ball from "./Ball.js";
import uuidv4 from "../functions/uuid.js";
import { balls } from "../utils/vars.js";

export default class Scene {
  /**
   * @type {HTMLElement}
   */
  element;

  /**
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * @type {CanvasRenderingContext2D}
   */
  ctx;


  width = Math.max(window.innerHeight, window.innerWidth);
  height = Math.max(window.innerHeight, window.innerWidth);

  /**
   * @type {Table}
   */
  table;

  needsUpdate = {};

  /**
   * @type {Ball[]}
   */
  balls = [];

  /**
   * 
   * @param {string} selector
   */
  constructor(selector) {
    this.element = document.querySelector(selector);

    if (!this.element) {
      return;
    }

    this.createCanvas();
    this.createTable();
    this.createBalls();
    this.addListeners();
    this.loop();
  }

  addListeners() {
    document.documentElement.addEventListener('click', () => {
      this.balls.forEach(ball => {
        ball.velocity.x = Math.random() * 40 - 20;
        ball.velocity.y = Math.random() * 40 - 20;
      });
    });
  }

  loop() {
    this.clearCanvas();
    this.update();
    requestAnimationFrame(this.loop.bind(this));
  }

  createTable() {
    const tableId = uuidv4();
    this.table = new Table(this, tableId);
    this.needsUpdate[tableId] = this.table;
  }

  createBalls() {
    balls.forEach(ball => {

      const {
        x,
        y,
        ...others
      } = ball;

      const ballInstance = new Ball(this, this.table, false, {
        x: this.table.x + (this.table.width / 100 * x),
        y: this.table.y + (this.table.height / 100 * y),
        ...others,
      });

      this.balls.push(ballInstance);

      ballInstance.velocity.x = Math.random() * 40 - 20;
      ballInstance.velocity.y = Math.random() * 40 - 20;
    });
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  update() {
    Object.values(this.needsUpdate).forEach(el => el.update());

    this.balls.forEach(ball => ball.update());
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.canvas.width  = this.width;
    this.ctx.canvas.height = this.height;

    this.element.append(this.canvas);
  }

  /**
   * Get relative size based on width
   * 
   * @param {number} number 
   * @returns {number} Relative size
   */
  getSize(number) {
    return this.width * 0.001 * number;
  }
}
