const { EmbedBuilder } = require('@discordjs/builders');
const Schema = require('../../Models/Leave.js');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        Schema.findOne({ Guild: member.guild.id }, async (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            if (!data) return;
            const channel = data.Channel;
            const msg = data.Message || " ";

            const leaveChannel = member.guild.channels.cache.get(channel);

            const leaveEmbed = new EmbedBuilder()
                .setTitle("**Onsuz bir kişi eksik kaldık**")
                .setDescription(msg)  // Üyelerin toplam sayısını göstermek istiyorsanız, buraya bir değişken ekleyin.
                .setColor(0x037821)
                .addFields({ name: 'Toplam Üye', value: `${member.guild.memberCount}`, inline: true })
                .setTimestamp();

            if (leaveChannel) {
                leaveChannel.send({ embeds: [leaveEmbed] });
            }
        });
    }
};