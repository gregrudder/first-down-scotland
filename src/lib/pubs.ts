import { readFileSync } from "node:fs";
import path from "node:path";
import { parsePubRecords, toPublicPub, type PublicPub } from "@/data/pub-directory";

function readPubsCsv(): string {
  return readFileSync(path.join(process.cwd(), "src/data/pubs.csv"), "utf8");
}

export function getPublicPubs(): PublicPub[] {
  return parsePubRecords(readPubsCsv()).map(toPublicPub);
}

export function listedPubNames(): string[] {
  return getPublicPubs().map((pub) => pub.name);
}
