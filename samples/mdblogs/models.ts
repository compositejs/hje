namespace DeepX.MdBlogs {
    export let roles: Record<string, NameValueModel>;

    export class NameValueModel {
        private _model: INameValueModel;

        constructor(m: INameValueModel | string) {
            if (!m) this._model = { value: undefined };
            else if (typeof m === "string") this._model = { value: m };
            else this._model = m;
        }

        get name() {
            return this._model.name || this._model.value;
        }

        get value() {
            return this._model.value;
        }

        getName(options: ILocalePropOptions<string>) {
            return getLocaleProp(this._model, null, options) || this._model.value;
        }
    }

    export class ContributorCollection {
        private _model: Record<string, IRoleContributorInfo>;
        private _defaultRole: string[];
        private _keys: string[];

        constructor(list: IContributorsInfo, contributors: IContributorInfo[], roles: INameValueModelDefinitions, defaultRole: string | string[]) {
            if (defaultRole && typeof defaultRole === "string") defaultRole = [defaultRole];
            if (!defaultRole || !(defaultRole instanceof Array) || defaultRole.length < 1) defaultRole = ["contributor"];
            else if (!defaultRole[0]) defaultRole[0] = "contributor";
            this._defaultRole = defaultRole;
            this._model = {};
            this._keys = [];
            if (!list) return;
            if (typeof list === "string") list = [list];
            const defs = formatNameValueModelDefs(roles);
            if (list instanceof Array) {
                list = {
                    [defaultRole[0]]: list
                };
            }

            const keys = Object.keys(list);
            if (!contributors) contributors = [];
            for (let i = 0; i < keys.length; i++) {
                const roleName = keys[i];
                if (!roleName) continue;
                let members = list[roleName];
                if (!members) continue;
                if (typeof members === "string") members = [members];
                if (!(members instanceof Array)) continue;
                const arr: IRoleContributorInfo = { role: defs[roleName] || getRole(roleName) || new NameValueModel(roleName), members: [] };
                for (let j = 0; j < members.length; j++) {
                    let item = members[j];
                    if (!item) continue;
                    if (typeof item === "string") {
                        for (let k = 0; k < contributors.length; k++) {
                            const contributor = contributors[k];
                            if (!contributor) continue;
                            if (contributor.name === item || contributor.email === item) item = contributor;
                        }

                        if (typeof item === "string") {
                            const atPos = item.indexOf("@");
                            item = atPos > 0 && item.lastIndexOf(".") > atPos ? { name: item, email: item } : { name: item };
                        }
                    }

                    arr.members.push(item);
                }

                if (arr.members.length < 1) continue;
                this._model[roleName] = arr;
                this._keys.push(roleName);
            }
        }

        list(role: string) {
            return this._model[role || this._defaultRole[0]];
        }

        filter(role?: string | string[]) {
            if (!role) return [];
            if (typeof role === "string") {
                if (role === "*") return this.all();
                role = [role];
            }

            const arr: IRoleContributorInfo[] = [];
            const model = this._model;
            for (let i = 0; i < role.length; i++) {
                const item = model[role[i]];
                if (!item) continue;
                arr.push(item);
            }

            return arr;
        }

        priorityList() {
            return this.filter(this._defaultRole);
        }

        roles() {
            return [...this._keys];
        }

        all() {
            const arr: IRoleContributorInfo[] = [];
            const keys = this._keys;
            const model = this._model;
            for (let i = 0; i < keys.length; i++) {
                const item = model[keys[i]];
                if (!item) continue;
                arr.push(item);
            }

            return arr;
        }
    }

    export function formatContributors(contributors: string | (string | IContributorInfo)[], refs: DeepX.MdBlogs.IContributorInfo[], options?: {
        mkt?: string | boolean;
    }) {
        if (!contributors) return [];
        if (typeof contributors === "string") contributors = [contributors];
        if (!refs) refs = [];
        return contributors.map(item => {
            if (!item) return undefined;
            if (typeof item === "string") {
                for (let i = 0; i < refs.length; i++) {
                    const ele = refs[i];
                    if (ele.name === item || getLocaleProp(ele, null, options) === item || ele.email === item) return ele;
                }

                const pos = item.indexOf("@");
                if (pos < 0) return { name: item };
                if (pos === 0) return item.length > 1 ? { name: item.substring(1) } : undefined;
                const pos2 = item.indexOf(".", pos);
                return pos2 > 0 ? { name: item.substring(0, pos), email: item } : { name: item };
            }

            return item.name ? item : undefined;
        }).filter(item => item) as DeepX.MdBlogs.IContributorInfo[];
    }

    export function toMembers(list: IRoleContributorInfo[]) {
        const arr: IContributorInfo[] = [];
        if (!list) return arr;
        for (let i = 0; i < list.length; i++) {
            const item = list[i]?.members;
            if (!item) continue;
            for (let j = 0; j < item.length; j++) {
                const member = item[j];
                if (member && arr.indexOf(member) < 0) arr.push(member);
            }
        }

        return arr;
    }

    export function nameValueModels(list: INameValueModelValue, defs?: INameValueModelDefinitions) {
        const arr: NameValueModel[] = [];
        if (!list) return arr;
        const defs2 = formatNameValueModelDefs(defs);
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (!item) continue;
            if (item instanceof NameValueModel) {
                arr.push(item);
                continue;
            }

            if (typeof item === "string") {
                const item2 = defs2[item];
                arr.push(item2 || new NameValueModel(item));
                continue;
            }

            if (!item.value) continue;
            arr.push(new NameValueModel(item));
        }

        return arr;
    }

    function getRole(name: string) {
        if (!name) return undefined;
        if (!roles) {
            roles = {
                producer: new NameValueModel({ name: "Producer", "name#zh": "出品人", value: "producer" }),
                "executive producer": new NameValueModel({ name: "Executive producer", "name#zh": "监制", value: "executive producer" }),
                contributor: new NameValueModel({ name: "Contributor", "name#zh": "贡献者", value: "contributor" }),
                author: new NameValueModel({ name: "Author", "name#zh": "作者", value: "author" }),
                translator: new NameValueModel({ name: "Translator", "name#zh": "翻译", value: "translator" }),
                editor: new NameValueModel({ name: "Editor", "name#zh": "编辑", value: "editor" }),
                "chief editor": new NameValueModel({ name: "Chief editor", "name#zh": "主编", value: "chief editor" }),
                director: new NameValueModel({ name: "Director", "name#zh": "导演", value: "director" }),
                star: new NameValueModel({ name: "Star actor", "name#zh": "主演", value: "star" }),
                actor: new NameValueModel({ name: "Actor", "name#zh": "演员", value: "actor" }),
                dev: new NameValueModel({ name: "Developer", "name#zh": "研发", value: "dev" }),
                qa: new NameValueModel({ name: "QA", "name#zh": "测试", value: "qa" }),
                pm: new NameValueModel({ name: "Product Manager", "name#zh": "产品经历", value: "pm" }),
                pmo: new NameValueModel({ name: "PMO", "name#zh": "项目经历", value: "pmo" }),
                photographer: new NameValueModel({ name: "Photographer", "name#zh": "摄影师", value: "photographer" }),
                cameraman: new NameValueModel({ name: "Cameraman", "name#zh": "摄像师", value: "cameraman" }),
                designer: new NameValueModel({ name: "Designer", "name#zh": "设计师", value: "designer" }),
                "film editor": new NameValueModel({ name: "Film editor", "name#zh": "剪辑师", value: "film editor" }),
                "visual effects": new NameValueModel({ name: "Visual Effects", "name#zh": "特效师", value: "visual effects" }),
                painter: new NameValueModel({ name: "Painter", "name#zh": "画师", value: "painter" }),
                illustrator: new NameValueModel({ name: "Illustrator", "name#zh": "插画师", value: "illustrator" }),
                dj: new NameValueModel({ name: "DJ", value: "dj" }),
                composer: new NameValueModel({ name: "Composer", "name#zh": "作曲", value: "composer" }),
                lyricist: new NameValueModel({ name: "Lyricist", "name#zh": "作词", value: "lyricist" }),
                writer: new NameValueModel({ name: "Original writer", "name#zh": "原著作者", value: "writer" }),
                vocal: new NameValueModel({ name: "Vocal", "name#zh": "主唱", value: "vocal" }),
                singer: new NameValueModel({ name: "Singer", "name#zh": "演唱", value: "singer" }),
                dancer: new NameValueModel({ name: "Dancer", "name#zh": "舞者", value: "dancer" }),
                arranger: new NameValueModel({ name: "Arranger", "name#zh": "编曲", value: "arranger" }),
                host: new NameValueModel({ name: "Host", "name#zh": "主持人", value: "host" }),
                "permanent guests": new NameValueModel({ name: "Permanent guests", "name#zh": "常驻嘉宾", value: "permanent guests" }),
                "special guests": new NameValueModel({ name: "Special guests", "name#zh": "飞行嘉宾", value: "special guests" }),
            };
        }

        return roles[name];
    }

    function formatNameValueModelDefs(defs: INameValueModelDefinitions, ensure?: boolean) {
        const defs2: Record<string, NameValueModel> = {};
        if (defs instanceof Array) {
            for (let j = 0; j < defs.length; j++) {
                const item = defs[j];
                if (!item || !item.value) continue;
                defs2[item.value] = item instanceof NameValueModel ? item : new NameValueModel(item);
            }
        } else if (defs) {
            const keys = Object.keys(defs);
            for (let j = 0; j < keys.length; j++) {
                const key = keys[j];
                if (!key) continue;
                const item = defs[key];
                if (!item) continue;
                if (typeof item === "string") {
                    if (item) defs2[key] = new NameValueModel({ name: item, value: key });
                } else if (item === true) {
                    defs2[key] = new NameValueModel(key);
                } else if (item.value) {
                    defs2[key] = item instanceof NameValueModel ? item : new NameValueModel(item);
                }
            }
        }

        return defs2;
    }
}
