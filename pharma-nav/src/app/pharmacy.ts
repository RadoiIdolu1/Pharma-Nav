import { Medicine } from "./medicine";

export interface Pharmacy {
    id: number;
    email : string;             //Neded to edentify info for the dashboard
    password: string;
    name : string;
    latitude : number;
    longitude : number;
    meds : Medicine [];
}
