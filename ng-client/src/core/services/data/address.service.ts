import { Injectable, EventEmitter } from '@angular/core';

import { NodeService } from './node.service';
// import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import * as CONST from '../../common/constants';
import { UnitOfTime } from '../../../models';
import { AddressListModel } from '../../../models';
import { PageResultModel } from '../../../models';
import { AddressDetailsModel } from '../../../models';

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    public bestBlock = 0;
    public bestBlockChanged = new EventEmitter<number>();

    constructor(
        private http: HttpClient,
        private nodeService: NodeService) {
        this.subscribeToEvents();
    }

    private subscribeToEvents(): void {
        this.nodeService.nodeBlockInfo.subscribe((x: number) => {
            if (this.bestBlock < x) {
                this.bestBlock = x;
                this.bestBlockChanged.emit(this.bestBlock);
            }
        });
    }

    public getAddressesPage(page: number = 1, pageSize: number = 10) {
        return this.http.get<PageResultModel<AddressListModel>>(`${CONST.BASE_URL}/api/address/list?page=${page}&pageSize=${pageSize}`);
    }

    public getAddress(address: string) {
        return this.http.get<AddressDetailsModel>(`${CONST.BASE_URL}/api/address/get/${address}`);
    }

    public getTopNeo() {
        return this.http.get<AddressListModel[]>(`${CONST.BASE_URL}/api/address/topneo`);
    }

    public getTopGas() {
        return this.http.get<AddressListModel[]>(`${CONST.BASE_URL}/api/address/topgas`);
    }

    public getChartData() {
        return this.http.post(`${CONST.BASE_URL}/api/address/chart`, {
            unitOfTime: 1
        });
    }

    public getActive() {
        return this.http.get<number>(`${CONST.BASE_URL}/api/address/active`);
    }

    public getCreated() {
        return this.http.get(`${CONST.BASE_URL}/api/address/created`);
    }

    public getCreatedLast(unit: UnitOfTime) {
        return this.http.get<number>(`${CONST.BASE_URL}/api/address/createdlast?unit=${unit}`);
    }
}
