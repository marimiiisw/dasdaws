const { EmbedBuilder } = require('@discordjs/builders');
const Schema = require('../../Models/Welcome.js');

module.exports = 
{
    name: 'guildMemberAdd',
    async execute(member) 
    {  
        Schema.findOne({ Guild: member.guild.id }, async (err, data) => 
        {
            if (!data) return;
            let channel = data.Channel;
            let Msg = data.Msg || " ";
            let role = data.Role;

            const { user, guild } = member;
            const welcomeChannel = member.guild.channels.cache.get(channel);

            const welcomeEmbed = new EmbedBuilder()
                .setTitle("**Yeni üye**")
                .setDescription(Msg + `${members}`)
                .setColor(0x037821)
                .addFields({ name: 'Toplam Üye', value: `${guild.memberCount}`, inline: true })
                .setTimestamp();

            welcomeChannel.send({ embeds: [welcomeEmbed] });
            member.roles.add(role);
        });
    }
};