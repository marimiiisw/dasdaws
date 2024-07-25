const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("slowmode")
        .setDescription('Üyenin kaç saniyede bir mesaj göndereceiğini belirleyin.')
        .addIntegerOption(option =>
            option.setName("duration")
                .setDescription("Yavaş modun süresi (saniye)")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Hangi kanala uygulamak istersiniz')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false)
        ),

    async execute(interaction) {
        const { options } = interaction;
        const duration = options.getInteger('duration');
        const channel = options.getChannel('channel') || interaction.channel;

        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setDescription(`✅ ${channel} kanalına ${duration} saniyelik **Yavaş Mod** uygulanmıştır`);

        channel.setRateLimitPerUser(duration).catch(err => {
            console.error(err);
            return interaction.reply({ content: 'Yavaş modu uygularken bir hata oluştu.', ephemeral: true });
        });
        
        await interaction.reply({ embeds: [embed] });
    }
};