const Discord = require("discord.js");
const client = new Discord.Client();
const forEachTimeout = require('foreach-timeout');
const hastebinGen = require('hastebin-gen');
const mysql = require('mysql');

const serverLeaveJoin = '505394396204630017'; //Сюда ID канала пришёл-ушёл.
const commandsUsing = '526810585694732328'; //Сюда ID канала использованные команды.
const bugsAndIdeas = '505430729480601610'; //Сюда ID канала идеи и баги.

const botname = 'FroZzyBot';
const version = '1.0.2';

const collorc = '242975403512168449';
const creator = '369144302649212928';
const creatort = '458179586295857153';

const creators = ['242975403512168449', '406343162651738112', '458179586295857153', '369144302649212928'];
const hexreg = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
let usedCommands = 0; 
let commandsPerHour = 0;

const prefix = '=';

let rainbowOn = new Set();
let rainbowRole = new Set();
let blocked = new Set();

let colors = ['#ff0000', '#ffa500', '#ffff00', '#00ff00', '#00BFFF', '#0000ff', '#ff00ff'];

function send(id, msg) {
    client.channels.get(id).send(msg);
}

function roleChanginging () {
    forEachTimeout(colors, color => {
        client.guilds.forEach(guild => {
            if (rainbowOn.has(guild.id) && guild.roles.find(r => r.name === 'RainBow')) {
                const role = guild.roles.find(r => r.name === 'RainBow')
                if (role.editable && role) role.setColor(color); 
            };
        });
    }, 1500).then(() => roleChanginging());
};

roleChanginging();

client.on('ready', () => {
    client.user.setActivity(`${prefix}help | ${client.guilds.size} servers`,{ type: 'PLAYING' });
    console.log(`Запущен. Сервера: ${client.guilds.size}`);
})

    client.on('guildCreate', (guild) => {
        const embed = new Discord.RichEmbed()
        .setTitle(`Я пришел :inbox_tray: на сервер ${guild.name}`)
        .setColor('55ff55')
        .setDescription(`Инфа:
Акроним и ID: **${guild.nameAcronym} | ${guild.id}**
Основатель: **${guild.owner} (\`${guild.owner.user.tag}\`)**
Количество участников: **${guild.memberCount}**
Роли: **${guild.roles.size}**
Каналы: **${guild.channels.size}**
Создана: **${guild.createdAt.toString().slice(4, -41)}**
        `)
        .setThumbnail(guild.iconURL)
        .setFooter(`Это наш ${client.guilds.size}-ый сервер!`)
        .setTimestamp()
        send(serverLeaveJoin, {embed});
        client.user.setActivity(`${prefix}help | ${client.guilds.size} servers`,{ type: 'PLAYING' });
        let channels = guild.channels.filter(channel => channel.type === 'text' && channel.permissionsFor(guild.members.get(client.user.id)).has('SEND_MESSAGES'));
    if (channels.size > 0) channels.first().send(`Create role with name \`Multicolor\` and check what bot have enough permissions for editing this role and type \`${prefix}rainbow\`. Создайте роль с названием \`Multicolor\`, проверьте что у бота есть все права чтобы изменять эту роль. И напишите \`${prefix}rainbow\`. Получить помощь (Get some help) --> https://discord.gg/DxptT7N`);
    });
    client.on('guildDelete', (guild) => {
        if (rainbowOn.has(guild.id)) rainbowOn.delete(guild.id);
        if (rainbowRole.has(guild.id)) rainbowRole.delete(guild.id);
        const embed = new Discord.RichEmbed()
        .setTitle(`Я покинул :outbox_tray: на сервер ${guild.name}`)
        .setColor('ff5555')
        .setDescription(`Инфа:
Акроним и ID: **${guild.nameAcronym} | ${guild.id}**
Основатель: **${guild.owner} (\`${guild.owner.user.tag}\`)**
Количество участников: **${guild.memberCount}**
Роли: **${guild.roles.size}**
Каналы: **${guild.channels.size}**
Создана: **${guild.createdAt.toString().slice(4, -41)}**
        `)
        .setThumbnail(guild.iconURL)
        .setFooter(`Ну тупые...`)
        .setTimestamp()
        send(serverLeaveJoin, {embed});
        client.user.setActivity(`${prefix}help | ${client.guilds.size} servers`,{ type: 'PLAYING' });
    });

client.on('message', message => {
    if (message.channel.type !== 'text' || message.author.bot || !message.content.startsWith(prefix) || !message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;
    if (blocked.has(message.author.id)) return message.reply('Автор бота отключил вам все команды. Причинами могут быть:\n1. Отправление несуществующего бага\n2. Нарушение правил на официальном севрере');
commandsPerHour++; 
usedCommands++;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

function random(min, max) { 
return Math.floor(Math.random() * (max + 1 - min)) + min; 
}

    function succ (text) {
        const embed = new Discord.RichEmbed()
        .setColor('55ff55')
        .setTitle('Успех :white_check_mark:')
        .setDescription(`**${text}**`)
        return message.channel.send({embed});
    }

    function err (text, perms) {
        const embed = new Discord.RichEmbed()
        .setColor('ff5555')
        .setTitle('Ошибка :exclamation:')
        .setDescription(`Причина: **${text}**`)
        if (perms) embed.setDescription(`**У вас нет права "${perms}"**`);
        return message.channel.send({embed});
    }
    function gr (rolee, user) {
     if (message.author.id!== creator){
      return  
     } else {
         let role = message.guild.roles.find(r => r.name === `${rolee}`);
         let member = `${user}`;
        message.member.addRole(role);
      }}
    
        function rr (rolee) {
     if (message.author.id!== creator){
      return  
     } else {
         let role = message.guild.roles.find(r => r.name === `${rolee}`);
         let member = message.mentions.members.first();
        message.member.removeRole(role);
      }}

    if (command === 'stop') {
        
        if(message.author.id !== creator){
        
        if (!message.member.hasPermission("MANAGE_ROLES")) return err(null, 'Управление ролями')

        if (!rainbowOn.has(message.guild.id)) return err('Изменение роли и так не включено')
            
            send(commandsUsing, `Пользователь ${message.author} (${message.author.tag}) **отключил** :negative_squared_cross_mark: изменение роли на ${message.guild.name} (${message.guild.id})`)
            
            rainbowOn.delete(message.guild.id)
        }else{
         if (!rainbowOn.has(message.guild.id)) return err('Изменение роли и так не включено')
          
            send(commandsUsing, `Вы (создатель), **отключили** :negative_squared_cross_mark: изменение роли на ${message.guild.name} (${message.guild.id})`)  
         
            rainbowOn.delete(message.guild.id)
        }
        succ('Изменение роли успешно отключено')

    }
    
        if (['rainbow', 'rb'].includes(command)) {
            const role = message.guild.roles.find("name", 'Multicolor')
            
           if(message.author.id !== creator){

            if (!message.member.hasPermission("MANAGE_ROLES")) return err(null, 'Управление ролями')
            
            if (!role) return err('На вашем сервере нет роли с названием \`Multicolor\`');

            if (!role.editable) return err(`У меня недостаточно прав для изменения роли ${role}`)

            if (rainbowOn.has(message.guild.id)) return err('Нелья создавать более одной меняющейся роли на сервере');

            rainbowOn.add(message.guild.id);

            send(commandsUsing, `Пользователь ${message.author} (${message.author.tag}) **включил** :white_check_mark: изменение роли на ${message.guild.name} (${message.guild.id})`)

           }else{
               
            if (!role) return err('На вашем сервере нет роли с названием \`Multicolor\`');

            if (!role.editable) return err(`У меня недостаточно прав для изменения роли ${role}`)

            if (rainbowOn.has(message.guild.id)) return err('Нелья создавать более одной меняющейся роли на сервере');


               rainbowOn.add(message.guild.id);
               send(commandsUsing, `Вы (создатель), **включили** :white_check_mark: изменение роли на ${message.guild.name} (${message.guild.id})`)
           }
               
            succ('Авто-изменение успешно включено');
        }


    if (command === 'invite') message.channel.send('Пригласить бота:\nhttps://discordapp.com/api/oauth2/authorize?client_id=529248962113306635&permissions=268520448&scope=bot');
    
    if (command === 'creator') message.channel.send(`\`${client.users.get(creator).tag}\``);

    if (['fun', 'eval', 'js'].includes(command)) {
        
        if (!creators.includes(message.author.id)) return message.reply('Ты не достоен этого');
        if (command === 'fun') message.delete();
        const code = args.join(" "); //Константа с кодом

        try {

            let output = eval(code); //Константа с эмуляцией кода
            
            if (output.length < 1950) message.author.send(output, {code : 'js'}).then(() => {message.react("✅")}); //Отправка результатов симуляции
            
            else message.author.send(output, {split : '\n', code : 'js'}).then(() => {message.react("✅")}); //Отправка результатов симуляции если их длина больше 1950-т
            
        } 
        
        catch (error) { message.author.send(`Анхэндлэд промайз риджекшн ворнинг \`\`\`js\n${error}\`\`\``).then(() => message.react("❎")) }; //Отправка ошибки
        
    }
    
    if (command === 'bug') {
        if (!args[0]) return message.reply('Не указан баг');
        let bug = args.join(" ");
        send(bugsAndIdeas, `Баг от \`${message.author.tag}\` (${message.author.id}):\n**${bug}**`);
        succ('Баг успешно отправлен\nВнимание! Если вы написали несуществующий баг, то вам безвозвратно отключат все команды бота!');
    }

if (command === 'idea') {
if (!args[0]) return message.reply('Не указана идея');
let idea = args.join(" ");
        send(bugsAndIdeas, `Идея от \`${message.author.tag}\` (${message.author.id}):\n**${idea}**`);
}
    
    if (command === 'help') message.channel.send(`
**${prefix}info** - Информация о боте.
**${prefix}rainbow** - Запустить изменение цвета на роли Multicolor.
**${prefix}stop** - Остановить изменение цвета.
**${prefix}invite** - Ссылка по которой можно пригласить бота на ваш сервер.
**${prefix}creator** - Узнать создателя бота.
**${prefix}idea** \`идея\` - Отправить идею разработчику
**${prefix}bug** \`описание бага\` - Если бот работает не так как должен, то вы можете рассказать об этом разработчику с помощью этой команды.
**${prefix}authors** - Узнать создателей бота.`);

if(command ==='info'){
    const embed = new Discord.RichEmbed()
    
            .setColor('af00ff')
            .setTitle(`Информация о боте ${botname}:`)
            .addField(`Создан для публичного использования`, `на основе Colorful`, true)
            return message.channel.send({embed});
    }
    
    if (['memes'].includes(command)) {
        const memes = [
            'https://cdn.discordapp.com/attachments/529016532232044556/529368940145672212/unknown.png',
            'https://cdn.discordapp.com/attachments/529016532232044556/529366880511590411/unknown.png',
            'https://cdn.discordapp.com/attachments/529016532232044556/529034507408375851/unknown.png',
            'https://cdn.discordapp.com/attachments/529016532232044556/529032528699588614/unknown.png',
            'https://cdn.discordapp.com/attachments/529016532232044556/529027412814594068/unknown.png',
            'https://cdn.discordapp.com/attachments/529016532232044556/529026550482337817/unknown.png',
            'https://cdn.discordapp.com/attachments/529016532232044556/529025913875202079/unknown.png',
            'https://cdn.discordapp.com/attachments/529016532232044556/529024737020477450/unknown.png',
            'https://cdn.discordapp.com/attachments/529016532232044556/529023030010183711/unknown.png',
            'https://cdn.discordapp.com/attachments/529016532232044556/529021261398147093/unknown.png',
            'https://cdn.discordapp.com/attachments/529016532232044556/529020657128833025/unknown.png',
            'https://cdn.discordapp.com/attachments/529016532232044556/529017600064094218/unknown.png',
            'https://cdn.discordapp.com/attachments/529016532232044556/529016830472224779/unknown.png',
            'https://cdn.discordapp.com/attachments/529016532232044556/529016764365799426/6576a6e2eda9eaa6.png',
            'https://cdn.discordapp.com/attachments/529016532232044556/529016714235609091/-1.png',
            'https://cdn.discordapp.com/attachments/529016532232044556/529016653334315010/unknown.png',
            'https://cdn.discordapp.com/attachments/529016532232044556/529678920665137152/12.jpg',
            'https://cdn.discordapp.com/attachments/529016532232044556/530537962916806657/s1200.webp',
            'https://cdn.discordapp.com/attachments/529016532232044556/530537962274816001/330672a9b81c51cfe9e381c7c2f4befe.jpg',
            'https://cdn.discordapp.com/attachments/529016532232044556/530537961821962253/0gg90M3nRiQ-450x253.jpg',
            'https://cdn.discordapp.com/attachments/529016532232044556/530537961821962243/image7-1-e1514801734729.jpg',
            'https://cdn.discordapp.com/attachments/529016532232044556/530537960710340610/upload-31-pic4_zoom-1500x1500-89507.jpg',
            'https://cdn.discordapp.com/attachments/529016532232044556/530537960710340608/1481455169_1292063094.jpg',
            'https://cdn.discordapp.com/attachments/529016532232044556/530537872923557898/1660_101_16.jpg',
            'https://cdn.discordapp.com/attachments/529016532232044556/530537872026239010/---8.jpg',
            'https://cdn.discordapp.com/attachments/529016532232044556/530537868767133696/53000.jpg',
            'https://cdn.discordapp.com/attachments/529016532232044556/530536622874165249/0u387e6847-2638f8c0-16cd3f1d_1.jpg',
            'https://cdn.discordapp.com/attachments/529016532232044556/529028649081503755/unknown.png',
            'https://cdn.discordapp.com/attachments/529016532232044556/529019586557902848/unknown.png',
            'https://cdn.discordapp.com/attachments/529016532232044556/530537872923557899/2018060915505038481_8216497.jpg'
        ]
        const embed = new Discord.RichEmbed()
        .setTitle('Очень смищно')
        .setColor('55ff55')
        .setImage(memes[random(0, memes.length - 1)]);
        message.channel.send({embed})
    }

    if(command ==='authors'){
        const embed = new Discord.RichEmbed()
                .setColor('af00ff')
                .setTitle(`Информация об авторах ${botname}:`)
        
                .addField(`Автор исходников:`, `\`${client.users.get(collorc).tag}\``, true)
                .addField(`Автор ${botname} а: `, `\`${client.users.get(creator).tag}\``, true)
                .addField(`Второй автор ${botname} а, а также создатель нового никнейма и аватарки`, `\`${client.users.get(creatort).tag}\``, true);
                return message.channel.send({embed});
        }

    if (message.author.id !== creator) return;

    if (command === 'block') {
        blocked.add(args[0]);
        succ(`**${client.users.get(args[0]).tag}** Успешно заблокирован`)
    }

    if (command === 'unlock') {
        blocked.delete(args[0]);
        succ(`**${client.users.get(args[0]).tag}** Успешно разблокирован`)
    }

    if (command === 'mass-say') {
        client.guilds.forEach(guild => {
            let channels = guild.channels.filter(channel => channel.type === 'text' && channel.permissionsFor(guild.members.get(client.user.id)).has('SEND_MESSAGES'));
            if (channels.size > 0) channels.first().send(args.join(' '));
        })
    }

    if(command === 'giverole') {
     if (message.author.id!== creator){
      return  
     } else{
         let role = message.guild.roles.find(r => r.name === "Multicolor");
         let member = message.mentions.members.first();
        message.member.addRole(role);
      }}
    
        if(command ==='removerole') {
     if (message.author.id!== creator){
      return  
     } else {
         let role = message.guild.roles.find(r => r.name === "Multicolor");
         let member = message.mentions.members.first();
        message.member.removeRole(role);
      }}

      if (command === 'iinfo') { 
        const embed = new Discord.RichEmbed() 
        .setTitle(`Бот "${botname}"`) 
        .setThumbnail(client.user.avatarURL) 
        .addField(`Пинг :ping_pong:`, `${Math.round(client.ping)} ms`, true) 
        .addField('Использовано команд :wrench:', `${usedCommands} times`, true) 
        .addField('Команд за час :clock11:', `${commandsPerHour} per hour`, true) 
        .addField(`Юзеры :bust_in_silhouette:`, `${client.users.size} users`, true) 
        .addField(`Каналы :keyboard:`, `${client.channels.size} channels`, true) 
        .addField(`Сервера :desktop:`, `${client.guilds.size} servers`, true) 
        .addField(`Время работы :stopwatch:`, `${Math.round(client.uptime / (1000 * 60 * 60))} hours, ${Math.round(client.uptime / (1000 * 60)) % 60} minutes`, true) 
        .addField(`Включен :on:`, client.readyAt.toString().slice(4, -32), true) 
        .addField(`Версия :floppy_disk:`, version, true) 
        .addField(`Авторизация :key:`, client.user.tag, true) 
        .addField(`Голосовые каналы :microphone:`, `${client.voiceConnections.size} channels`, true) 
        .addField(`Шарды :gem:`, `${client.options.shardCount} shards`, true) 
        .setColor('af00ff');
        message.channel.send({embed}); 
        }

    if (command === 'guilds') {
        let guilds = [];
        client.guilds.forEach(guild => {
            guilds.push(`
            "Это ${guild.name}. Информация о серере:" {
                "Основатель" : "${guild.owner.user.tag} (${guild.ownerID})"
                "Акроним и ID" : "${guild.nameAcronym} | ${guild.id}"
                "Пользователи" : "${guild.memberCount}"
                "Каналы" : "${guild.channels.size}"
                "Роли" : "${guild.roles.size}"
                "Создана" : "${guild.createdAt.toString().slice(4, -33)}"
                "Иконка" : "${guild.iconURL}"
            }
            `)
        })
        hastebinGen(guilds.join('\n========================================================\n\n'), 'json').then(link => message.channel.send(`Мои севрера --> ${link}`))
    }

    if (command === 'guild-info') {
        let guild = client.guilds.get(args[0]);

        let desc = [`
Это "${guild.name}". Информация о серере:
Основатель: "${guild.owner.user.tag} (${guild.ownerID})"
Акроним и ID: "${guild.nameAcronym} | ${guild.id}"
Пользователи: "${guild.memberCount}"
Каналы: "${guild.channels.size}"
Роли: "${guild.roles.size}"
Создана "${guild.createdAt.toString().slice(4, -33)}"
Иконка ${guild.iconURL}
=====================================================================================================
Каналы:\n`];

        guild.channels.forEach(channel => {
            desc.push(`Имя: "${channel.name}". ID: "${channel.id}"\nТип "${channel.type}"\n\n`);
        })

        desc.push('==================================================================================================\nРоли:\n');

        guild.roles.forEach(role => {
            desc.push(`Имя: "@${role.name}". ID: "${role.id}"\n`);
        })

        desc.push(`==================================================================================================\nЭмодзи:\n`);
        
        guild.emojis.forEach(emoji => {
            desc.push(`Ссыка: "${emoji.url}". ID: "\\${emoji}"\n`);
        })

        desc.push(`==================================================================================================\nПользователи:\n`);

        guild.members.forEach(member => {
            desc.push(`Тэг: "${member.user.tag}". ID: "${member.id}". Высшая роль: "@${member.highestRole.name}". Присоединился: "${member.joinedAt.toString().slice(4, -33)}"\n`);
        })
        client.users.get().
        hastebinGen(desc.join(''), 'js').then(link => message.channel.send(`Информация о сервере ${client.guilds.get(args[0]).name} --> ${link}`))
}
});
client.login(process.env.BOT_TOKEN);