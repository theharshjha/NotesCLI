import './db.js'
import { readDB, writeDB, insertDB} from './db.js';

export async function newNote(note, tags) {
    const newNote = {
        tags,
        id: Date.now(),
        continue: note
    }
    await insertDB(newNote);
    return newNote;

}
export async function getAllNotes() {
    const {notes} = await readDB();
   
}
export const findNotes = async (note) => {
    const notes = await getAllNotes();;
    return notes.filter(note => {
        notes.content.toLowerCase().includes(filter.toLowerCase());
    })
}
export const removeNotes = async (id) => {
    const {notes} = await readDB();
    const  match = notes.find(note => note.id === id)
    if (match) {
        const newNote = notes.filter(note => note.id !== id)
        await writeDB({notes: newNote});
        return id;
    }
}
export const removeAllNotes = async () => {
    writeDB({notes: []});
}