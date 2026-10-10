declare namespace DeepX.MdBlogs {
    let roles: Record<string, NameValueModel>;
    class NameValueModel {
        private _model;
        constructor(m: INameValueModel | string);
        get name(): string | undefined;
        get value(): string | undefined;
        getName(options?: ILocalePropOptions<string>): any;
    }
    class ContributorCollection {
        private _model;
        private _defaultRole;
        private _keys;
        constructor(list: IContributorsInfo, contributors: IContributorInfo[], roles: INameValueModelDefinitions, defaultRole: string | string[]);
        list(role: string): IRoleContributorInfo;
        filter(role?: string | string[]): IRoleContributorInfo[];
        priorityList(): IRoleContributorInfo[];
        roles(): string[];
        all(): IRoleContributorInfo[];
    }
    function formatContributors(contributors: string | (string | IContributorInfo)[], refs: DeepX.MdBlogs.IContributorInfo[], options?: {
        mkt?: string | boolean;
    }): IContributorInfo[];
    function toMembers(list: IRoleContributorInfo[]): IContributorInfo[];
    function nameValueModels(list: INameValueModelValue, defs?: INameValueModelDefinitions): NameValueModel[];
}
