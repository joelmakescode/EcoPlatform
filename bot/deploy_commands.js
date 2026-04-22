import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { REST, Routes } from "discord.js";
import config from "./config.json" with { type: "json" };

// Recreate __filename / __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);

        // ES module dynamic import
        const command = (await import(`file://${filePath}`)).default;

        if (command?.data && command?.execute) {
            commands.push(command.data.toJSON());
        } else {
            console.warn(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            );
        }
    }
}

const rest = new REST({ version: "10" }).setToken(config.token);

// --------------------- Command Deletion Examples ---------------------

/* (async () => {
    try {
        console.log("Deleting guild command...");
        await rest.delete(
            Routes.applicationGuildCommand(
                config.clientID,
                "1315665248258363462",   // GUILD ID
                "1478366091519725720"    // COMMAND ID
            )
        );
        console.log("Guild command deleted.");
    } catch (error) {
        console.error(error);
    }
})(); */

// --------------------------------------------------------------------- /

(async () => {
    try {
        console.log(
            `Started refreshing ${commands.length} application (/) commands.`
        );

        const data = await rest.put(
            Routes.applicationCommands(config.clientID),
            { body: commands }
        );

        console.log(
            `Successfully reloaded ${data.length} application (/) commands.`
        );
    } catch (error) {
        console.error(error);
    }
})();
