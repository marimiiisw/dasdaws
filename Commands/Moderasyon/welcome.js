const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const welcomeSchema = require('../../Models/Welcome.js'); // doğru import yapılmalı

module.exports = {
    data: new SlashCommandBuilder()
        .setName("welcome-setup")
        .setDescription("Hoş geldin mesaj sisteminin kurulumunu yapar")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommand(command =>
            command.setName("kur")
                .setDescription("Hoş geldin mesaj sistemini kurar")
                .addChannelOption(option =>
                    option.setName("kanal")
                        .setDescription("Hoş geldin mesajlarının gösterileceği kanal")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("mesaj")
                        .setDescription("Hoş geldin mesajı")
                        .setRequired(true)
                )
                .addRoleOption(option =>
                    option.setName("rol")
                        .setDescription("Üye sunucuya girdiğinde belirlenen rolü verir")
                        .setRequired(true)
                )
        )
        .addSubcommand(command =>
            command.setName("kaldır")
                .setDescription("Hoş geldin mesaj sistemini kaldırır")
        ),

    async execute(interaction) {
        const { guild, options } = interaction;

        const channel = options.getChannel("kanal").id;
        const message = options.getString("mesaj");
        const role = options.getRole("rol").id;

        if (!guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
            return interaction.reply({ content: "Buna yetkin yok", ephemeral: true });
        }

        const sub = options.getSubcommand();
        switch (sub) {
            case "kur":
                welcomeSchema.findOne({ Guild: guild.id }, async (err, data) => {
                    if (err) {
                        console.error(err);
                        return interaction.reply({ content: "Bir hata oluştu.", ephemeral: true });
                    }
                    if (!data) {
                        const newWelcome = new welcomeSchema({
                            Guild: guild.id,
                            Channel: channel,
                            Message: message,
                            Role: role
                        });
                        await newWelcome.save();
                        return interaction.reply({ content: "Hoş geldin mesaj sistemi başarıyla kuruldu!", ephemeral: true });
                    } else {
                        return interaction.reply({ content: "Hoş geldin mesaj sistemi zaten kurulu!", ephemeral: true });
                    }
                });
                break;

            case "kaldır":
                const removedata = await welcomeSchema.findOne({ Guild: guild.id });
                if (!removedata) {
                    return interaction.reply({ content: "Hoş geldin mesaj sistemi zaten kaldırılmış!", ephemeral: true });
                } else {
                    await welcomeSchema.deleteMany({ Guild: guild.id });
                    return interaction.reply({ content: "Hoş geldin mesaj sistemi başarıyla kaldırıldı!", ephemeral: true });
                }
        }
    }
};