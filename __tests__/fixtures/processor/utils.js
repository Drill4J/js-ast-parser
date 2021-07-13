/*
 * Copyright 2019 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const collectFilterEntities = (query = {}) =>
  Object.keys(query).reduce((result, key) => {
    if (key.indexOf(PREDEFINED_FILTER_PREFIX) === 0) {
      const [, filterName] = key.split('.');  // first (skipped) element is parsed as "null" 
      return {
        ...result,
        [filterName]: { value: query[key] || null },
      };
    }
    if (key.indexOf(FILTER_PREFIX) !== 0) {
      return result;
    }
    const [, condition, filterName] = key.split('.');
    return {
      ...result,
      [filterName]: {
        condition,
        value: query[key] || null,
      },
    };
  }, {});
