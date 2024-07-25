const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Kullanıcaya bir zaman aşımı yapar")
        .addUserOption(option =>
            option.setName("hedef")
                .setDescription("Zaman aşımı uygulanacak üyeyi seçiniz.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("sure")
                .setDescription("Zaman aşımı yapacak süreyi giriniz")
                .setRequired(true)
                .addChoices(
                    { name: '60 Seconds', value: '60' },
                    { name: '2 Minutes', value: '120' },
                    { name: '5 Minutes', value: '300' },
                    { name: '10 Minutes', value: '600' },
                    { name: '15 Minutes', value: '900' },
                    { name: '20 Minutes', value: '1200' },
                    { name: '30 Minutes', value: '1800' },
                    { name: '45 Minutes', value: '2700' },
                    { name: '1 Hour', value: '3600' },
                    { name: '2 Hours', value: '7200' },
                    { name: '3 Hours', value: '10800' },
                    { name: '5 Hours', value: '18000' },
                    { name: '10 Hours', value: '36000' },
                    { name: '1 Day', value: '86400' },
                    { name: '2 Days', value: '172800' },
                    { name: '3 Days', value: '259200' },
                    { name: '5 Days', value: '432000' },
                    { name: '1 Week', value: '604800' },
                    { name: '2 Weeks', value: '1209600' },
                    { name: '1 Month', value: '2592000' },
                    { name: '2 Months', value: '5184000' },
                    { name: '3 Months', value: '7776000' },
                    { name: '4 Months', value: '10368000' }
                )
        )
        .addStringOption(option =>
            option.setName("neden")
                .setDescription("Zaman aşımı yapacak sebep giriniz")
                .setRequired(false)
        ),

    async execute(interaction) {
        const { options, guild } = interaction;
        const user = options.getUser('hedef');
        const duration = options.getString('sure');
        const reason = options.getString('neden') || 'Neden belirtilmedi';
        const timeMember = guild.members.cache.get(user.id);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
            return await interaction.reply({ content: 'Bu komutu kullanmaya yetkin yok!', ephemeral: true });
        if (!timeMember) return await interaction.reply({ content: 'Bu kullanıcı artık bu sunucuda değil!', ephemeral: true });
        if (!timeMember.kickable) return await interaction.reply({ content: 'Bu üyeye zaman aşımı uygulayamazsın. Onun rolü susturulmak için çok yüksek.', ephemeral: true });
        if (interaction.member.id == timeMember.id) return await interaction.reply({ content: 'Kendini susturamazsın', ephemeral: true });
        if (timeMember.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'Zaman aşımı komutunu adminler üzerinde uygulayamazsın.', ephemeral: true });

        await timeMember.timeout(duration * 1000, reason);

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Zaman aşımı Uygulandı')
            .addFields(
                { name: 'Üye', value: `> ${user.tag}`, inline: true },
                { name: 'Zaman', value: `> ${duration / 60} dakika`, inline: true },
                { name: 'Sebep', value: `> ${reason}`, inline: true }
            )
            .setTimestamp();

        const dmEmbed = new EmbedBuilder()
            .setColor('Blue')
            .setDescription(`⚠️ ${guild.name} sunucusunda sana zaman aşımı uygulandı. Durumu görüntülemek için sunucuya bakabilirsin | ${reason}`);

        await timeMember.send({ embeds: [dmEmbed] }).catch(err => { return });

        await interaction.reply({ embeds: [embed] });
    }
};