/*
 * The Game Code is heavily inspired by Mary Rose Cook' Space Invaders.
 * - Conference Talk: https://www.youtube.com/watch?v=hbKN-9o5_Z0&t=4s
 * - Code: https://github.com/maryrosecook/retro-games/blob/master/space-invaders/space-invaders.js
 */

import { useEffect, useRef, useState } from 'react';
import type { LinksFunction } from 'remix';
import { PageHeading } from '~/components/UI/headings';

export const links: LinksFunction = () => {
  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap' },
  ];
};

class KeyboardController {
  pressed: Record<string, boolean> = {};
  keys: Record<string, string> = {
    Space: ' ',
  };
  constructor() {
    window.addEventListener('keydown', this.#onkeyDown);
    window.addEventListener('keyup', this.#onkeyUp);
    window.addEventListener('touchstart', this.#onTouchDown);
    window.addEventListener('touchend', this.#onTouchUp);
  }

  #onkeyDown = (e: KeyboardEvent) => {
    this.pressed[e.key] = true;
  };

  #onkeyUp = (e: KeyboardEvent) => {
    this.pressed[e.key] = false;
  };

  #onTouchDown = () => {
    this.pressed[' '] = true;
  };

  #onTouchUp = () => {
    this.pressed[' '] = false;
  };

  unmount = () => {
    window.removeEventListener('keydown', this.#onkeyDown);
    window.removeEventListener('keyup', this.#onkeyUp);
    window.removeEventListener('touchstart', this.#onTouchDown);
    window.removeEventListener('touchend', this.#onTouchUp);
  };
}

interface GameElement {
  update: () => void;
  draw: () => void;
}

interface Body extends GameElement {
  game: Game;
  size: { x: number; y: number };
  center: { x: number; y: number };
}

interface Player extends Body {}

class Player implements Player {
  constructor(game: Game) {
    this.game = game;
    this.size = { x: 20, y: 20 };
    this.center = { x: game.gameSize.x / 8, y: game.gameSize.y - this.game.gameSize.padding };
  }

  update = () => {
    if (this.isColliding()) {
      this.game.gameOver();
    }
    if (!this.#playerinAir() && this.game.keyboarder.pressed[this.game.keyboarder.keys.Space]) {
      const boostUp = -1 * (this.game.gameSize.y / 1.5);
      this.center.y += boostUp;
    } else if (this.#playerinAir()) {
      this.center.y += 3;
    }
  };

  #playerinAir = () => {
    return this.center.y < this.game.gameSize.y - this.game.gameSize.padding;
  };

  draw = () => {
    this.game.drawRect(this);
  };

  isColliding = () => {
    return this.game.bodies.some((obstacle) => {
      return this.game.isColliding(this, obstacle);
    });
  };
}

interface Obstacle extends Body {
  velocity: { x: number; y: number };
}

class Obstacle implements Obstacle {
  constructor(game: Game, velocity: { x: number; y: number }) {
    this.game = game;
    this.velocity = velocity;
    this.size = { x: 20, y: 20 };
    this.center = { x: game.gameSize.x, y: Math.random() * (game.gameSize.y - this.size.y - game.gameSize.padding) };
  }

  draw = () => {
    this.game.drawRect(this);
  };

  update = () => {
    this.center.x += this.velocity.x;
    if (this.center.x < 0) {
      this.game.bodies = this.game.bodies.filter((body) => body !== this);
    }
  };
}

type GameConfig = {
  audio: boolean;
  hard: boolean;
  sounds: {
    backgroundHard: string;
    background: string;
    gameOver: string;
  };
};

interface Game {
  screen: CanvasRenderingContext2D;
  gameSize: { x: number; y: number; padding: number };
  bodies: Array<Body>;
  keyboarder: KeyboardController;
  unmount: () => void;
  gameOver: () => void;
  startGame: () => void;
  hasStarted: boolean;
  hasLost: boolean;
  config: GameConfig;
  sounds: {
    background?: HTMLAudioElement;
    gameOver?: HTMLAudioElement;
  };
  playSound: (audio?: HTMLAudioElement, repeat?: boolean) => void;
  stopSound: (audio?: HTMLAudioElement) => void;
  drawRect: (body: Body) => void;
}

class Game implements Game {
  #interval: number | undefined;
  #timeout: number | undefined;

  constructor(canvas: HTMLCanvasElement, config: GameConfig) {
    const context = canvas.getContext('2d');
    if (!context) throw Error('Canvas 2D context is not available');
    this.screen = context;
    this.config = config;
    this.gameSize = {
      x: canvas.width,
      y: canvas.height,
      padding: 40,
    };
    this.keyboarder = new KeyboardController();
    this.sounds = {
      background: new Audio(config.hard ? config.sounds.backgroundHard : config.sounds.background),
      gameOver: new Audio(config.sounds.gameOver),
    };
    this.hasStarted = false;
    this.hasLost = false;
    this.bodies = [new Player(this)];
    this.#tick();
  }

  startGame = () => {
    this.hasStarted = true;
    this.#interval = window.setInterval(
      () => {
        this.bodies.push(new Obstacle(this, { x: -7, y: 0 }));
      },
      this.config.hard ? 500 : 700,
    );
    this.playSound(this.sounds.background, true);
  };

  update = () => {
    if (!this.hasLost) {
      this.bodies.forEach((body) => {
        body.update();
      });
    }
    if (!this.#timeout && !this.hasStarted && this.keyboarder.pressed[this.keyboarder.keys.Space]) {
      this.startGame();
    } else if (this.hasLost && this.keyboarder.pressed[this.keyboarder.keys.Space]) {
      this.hasStarted = false;
      this.hasLost = false;
      this.bodies = [new Player(this)];
      this.#timeout = window.setTimeout(() => {
        this.#timeout = undefined;
      }, 1000);
    }
  };

  draw = () => {
    this.screen.fillStyle = 'rgb(45 212 191)';
    this.screen.fillRect(0, 0, this.gameSize.x, this.gameSize.y);
    this.bodies.forEach((body) => {
      body.draw();
    });
    if (this.hasLost) {
      this.drawMessage('You lost!');
    } else if (!this.hasStarted) {
      this.drawMessage('Press Space to Start!');
    }
  };

  drawRect = (body: Body) => {
    this.screen.fillStyle = '#000000';
    this.screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2, body.size.x, body.size.y);
  };

  drawMessage = (message: string) => {
    this.screen.fillStyle = '#000000';
    this.screen.font = "30px 'Press Start 2P'";
    this.screen.fillText(message, this.gameSize.padding, this.gameSize.y / 2);
  };

  isColliding = (b1: Body, b2: Body) => {
    return !(
      b1 === b2 ||
      b1.center.x + b1.size.x / 2 <= b2.center.x - b2.size.x / 2 ||
      b1.center.y + b1.size.y / 2 <= b2.center.y - b2.size.y / 2 ||
      b1.center.x - b1.size.x / 2 >= b2.center.x + b2.size.x / 2 ||
      b1.center.y - b1.size.y / 2 >= b2.center.y + b2.size.y / 2
    );
  };

  stopGame = () => {
    this.stopSound(this.sounds.background);
    window.clearInterval(this.#interval);
    this.hasStarted = false;
  };

  gameOver = () => {
    this.stopSound(this.sounds.background);
    window.clearInterval(this.#interval);
    this.hasLost = true;
    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate(500);
    }
    this.playSound(this.sounds.gameOver);
  };

  playSound = (sound?: HTMLAudioElement, repeat = false) => {
    if (this.config.audio && sound) {
      sound.load();
      sound.play();
      if (repeat) {
        sound.addEventListener('ended', () => {
          sound.play();
        });
      }
    }
  };

  stopSound = (sound?: HTMLAudioElement) => {
    if (this.config.audio && sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  };

  #tick = () => {
    this.update();
    this.draw();
    requestAnimationFrame(this.#tick);
  };

  unmount = () => {
    this.stopGame();
    this.keyboarder.unmount();
  };
}

export default function JumpNRunGame() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [hard, setHard] = useState(false);
  const [audio, setAudio] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const game = new Game(ref.current, {
      audio,
      hard,
      sounds: {
        background: 'https://andre-landgraf-s3-bucket.s3.eu-west-1.amazonaws.com/jumpnrun/melody.mp3',
        backgroundHard: 'https://andre-landgraf-s3-bucket.s3.eu-west-1.amazonaws.com/jumpnrun/melody-hard.mp3',
        gameOver: 'https://andre-landgraf-s3-bucket.s3.eu-west-1.amazonaws.com/jumpnrun/game-over.mp3',
      },
    });

    return () => {
      game.unmount();
    };
  }, [hard, audio]);

  return (
    <div className="flex flex-col gap-10 w-full font-gamified">
      <PageHeading>Jump n Run</PageHeading>
      <div className="flex flex-col gap-5">
        <section className="ml-2 flex flex-col lg:flex-row gap-5 lg:gap-10">
          <h3 className="sr-only">Game Controls</h3>
          <label className="flex gap-2 items-center">
            Audio?:{' '}
            <input
              className="transform scale-150"
              type="checkbox"
              checked={audio}
              onChange={() => setAudio((a) => !a)}
            />
          </label>
          <label className="flex gap-2 items-center">
            Hard Mode?:{' '}
            <input className="transform scale-150" type="checkbox" checked={hard} onChange={() => setHard((h) => !h)} />
          </label>
        </section>
        <div>
          <canvas ref={ref} className="rounded-md border-4 border-black max-w-full" width="800" height="300"></canvas>
        </div>
      </div>
    </div>
  );
}
