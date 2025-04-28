import config from '../../config.ts';

export function checkperm(id: string) {
	if (config.discord.adminIds.includes(id)) {
		return true;
	} else {
		return false;
	}
}
