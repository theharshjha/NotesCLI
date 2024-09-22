import fs from 'node:fs/promises'
const DBPATH = new URL('../db.json', import.meta.url).pathname;
export async function readDB() {
    const db = await fs.readFile(DBPATH, 'utf-8');
    return JSON.parse(db);
}
export async function writeDB(db) {
    await fs.writeFile(DBPATH, JSON.stringify(db, null, 2));
    return db;
}
export async function insertDB(input) {
    const db = await readDB();
    db.notes.push(input);
    await writeDB(db);
    return db;
}