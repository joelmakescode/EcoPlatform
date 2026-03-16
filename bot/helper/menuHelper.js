import { translate, whatLanguage } from "./translator.js";
import en from '../json/languages/en.json' with { type: "json" };
import de from '../json/languages/de.json' with { type: "json" };
import { StringSelectMenuBuilder } from "discord.js";
import client from "../client.js";

const languages = { en, de };

export function createMenu(menu) {
    return new StringSelectMenuBuilder()
        .setCustomId(menu.customId)
        .setPlaceholder(menu.placeholder)
        .addOptions(...menu.options)
        .setMaxValues(1);
}

export async function determineMenu(userId, menuString, users) {
    const menu = {
        customId: `${menuString}_string_select`,
        placeholder: translate(userId, `${menuString}.placeholder`),
        options: await determineOptions(userId, menuString, users)
    }

    return menu;
}

async function determineOptions(userId, menu, users) {
    const language = whatLanguage(userId);
    const langFile = languages[language] ?? languages.en;

    const menuSection = langFile[menu];
    if (!menuSection) return [];

    let menuOptions = [];

    if (menu !== 'main_menu') {
        menuOptions.push({ label: `${translate(userId, 'standard_menu_option.back')}`, value: 'back' });
    }

    if (users) {
        for (const user of users) {
            const userdata = await client.users.fetch(user);

            menuOptions.push({ label: userdata.displayName, value: user });
        }

        return menuOptions;
    }

    for (const [key, value] of Object.entries(menuSection)) {
        if (key === 'content' || key === 'placeholder' || key === 'roles' || key.includes("Content")) continue;

        menuOptions.push({
            label: translate(userId, `${menu}.${key}`), value: key
        });
    }

    return menuOptions;
}