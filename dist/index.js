"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const file = path_1.default.join(process.cwd(), 'tasks.json');
function load() {
    if (!fs_1.default.existsSync(file))
        return [];
    try {
        return JSON.parse(fs_1.default.readFileSync(file, 'utf8'));
    }
    catch {
        return [];
    }
}
function save(tasks) {
    fs_1.default.writeFileSync(file, JSON.stringify(tasks, null, 2));
}
const args = process.argv.slice(2);
const cmd = args[0];
if (cmd === 'add') {
    const text = args.slice(1).join(' ').trim();
    if (!text) {
        console.log('usage: todo add <text>');
        process.exit(1);
    }
    const tasks = load();
    const id = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    tasks.push({ id, text, done: false });
    save(tasks);
    console.log('added', id, text);
}
else if (cmd === 'list') {
    const tasks = load();
    if (!tasks.length) {
        console.log('no tasks');
        process.exit(0);
    }
    for (const t of tasks)
        console.log(`${t.id} [${t.done ? 'x' : ' '}] ${t.text}`);
}
else if (cmd === 'done') {
    const id = Number(args[1]);
    const tasks = load();
    const t = tasks.find(x => x.id === id);
    if (!t) {
        console.log('not found');
        process.exit(1);
    }
    t.done = true;
    save(tasks);
    console.log('done', id);
}
else if (cmd === 'rm') {
    const id = Number(args[1]);
    const tasks = load().filter(x => x.id !== id);
    save(tasks);
    console.log('removed', id);
}
else {
    console.log('commands: add, list, done, rm');
}
