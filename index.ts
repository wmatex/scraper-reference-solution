import {search} from "./search";

if (process.argv.length < 3) {
    console.error("No search query provided");
    process.exit(1);
}

async function main() {
    const searchQuery = process.argv[2];
    const results = await search(searchQuery);

    console.log(results);
}

main().then(() => process.exit(0));
