import { client } from '../main';
import { Command } from '../types/Command';
import { Message } from 'discord.js-selfbot-v13';

const pingCommand: Command = {
	name: 'ping',
	description: '🏓Gatewayとのレイテンシを確認します。',
	async execute(message: Message, args: string[]) {
		message.channel.send(`Pong! (${client.ws.ping}ms)`);
	},
};

export default pingCommand;
