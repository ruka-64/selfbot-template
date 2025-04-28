// src/types/Client.d.ts
import { Client } from 'discord.js-selfbot-v13';
import { Command } from './Command';

declare module 'discord.js-selfbot-v13' {
	export interface Client {
		commands: Collection<string, Command>;
	}
}
