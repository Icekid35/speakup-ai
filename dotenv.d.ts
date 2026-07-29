declare module 'dotenv' {
  export interface DotenvConfigOptions {
    path?: string;
    override?: boolean;
    encoding?: string;
    debug?: boolean;
  }
  export interface DotenvConfigOutput {
    error?: Error;
    parsed?: { [key: string]: string };
  }
  export function config(options?: DotenvConfigOptions): DotenvConfigOutput;
  const dotenv: {
    config: (options?: DotenvConfigOptions) => DotenvConfigOutput;
  };
  export default dotenv;
}
