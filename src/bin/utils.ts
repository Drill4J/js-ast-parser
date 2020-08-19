import axios from 'axios';
import glob from 'fast-glob';
import fsExtra from 'fs-extra';
import joi from 'joi';

export async function send(url: string, data: unknown) {
  return await axios.post(url, data, {
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  })
}

export function findFilePaths(pattern, ignore) {
  const result = glob.sync(pattern, {
    onlyFiles: true,
    dot: true,
    ignore
  });

  if (!Array.isArray(result) || result.length === 0) {
    throw new Error(`No source files found\n\tpattern ${pattern}${Array.isArray(ignore) ? `\n\tignored ${ignore.join(', ')}` : ''}`);
  }
  return result;
}

const configSchema = joi.object({
  sources: joi.object({
    pattern: joi.alternatives(
      joi.string().required(),
      joi.array().items(joi.string().required()).min(1).required()
    ).required(),
    ignore: joi.array().items(joi.string()),
    output: joi.alternatives(
      joi.object({
        url: joi.string().uri().required(),
        path: joi.string().required(),
        spaces: joi.alternatives(joi.string(), joi.number())
      }),
      joi.object({
        url: joi.string().uri().required(),
      }),
      joi.object({
        path: joi.string().required(),
        spaces: joi.alternatives(joi.string(), joi.number())
      }),
    )
  }).required(),
  
  sourcemaps: joi.object({
    pattern: joi.alternatives(
      joi.string().required(),
      joi.array().items(joi.string().required()).min(1).required()
    ).required(),
    ignore: joi.array().items(joi.string()),
    output: joi.object({
      url: joi.string().uri().required(),
    }).required()
  }),
}).options({ stripUnknown: true })

export function getConfig(path): Record<string,any> {
  let rawConfig
  try {
    rawConfig = fsExtra.readJsonSync(path);
  } catch {
    throw new Error(`failed to parse config: ${path}`)
  }
  const { error, value: config} = configSchema.validate(rawConfig);
  if (error) {
    throw new Error(`invalid config: ${error.message}`)
  }

  return config;
}
