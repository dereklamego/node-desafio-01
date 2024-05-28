import { parse } from 'csv-parse';
import fs from 'node:fs';


const __dirname = new URL('.', import.meta.url).pathname;

const csvParse = parse({
  delimite: ',',
  skipEmptyLines: true,
  fromLine: 2
})

const parser = fs.createReadStream(`${__dirname}/tasks.csv`)

const processFile = async () => {
  const linesParse = parser.pipe(csvParse)

  for await (const line of linesParse) {
    const [title, description] = line;

    await fetch('http:localhost:3334/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description
      })
    })
  }
  await wait(1000);
}

processFile();


function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}