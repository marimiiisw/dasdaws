const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Bir üyenin bilgilerini getirir')
        .addUserOption(option =>
            option.setName('hedef')
                .setDescription('Bilgilerini getirmek istediğin üyeyi seç')
                .setRequired(true)
        ),

    async execute(interaction) {
        const { options, guild } = interaction;
        const user = options.getUser("hedef") || interaction.user;
        const member = await guild.members.cache.get(user.id);
        const icon = user.displayAvatarURL();
        const tag = user.tag;

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setAuthor({ name: tag, iconURL: icon })
            .addFields(
                { name: 'İsim', value: `${user}`, inline: false },
                { name: 'Roller', value: `${member.roles.cache.map(r => r.name).join(", ")}`, inline: false },
                { name: 'Sunucuya katıldığı tarih', value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true },
                { name: 'Discorda katıldığı tarih', value: `<t:${parseInt(member.user.createdAt / 1000)}:R>`, inline: true },
            )
            .setFooter({ text: `Kullanıcı ID: ${user.id}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};