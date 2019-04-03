// Type definitions for dotenv-flow
// Project: https://github.com/kerimdzhanov/dotenv-flow
// Definitions by: Seth Stephens <https://github.com/FNCxPro>

/// <reference types="node" />

declare module 'dotenv-flow' {
  interface DotenvParseOptions {
    /**
     * You may turn on logging to help debug why certain keys or values are not being set as you expect.
     */
    debug?: boolean;
  }

  interface DotenvParseOutput {
    [name: string]: string;
  }

  interface DotenvConfigOptions {
    /**
     * You may specify a custom path if your file containing environment variables is located elsewhere.
     */
    path?: string;

    /**
     * You may specify the encoding of your file containing environment variables.
     */
    encoding?: string;

    /**
     * You may turn on logging to help debug why certain keys or values are not being set as you expect.
     */
    debug?: boolean;
  }

  interface DotenvConfigOutput {
    error?: Error;
    parsed?: DotenvParseOutput;
  }

  interface DotEnvFlow {
    /**
     * Loads `.env` file contents into {@link https://nodejs.org/api/process.html#process_process_env | `process.env`}.
     * Example: 'KEY=value' becomes { parsed: { KEY: 'value' } }
     *
     * @param options - controls behavior
     * @returns an object with a `parsed` key if successful or `error` key if an error occurred
     *
     */
    config(options?: DotenvConfigOptions): DotenvConfigOutput;

    /**
     * Parses a string or buffer in the .env file format into an object.
     *
     * @param src - contents to be parsed
     * @param options - additional options
     * @returns an object with keys and values based on `src`
     */
    parse(
      src: string | Buffer,
      options?: DotenvParseOptions
    ): DotenvParseOutput;
  }
  var def: DotEnvFlow;
  export = def;
}
