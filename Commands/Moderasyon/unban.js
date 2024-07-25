const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Guild } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Bir üyenin banını kaldırır')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('banını kaldırmak istediğin üyenin ID bilgilerini gir')
                .setRequired(false)
        ),

    async execute(interaction) {
        const { options, guild} = interaction;
        const userid = options.getString('userid');
        const reason = options.getString('sebep') || 'Neden belirtilmedi';

        try {
            await guild.members.unban(userid)
            const embed = new EmbedBuilder()
                .setColor('Green')
                .setDescription(`${userid} Kulanıcısının banı kaldırıldı.`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (e) {
            console.log(e);
            const errembed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`Geçerli bir ID giriniz.`)

            await interaction.reply({ embeds: [errembed], ephemeral: true});
        }
    }
};