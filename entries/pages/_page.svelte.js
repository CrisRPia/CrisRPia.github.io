import { c as create_ssr_component, a as subscribe, e as escape, b as each, v as validate_component, n as noop, d as add_attribute } from "../../chunks/ssr.js";
import { w as writable } from "../../chunks/index.js";
class LogicCell {
  flagged = false;
  mined = false;
  discovered = false;
  value = 0;
  highlighted = false;
  forbidden = false;
}
function randInt$1(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
class Board {
  cells;
  size;
  mines;
  flags = 0;
  subscribe;
  setBoard;
  updateBoard;
  constructor(size, mines) {
    this.size = size;
    this.mines = mines;
    this.cells = this.generateBoard();
    this.generateMines();
    this.assignValues();
    const { subscribe: subscribe2, set, update } = writable(this);
    this.subscribe = subscribe2;
    this.setBoard = set;
    this.updateBoard = update;
  }
  expand(x, y) {
    let cell = this.cells[x][y];
    if (!cell.discovered || cell.mined || cell.forbidden) {
      return;
    }
    const flags = this.countAround(x, y, (c) => {
      return c.flagged;
    });
    const correctFlags = this.countAround(x, y, (c) => {
      return c.flagged && c.mined;
    });
    const knownMines = this.countAround(x, y, (c) => {
      return c.discovered && c.mined;
    });
    const fog = this.countAround(x, y, (c) => {
      return !c.discovered && !c.flagged;
    });
    if (fog + flags + knownMines === cell.value || flags + knownMines == cell.value) {
      this.getNeighbors(x, y).forEach((n) => {
        if (flags == correctFlags) {
          let c = this.cells[n[0]][n[1]];
          if (c.mined && !c.discovered && !c.flagged) {
            this.flag(n[0], n[1]);
            return;
          }
        }
        this.discover_animate(n[0], n[1]);
      });
    } else {
      cell.forbidden = true;
    }
    this.updateBoard(() => this);
  }
  hoverIn(x, y) {
    let ns = this.getNeighbors(x, y);
    ns.forEach((n) => {
      this.cells[n[0]][n[1]].highlighted = true;
    });
    this.updateBoard(() => this);
  }
  hoverOut(x, y) {
    let ns = this.getNeighbors(x, y);
    ns.forEach((n) => {
      this.cells[n[0]][n[1]].highlighted = false;
    });
    this.updateBoard(() => this);
  }
  generateMines() {
    for (let _ = 0; _ < this.mines; _++) {
      let i = randInt$1(0, this.size - 1);
      let j = randInt$1(0, this.size - 1);
      while (this.cells[i][j].mined) {
        i = randInt$1(0, this.size - 1);
        j = randInt$1(0, this.size - 1);
      }
      this.cells[i][j].mined = true;
    }
  }
  flag(x, y) {
    let cell = this.cells[x][y];
    if (cell.discovered) {
      return;
    }
    cell.flagged = !cell.flagged;
    this.flags = this.flags + (cell.flagged ? 1 : -1);
    console.log(this.flags);
    this.updateBoard(() => this);
  }
  async discover_animate(x, y) {
    let cell = this.cells[x][y];
    if (cell.flagged) {
      return;
    }
    let queue = [[x, y]];
    let steps = 1;
    while (queue.length != 0) {
      let l = queue.length;
      for (let _ = 0; _ < l; _++) {
        let coords = queue.shift();
        if (coords == void 0) {
          continue;
        }
        cell = this.cells[coords[0]][coords[1]];
        if (cell.value == 0) {
          this.getNeighbors(coords[0], coords[1]).forEach((neighbour) => {
            let c = this.cells[neighbour[0]][neighbour[1]];
            if (!c.discovered) {
              queue.push(neighbour);
            }
          });
        }
        if (cell.flagged) {
          this.flag(coords[0], coords[1]);
        }
        if (cell.mined) {
          this.flags += cell.discovered ? 0 : 1;
          cell.discovered = true;
          this.updateBoard(() => this);
          return;
        }
        cell.discovered = true;
      }
      await sleep(50 / steps);
      steps += 0.5;
      this.updateBoard(() => this);
    }
  }
  assignValues() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.cells[i][j].value = this.calculateValue(i, j);
      }
    }
  }
  calculateValue(x, y) {
    return this.countAround(x, y, (c) => {
      return c.mined;
    });
  }
  getNeighbors(row, column) {
    let neighbours = [];
    const isEvenRow = row % 2 === 0;
    const potentialNeighbours = isEvenRow ? [
      [row - 1, column - 1],
      // top-left
      [row - 1, column - 2],
      // diagonal top-left
      [row - 2, column],
      // diagonal top
      [row - 1, column],
      // top-right
      [row - 1, column + 1],
      // diagonal top-right
      [row, column - 1],
      // left
      [row, column + 1],
      // right
      [row + 1, column - 1],
      // bottom-left
      [row + 1, column - 2],
      // diagonal bottom-left
      [row + 2, column],
      // diagonal bottom
      [row + 1, column],
      // bottom-right
      [row + 1, column + 1]
      // diagonal bottom-right
    ] : [
      [row - 1, column],
      // top-left
      [row - 1, column - 1],
      // diagonal top-left
      [row - 2, column],
      // diagonal top
      [row - 1, column + 1],
      // top-right
      [row - 1, column + 2],
      // diagonal top-right
      [row, column - 1],
      // left
      [row, column + 1],
      // right
      [row + 1, column],
      // bottom-left
      [row + 1, column - 1],
      // diagonal bottom-left
      [row + 2, column],
      // diagonal bottom
      [row + 1, column + 1],
      // bottom-right
      [row + 1, column + 2]
      // diagonal bottom-right
    ];
    for (const [nRow, nColumn] of potentialNeighbours) {
      if (nRow >= 0 && nColumn >= 0 && nRow < this.size && nColumn < this.size) {
        neighbours.push([nRow, nColumn]);
      }
    }
    return neighbours;
  }
  countAround(x, y, checker) {
    let neighbours = this.getNeighbors(x, y);
    let n = 0;
    neighbours.forEach((e) => {
      if (checker(this.cells[e[0]][e[1]])) {
        n++;
      }
    });
    return n;
  }
  generateBoard() {
    let output = Array.from(
      { length: this.size },
      () => Array.from({ length: this.size }, () => new LogicCell())
    );
    return output;
  }
}
let board = new Board(0, 0);
const main_board = writable(board);
const Cell_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "#c.svelte-pqdhr4{transition-duration:150ms;transition-timing-function:ease-in}p.svelte-pqdhr4{transition-duration:150ms;transition-timing-function:ease-in;position:absolute;top:50%;left:50%;font-family:monospace;transform:translate(-50%, -50%)}.hexagon.svelte-pqdhr4{overflow:hidden;visibility:hidden;-webkit-transform:rotate(120deg);-moz-transform:rotate(120deg);-o-transform:rotate(120deg);transform:rotate(120deg)}.hexagon-in1.svelte-pqdhr4{overflow:hidden;width:100%;height:100%;-webkit-transform:rotate(-60deg);-moz-transform:rotate(-60deg);-o-transform:rotate(-60deg);transform:rotate(-60deg)}.hexagon-in2.svelte-pqdhr4{width:100%;height:100%;visibility:visible;-webkit-transform:rotate(-60deg);-moz-transform:rotate(-60deg);-o-transform:rotate(-60deg);transform:rotate(-60deg)}.hexagon2.svelte-pqdhr4{--width:40px;--base_margin:calc(var(--width) * -1.1);width:var(--width);height:calc(var(--width) * 2);margin:calc(var(--base_margin) + 1px) 0 0 calc(var(--width) * 0.05)}",
  map: null
};
const Cell = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $main_board, $$unsubscribe_main_board;
  $$unsubscribe_main_board = subscribe(main_board, (value) => $main_board = value);
  let { width = 30 } = $$props;
  let logic = new LogicCell();
  let { x } = $$props;
  let { y } = $$props;
  let board2 = $main_board;
  board2.subscribe((val) => {
    logic = board2.cells[x][y];
  });
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.x === void 0 && $$bindings.x && x !== void 0)
    $$bindings.x(x);
  if ($$props.y === void 0 && $$bindings.y && y !== void 0)
    $$bindings.y(y);
  $$result.css.add(css$1);
  $$unsubscribe_main_board();
  return `<div class="hexagon hexagon2 inline-block svelte-pqdhr4" style="${"--width: " + escape(width, true) + "px"}"><div class="hexagon-in1 svelte-pqdhr4"><div id="c" tabindex="-1" role="button" class="${"hexagon-in2 hex " + escape(
    logic.forbidden ? "bg-slate-850" : logic.flagged ? "bg-teal-800" : logic.mined && logic.discovered ? "bg-red-800" : logic.discovered ? "bg-slate-800" : "bg-slate-500",
    true
  ) + " w-8 inline-block transition-colors select-none hover:brightness-200 " + escape(logic.highlighted ? "brightness-125" : "", true) + " svelte-pqdhr4"}"><p class="${"" + escape(
    logic.discovered && !logic.mined && logic.value != 0 ? "opacity-100" : "opacity-0",
    true
  ) + " " + escape(logic.forbidden ? "blur text-red-50" : "", true) + " svelte-pqdhr4"}">${escape(logic.value)}</p></div></div> </div>`;
});
const Board_svelte_svelte_type_style_lang = "";
const css = {
  code: "#c.svelte-10velo9{overflow:visible}#wrap.svelte-10velo9{position:fixed;left:50%;top:50%;transform:translateY(-50%)}",
  map: null
};
const Board_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $main_board, $$unsubscribe_main_board;
  $$unsubscribe_main_board = subscribe(main_board, (value) => $main_board = value);
  let { size = 5 } = $$props;
  let { style = "" } = $$props;
  let { mines = Math.floor(size * size * 0.2) } = $$props;
  let scaling = 100;
  main_board.set(new Board(size, mines));
  let board2 = $main_board;
  main_board.subscribe((val) => {
    board2 = val;
  });
  let tx = 0;
  let ty = 0;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.mines === void 0 && $$bindings.mines && mines !== void 0)
    $$bindings.mines(mines);
  $$result.css.add(css);
  $$unsubscribe_main_board();
  return `<div id="wrap" class="overflow-hidden flex items-center justify-center -z-10 svelte-10velo9" style="width: 100vw; height: 100vh; left: 0px; position:absolute"><div id="mover" style="${"transform: translate(" + escape(tx, true) + "px, " + escape(ty, true) + "px);"}"><div id="c" class="relative whitespace-nowrap transition-transform w-fit h-fit svelte-10velo9" style="${"transform: scale(" + escape(scaling / 100, true) + ");"}">${each(board2.cells, (row, x) => {
    return `<div style="${"line-height: 0; vertical-align: top; transform: translateX(" + escape(x % 2 == 0 ? (-50 / board2.size).toString() : "0", true) + "%);"}">${each(row, (_, y) => {
      return `${validate_component(Cell, "Cell").$$render($$result, { x, y, width: 40 }, {}, {})}`;
    })} </div>`;
  })}</div></div> </div>`;
});
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const App = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $main_board, $$unsubscribe_main_board;
  let $board, $$unsubscribe_board = noop, $$subscribe_board = () => ($$unsubscribe_board(), $$unsubscribe_board = subscribe(board2, ($$value) => $board = $$value), board2);
  $$unsubscribe_main_board = subscribe(main_board, (value) => $main_board = value);
  let board2;
  main_board.subscribe(() => {
    $$subscribe_board(board2 = $main_board);
  });
  let s = randInt(10, 20);
  if ($$props.randInt === void 0 && $$bindings.randInt && randInt !== void 0)
    $$bindings.randInt(randInt);
  $$unsubscribe_main_board();
  $$unsubscribe_board();
  return `<div class="relative select-none p-1 w-2/6 bg-opacity-70 font-mono bg-slate-900 z-10 break-all leading-none">${each(
    {
      length: Math.max($board.mines, $board.flags)
    },
    (_, i) => {
      return `${i < $board.flags ? `<span${add_attribute("class", i >= $board.mines ? "text-red-500" : "", 0)}>⬢</span>` : `<span data-svelte-h="svelte-186jiir">⬡</span>`}`;
    }
  )}</div> ${validate_component(Board_1, "Board").$$render($$result, { style: "", size: s }, {}, {})}`;
});
const app = "";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(App, "App").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
