export class ResourcesShared {
  public static res: any = {};

  public static add(key: string, subKey: string, value: any): void {
    if (!ResourcesShared.res[key]) {
      ResourcesShared.res[key] = {};
    }

    if (!ResourcesShared.res[key][subKey]) {
      ResourcesShared.res[key][subKey] = [];
    }

    ResourcesShared.res[key][subKey].push(value);
  }

  public static list(key: string, subKey: string): any[] {
    return ResourcesShared.res[key][subKey];
  }
}
