import { Client, Collection } from 'discord.js-selfbot-v13';
import { readdirSync } from 'fs';
import { join } from 'path';
import config from '../config.ts';
import './types/Client.d.ts';
import { Command } from './types/Command';
import './utils/shutdown.ts';
import { checkperm } from './utils/checkperm.ts';
import { logger } from './internal/Logger.ts';
import { WhiteListManager } from './internal/WhiteList.ts';
// ESModuleじゃ使えない__dirnameを再現する
const __filename = import.meta.filename
export const __dirname = import.meta.dirname

export const client = new Client({
	ws: {
		properties: {
			browser: 'Discord iOS',
		},
	},
});

export const wlm = new WhiteListManager();
wlm.loadFromConfig();

client.commands = new Collection<string, Command>();

const commandFiles = readdirSync(join(__dirname, 'commands')).filter((file) => file.endsWith('.ts'));

export const commandlist: { name: string; description: string }[] = [];

(async () => {
	const loadCommands = commandFiles.map(async (file) => {
		const commandModule = await import(`./commands/${file}`);
		const command: Command = commandModule.default;
		commandlist.push({
			name: command.name,
			description: command.description,
		});
		client.commands.set(command.name, command);
		logger.info(`Loaded ${command.name} command`);
	});
	await Promise.all(loadCommands);
})();

client.on('ready', (client) => {
	logger.success(`${client.user.username} is Ready!`);
});

client.on('messageCreate', async (message) => {
	if (message.author.bot || (!wlm.getIDs().includes(message.author.id) && !checkperm(message.author.id))) return;
	if (!message.content.startsWith(config.discord.prefix)) return;
	const args = message.content.slice(config.discord.prefix.length).trim().split(/ +/);
	const commandName = args.shift()!.toLowerCase();
	if (!client.commands.has(commandName)) return;
	const command = client.commands.get(commandName);
	logger.log(`${message.author.username} used ${commandName}`);
	try {
		await command?.execute(message, args);
	} catch (e) {
		logger.error(e);
		message.reply(`**Error**\n` + e);
	}
});

client.login(config.discord.token);

process.on('uncaughtException', function (e) {
	logger.fail('an internal error occured');
	logger.error(e);
});
