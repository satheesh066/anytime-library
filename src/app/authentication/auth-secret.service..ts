import { Injectable } from '@angular/core';

@Injectable()
export class AuthSecretService {

    constructor() { }

    static getConfig() {
        return {
            tenantId: 'mindtree.com',
            clientId: 'c5e0e590-3b57-4454-b679-3c347c39a4fc',
            endpoints: {
                'http://localhost:4200/': 'the id'
            }
        };
    }

}
