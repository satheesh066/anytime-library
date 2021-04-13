import { environment } from '../../environments/environment';

export class UrlService {

    constructor() { }

    public generateUrl (fragment: string): string {
        return environment.apiBaseUri + fragment;
    }

}
