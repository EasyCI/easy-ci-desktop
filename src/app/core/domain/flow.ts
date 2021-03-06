import {BaseEntity} from './base';

export class Flow extends BaseEntity {
  id: string;
  name: string;
  userEmail: string;
  repoOrigin: string;
  repoId: number;
  hookId: number;
  platform: string;
  version: string;
  triggerPush: string[];
  plugins: string[];
  needEnv: string[];

  constructor(id: string, name: string, userEmail: string,
              repoOrigin: string, repoId: number, hookId: number,
              platform: string, version: string,
              triggerPush: string[], plugins: string[], needEnv: string[]) {
    super();
    this.id = id;
    this.name = name;
    this.userEmail = userEmail;
    this.repoOrigin = repoOrigin;
    this.repoId = repoId;
    this.hookId = hookId;
    this.platform = platform;
    this.version = version;
    this.triggerPush = triggerPush;
    this.plugins = plugins;
    this.needEnv = needEnv;
  }
}
