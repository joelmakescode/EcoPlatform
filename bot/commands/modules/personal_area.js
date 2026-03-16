import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { handleLogin } from "../../handler/handleLogin.js";
import { showChangePasswordModal, showChangePasswordModalBeforeLogin } from "../../user/personal_area/handler/changePasswordHandler.js";


export default {
    data: new SlashCommandBuilder()
        .setName('personal_area')
        .setDescription('Enter your personal area.')

        .addSubcommand(sub => 
            sub   
                .setName('login')
                .setDescription('Login into your personal area.')
        )
        
        .addSubcommandGroup(group => 
            group
                .setName('reset')
                .setDescription('Reset your password.')

                .addSubcommand(sub => 
                    sub
                    .setName('password')
                    .setDescription('Password')
            )
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        await handlers[subcommand](interaction);
    }
};

const handlers = {
    login: async (interaction) => {
        if (interaction.user.id === '906296096995823616' || interaction.user.id === '660101505847787568') {
            await handleLogin(interaction);
        } else {
            await interaction.reply({ content: 'Not allowed.', flags: MessageFlags.Ephemeral });
        }
    },
    password: async (interaction) => {
        await showChangePasswordModalBeforeLogin(interaction);
    }
}