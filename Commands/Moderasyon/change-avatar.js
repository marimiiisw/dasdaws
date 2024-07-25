const {SlashCommandBuilder, EmbedBuilder, IntegrationApplication, Client} = require('discord.js')
const { data, execute } = require('./slowmode')

module.exports =
{
    data: new SlashCommandBuilder()
        .setName('change-avatar')
        .setDescription('Botun avatarını değiştir')
        .addAttachmentOption(option =>
            option.setName('avatar')
                .setDescription('Botun yeni avatarı')
                .setRequired(true)
        ),

    async execute(interaction)
    {
        const {options, Client} = interaction;
        const image = options.getAttachment('avatar')
        const avatar = image.url;

        if(interaction.user.id != '955037168932376576') return await interaction.reply({content: 'Sadece **Geliştiriciler** bu komutu kullanabilir.', ephemeral: true});

        await interaction.deferReply({ephemeral: true});

        const changed = await Client.user.setAvatar(avatar).catch(err =>
        {
            interaction.editReply({content: `Bir hata oluştu ${err}`, ephemeral: true});
        });
         
        if(changed)
        {
            const embed = new EmbedBuilder()
            .setColor('DarkAqua')
            .setDescription('✒️ Yeni avatar ayarlandı')
            await interaction.editReply({embeds: [embed], ephemeral: true});
        }

        else return;
    }
}