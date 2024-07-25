const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const leaveSchema = require("../../Models/Leave.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Hadi görüşürüz mesaj sisteminin kurulumunu yapar")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommand(command =>
            command.setName("setup")
                .setDescription("Hadi görüşürüz mesaj sistemini kurar")
                .addChannelOption(option =>
                    option.setName("channel")
                        .setDescription("Hadi görüşürüz mesajlarının gösterileceği kanal")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("leave-message")
                        .setDescription("Hadi görüşürüz mesajı")
                        .setRequired(true)
                )
        )
        .addSubcommand(command =>
            command.setName("remove")
                .setDescription("Hadi görüşürüz mesaj sistemini kaldırır")
        ),

    async execute(interaction) {
        const { options, guild, member } = interaction;

        if (!guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
            return interaction.reply({ content: 'Buna yetkin yok', ephemeral: true });
        }

        const sub = options.getSubcommand();

        switch (sub) {
            case "setup":
                const leaveChannel = options.getChannel("channel");
                const leaveMessage = options.getString("leave-message");

                leaveSchema.findOne({ Guild: guild.id }, async (err, data) => {
                    if (err) {
                        console.error(err);
                        return interaction.reply({ content: 'Bir hata oluştu', ephemeral: true });
                    }

                    if (!data) {
                        await leaveSchema.create({
                            Guild: guild.id,
                            Channel: leaveChannel.id,
                            Message: leaveMessage
                        });
                        return interaction.reply({ content: "Hadi görüşürüz mesaj sistemi başarıyla kuruldu!", ephemeral: true });
                    } else {
                        return interaction.reply({ content: "Hadi görüşürüz mesaj sistemi zaten kurulu!", ephemeral: true });
                    }
                });
                break;

            case "remove":
                leaveSchema.findOne({ Guild: guild.id }, async (err, data) => {
                    if (err) {
                        console.error(err);
                        return interaction.reply({ content: 'Bir hata oluştu', ephemeral: true });
                    }

                    if (!data) {
                        return interaction.reply({ content: "Hadi görüşürüz mesaj sistemi zaten kaldırılmış!", ephemeral: true });
                    } else {
                        await leaveSchema.deleteMany({ Guild: guild.id });
                        return interaction.reply({ content: "Hadi görüşürüz mesaj sistemi başarıyla kaldırıldı!", ephemeral: true });
                    }
                });
                break;
        }
    }
};