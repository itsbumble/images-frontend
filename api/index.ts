import matter from "gray-matter";
import marked from "marked";
import fs from "fs";
import path from "path";
function readdirRecursive(directory: string) {
	const result = [];

	(function read(dir) {
		const files = fs.readdirSync(dir);

		for (const file of files) {
			const filepath = path.join(dir, file);

			if (fs.statSync(filepath).isDirectory()) {
				read(filepath);
			} else {
				result.push(filepath);
			}
		}
	})(directory);

	return result;
}
export async function getDocs() {
	const context = readdirRecursive(path.join(process.cwd(), "_docs"));
	const posts = [];
	for (const key of context) {
		const meta = matter(fs.readFileSync(key));
		posts.push({
			...meta.data,
			slug: key.split("_docs/").slice(1).join("/").replace(".md", ""),
			title: meta.data.title || key.split("_docs").slice(1).join("/"),
		});
	}
	return posts;
}

export async function getDocBySlug(slug: any) {
	const fileContent = await fs.readFileSync(`${process.cwd()}/_docs/${slug}.md`, { encoding: "ascii" });
	const meta = matter(fileContent);

	const content = marked(meta.content);

	return {
		...meta.data,
		title: meta.data.title,
		content: content,
	};
}
