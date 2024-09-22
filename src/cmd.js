import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { readDB, writeDB, insertDB } from "./db.js";
import { start } from "./server.js";
yargs(hideBin(process.argv))
  .command(
    "new <content> [user]",
    "Create a new note entry",
    (yargs) => {
      return yargs
        .positional("content", {
          describe: "the content of the note",
          type: "string",
        })
        .positional("user", {
          describe: "the name of the user",
          type: "string",
        })
        .option("caps", {
          alias: "c",
          describe: "captialize the content of this note",
          type: "boolean",
          default: false,
        });
    },
    async function (argv) {
      const note = {
        id: Date.now(),
        data: argv.content,
      };
      if (argv.user) {
        note.user = argv.user;
      }
      if (argv.caps) {
        note.data = note.data.toUpperCase();
      }
      await insertDB(note);
    }
  )
  .command(
    "find <filter>",
    "filter notes based on certail value",
    (yargs) => {
      return yargs.positional("filter", {
        describe:
          "The search term to filter notes by, will be applied to note.content",
        type: "string",
      });
    },
    async (argv) => {
      const db = await readDB();
      db.notes.forEach((note) => {
        if (note.data.indexOf(argv.filter) != -1) {
          console.log(note);
        }
      });
    }
  )
  .command(
    "remove <id>",
    "Remove a note by id",
    (yargs) => {
      return yargs.positional("id", {
        describe: "The id of the note you want to remove",
        type: "number",
      });
    },
    async (argv) => {
      const db = await readDB();
      db.notes.forEach((note) => {
        if (note.id == argv.id) {
          db.notes.splice(db.notes.indexOf(note), 1);
        }
      });
      writeDB(db);
    }
  )
  .command(
    "all",
    "get all notes",
    () => {},
    async () => {
      const db = await readDB();
      db.notes.forEach((note) => {
        console.log(note);
      });
    }
  )
  .command(
    "web [port]",
    "open browser to see notes",
    (yargs) => {
      return yargs.positional("port", {
        describe: "Port to bind on",
        default: 5000,
        type: "number",
      });
    },
    async (argv) => {
      const db = await readDB();
      start(argv.port, db.notes);
    }
  )
  .command(
    "clean",
    "remove all notes",
    () => {},
    () => {
      writeDB({ notes: [] });
    }
  )
  .demandCommand(1)
  .parse();
