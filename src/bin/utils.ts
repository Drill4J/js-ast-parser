import glob from 'fast-glob';
import fsExtra from 'fs-extra';
import joi from 'joi';

export function findFilePaths(pattern, ignore) {
  const result = glob.sync(pattern, {
    onlyFiles: true,
    dot: true,
    ignore,
  });

  return result;
}

const configSchema = joi
  .object({
    sources: joi
      .object({
        pattern: joi.alternatives(joi.string().required(), joi.array().items(joi.string().required()).min(1).required()).required(),
        ignore: joi.array().items(joi.string()),
      })
      .required(),

    bundle: joi
      .object({
        pattern: joi.alternatives(joi.string().required(), joi.array().items(joi.string().required()).min(1).required()).required(),
        ignore: joi.array().items(joi.string()),
      })
      .required(),

    sourcemaps: joi.object({
      pattern: joi.alternatives(joi.string().required(), joi.array().items(joi.string().required()).min(1).required()).required(),
      ignore: joi.array().items(joi.string()),
    }),

    output: joi
      .alternatives(
        joi.object({
          agentId: joi.string().required(),
          agentApiUrl: joi.string().uri().required(),
          path: joi.string().required(),
          spaces: joi.alternatives(joi.string(), joi.number()),
        }),
        joi.object({
          agentId: joi.string().required(),
          agentApiUrl: joi.string().uri().required(),
        }),
        joi.object({
          path: joi.string().required(),
          spaces: joi.alternatives(joi.string(), joi.number()),
        }),
      )
      .required(),
  })
  .options({ stripUnknown: true });

export function getConfig(path): Record<string, any> {
  if (!path) {
    throw new Error('path to config file is required (use -c or --config)');
  }
  let rawConfig;
  try {
    rawConfig = fsExtra.readJsonSync(path);
  } catch {
    throw new Error(`failed to parse config: ${path}`);
  }
  const { error, value: config } = configSchema.validate(rawConfig);
  if (error) {
    throw new Error(`invalid config: ${error.message}`);
  }

  return config;
}
