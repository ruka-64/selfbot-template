import fs from 'fs';
export class WhiteListManager {
	private userIDs: string[] = [];

	addIDs(id: string): void {
		this.userIDs.push(id);
		this.updateConfigFile();
	}
	rmIDs(id: string): void {
		const index = this.userIDs.indexOf(id);
		if (index !== -1) {
			this.userIDs.splice(index, 1);
			this.updateConfigFile();
		}
	}
	getIDs(): string[] {
		return this.userIDs;
	}

	loadFromConfig(): void {
		const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
		this.userIDs = config.discord.whitelistedIDs;
	}

	private updateConfigFile(): void {
		const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
		config.discord.whitelistedIDs = this.userIDs;
		fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
	}
}
