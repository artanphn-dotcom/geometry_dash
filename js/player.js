export class Player {
  constructor(groundY) {
    this.groundY = groundY;
    this.x = 180;
    this.y = groundY - 42;
    this.size = 42;
    this.velocityY = 0;
    this.gravity = 0.82;
    this.jumpPower = -14.5;
    this.grounded = true;
    this.rotation = 0;
  }

  reset() {
    this.x = 180;
    this.y = this.groundY - this.size;
    this.velocityY = 0;
    this.grounded = true;
    this.rotation = 0;
  }

  jump() {
    if (this.grounded) {
      this.velocityY = this.jumpPower;
      this.grounded = false;
    }
  }

  update() {
    this.velocityY += this.gravity;
    this.y += this.velocityY;

    if (this.y + this.size >= this.groundY) {
      this.y = this.groundY - this.size;
      this.velocityY = 0;
      this.grounded = true;
    } else {
      this.grounded = false;
    }

    if (!this.grounded) {
      this.rotation += 0.12;
    } else {
      const quarter = Math.round(this.rotation / (Math.PI / 2));
      this.rotation = quarter * (Math.PI / 2);
    }
  }
}
