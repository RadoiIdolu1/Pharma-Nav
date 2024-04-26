import { Medicine } from "./medicine";

export interface Pharmacy {
    id: number;
    name : string;
    latitude : number;
    longitude : number;
    meds : Medicine [];
}
