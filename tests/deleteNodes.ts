import { AstParser } from "../src/parser"

import { DataExtractor } from "../src/extractor";
import { detailedDiff } from "deep-object-diff";

const parser = new AstParser()

const ast = parser.parse("./tests/test-data/original/episode.ts")

const extractor = new DataExtractor(); 

const data = extractor.deleteLocation(ast)






