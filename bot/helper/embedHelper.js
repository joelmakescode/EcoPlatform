import { EmbedBuilder } from "discord.js";
import { translate } from "./translator.js";


export function createEmbed(interaction, userId, title, description, fields, color, thumbnail, extraDescription) {
    const embed = new EmbedBuilder()
        .setTitle(translate(userId, title))
        .setDescription(`${translate(userId, description)} ${extraDescription}`)
        .setTimestamp()
        .setFooter({ text: 'JW', iconURL: interaction.client.user.displayAvatarURL() });

    if (fields?.length) embed.addFields(fields);
    if (color) embed.setColor(color);
    if (thumbnail) embed.setThumbnail(thumbnail);

    return embed;
}