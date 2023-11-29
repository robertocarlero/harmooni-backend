export interface Image {
	path: string;
	url: string;
	contentType: string;
	size: number;
	name: string;
	thumbnail?: Image | null;
}
