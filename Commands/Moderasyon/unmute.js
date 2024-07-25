const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("untimeout")
        .setDescription("Bir üyenin zaman aşımını kaldırır")
        .addUserOption(option =>
            option.setName("hedef")
                .setDescription("Zaman aşımı kaldırılacak üyeyi seçiniz.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("neden")
                .setDescription("Sebep")
                .setRequired(false)
        ),

    async execute(interaction) {
        const { options, guild } = interaction;
        const user = options.getUser('hedef');
        const reason = options.getString('neden') || 'Neden belirtilmedi';
        const timeMember = guild.members.cache.get(user.id);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
            return await interaction.reply({ content: 'Bu komutu kullanmaya yetkin yok!', ephemeral: true });
        if (!timeMember) return await interaction.reply({ content: 'Bu kullanıcı artık bu sunucuda değil!', ephemeral: true });
        if (!timeMember.moderatable) return await interaction.reply({ content: 'Bu üyenin zaman aşımını kaldıramazsın. Onun rolü çok yüksek.', ephemeral: true });
        if (interaction.member.id == timeMember.id) return await interaction.reply({ content: 'Kendi zaman aşımını kaldıramazsın', ephemeral: true });
        if (timeMember.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'Zaman aşımı komutunu adminler üzerinde uygulayamazsın.', ephemeral: true });

        if (!timeMember.communicationDisabledUntilTimestamp) return await interaction.reply({ content: `**${user.tag}** üyesi zaten bir zaman aşımı almamış.`, ephemeral: true });

        await timeMember.timeout(null, reason);

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('Zaman aşımı Kaldırıldı')
            .addFields(
                { name: 'Üye', value: `> ${user.tag}`, inline: true },
                { name: 'Sebep', value: `> ${reason}`, inline: true }
            )
            .setTimestamp();

        const dmEmbed = new EmbedBuilder()
            .setColor('Blue')
            .setDescription(`⚠️ ${guild.name} sunucusundaki zaman aşımın kaldırıldı. Durumu görüntülemek için sunucuya bakabilirsin | ${reason}`);

        await timeMember.send({ embeds: [dmEmbed] }).catch(err => { return });

        await interaction.reply({ embeds: [embed] });
    }
};
