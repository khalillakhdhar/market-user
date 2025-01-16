import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuctionParticipant } from '../models/auction-participant.interface';

@Injectable({ providedIn: 'root' })
export class AuctionService {
    private apiUrl = '/auctions';

    constructor(private http: HttpClient) {}

    getAllAuctionParticipants(): Observable<AuctionParticipant[]> {
        return this.http.get<AuctionParticipant[]>(this.apiUrl);
    }

    deleteAuctionParticipant(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
